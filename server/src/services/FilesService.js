import { FileDTO } from "../models/file.js"
import { azBlobService } from "./AzureBlobService.js"
import { sharpService } from "./SharpService.js"
import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"
import { logger } from "../utils/Logger.js"

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
   */
  async uploadImage(file) {
    const coldBackUp = await this.uploadToAz(file, { temp: 'cold', folder: file.folder })
    const sharpData = sharpService.fileToSharp(file.data, file.size)
    const { height, width, orientation } = await sharpData.metadata()
    coldBackUp.metadata ??= {}
    coldBackUp.metadata.width = width
    coldBackUp.metadata.height = height
    const largestDimension = orientation % 2 ? 'width' : 'height'
    const hotResize = await sharpData
      .resize({ [largestDimension]: 350, withoutEnlargement: true, kernel: "lanczos3" })
    const hotThumbnail = sharpService.toWebp(hotResize, { quality: 80 })
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
    const hotBackup = await this.uploadToAz(hotFile, { folder: file.folder, temp: 'hot' })
    const fileRecord = { ...coldBackUp, thumbnail: hotBackup }
    // return await this.createFileRecord(fileRecord)
    return fileRecord
  }

  /**
* @param {FileDTO} file
* @returns
*/
  async uploadMiscFile(file) {
    const fileData = await this.uploadToAz(file, { folder: file.folder, temp: 'cold' })
    return fileData
  }
  /**
   * @param {FileDTO} file
   * @param {{user?, container?: string, folder?: string, temp?: string}} options
   * @returns
   */
  async uploadToAz(file, { container, folder, temp }) {
    const upload = await azBlobService.uploadFile(file, { folder, temp })
    const fileData = {
      ownerId: file.ownerId,
      folder: folder,
      url: upload.url,
      name: file.name,
      size: file.size,
      type: file.mimetype,
      mb: file.mb,
      metadata: file.metadata
    }
    return fileData
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
