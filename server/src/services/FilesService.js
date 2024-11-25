import { kernel } from "sharp"
import { FileDTO } from "../models/file.js"
import { azBlobService } from "./AzureBlobService.js"
import { sharpService } from "./SharpService.js"
import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"


class FilesService {

  async getFileRecords(folder) {
    const files = await dbContext.Files.find({ folder })
    return files
  }
  async createFileRecord(payload) {
    const file = await dbContext.Files.create(payload)
    return file
  }
  /**
   * @param {FileDTO} file
   * @param {*} options
   */
  async uploadImage(file, { folder, container }) {
    const coldBackUp = await this.uploadFile(file, { temp: 'cold', folder })
    const sharpData = sharpService.fileToSharp(file.data, file.size)
    const { height, width, orientation } = await sharpData.metadata()
    coldBackUp.metadata ??= {}
    coldBackUp.metadata.width = width
    coldBackUp.metadata.height = height
    const largestDimension = orientation % 2 ? 'width' : 'height'
    const hotResize = await sharpData
      .resize({ [largestDimension]: 500, withoutEnlargement: true, kernel: "lanczos3" })
    const hotThumbnail = sharpService.toWebp(hotResize, { quality: 85 })
    const hotData = await hotThumbnail.toBuffer()
    const hotSharp = sharpService.fileToSharp(hotData)
    const hotMeta = await hotSharp.metadata()
    const hotName = file.fileName + '_thumb'
    const hotFile = new FileDTO({
      data: hotData,
      name: hotName + '.webp',
      fileName: hotName,
      mimetype: 'image/webp',
      extension: '.webp',
      size: hotData.length,
      metadata: { width: hotMeta.width, height: hotMeta.height, orientation }
    })
    const hotBackup = await this.uploadFile(hotFile, { folder })
    // console.log('🧊', coldBackUp)
    // console.log('🔥', hotBackup)
    return { coldBackUp, hotBackup }
  }
  /**
   * @param {FileDTO} file
   * @param {{user?, container?: string, folder?: string, temp?: string}} options
   * @returns
   */
  async uploadFile(file, { container, folder, temp }) {
    const upload = await azBlobService.uploadFile(file, { folder, temp })
    return {
      url: upload.url,
      name: file.name,
      size: file.size,
      type: file.mimetype,
      mb: file.mb,
      metadata: file.metadata
    }
  }

  async deleteFile(userId, fileId) {
    const fileToDelete = await dbContext.Files.findById(fileId)
    if (fileToDelete.ownerId != userId) throw new Forbidden("Invalid Permissions")
    const deleteUrl = `${fileToDelete.folder}/${fileToDelete.name}`
    await azBlobService.deleteBlob(deleteUrl, 'cold')
    if (fileToDelete.thumbnail) {
      const deleteThumbUrl = `${fileToDelete.folder}/${fileToDelete.thumbnail.name}`
      await azBlobService.deleteBlob(deleteThumbUrl, 'hot')
    }
    await fileToDelete.deleteOne()
    return `${fileToDelete.name} removed from backup`
  }

}

export const filesService = new FilesService()
