import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { filesService } from "./FilesService.js"


class FoldersService {

  async getFolderRecord(folder) {
    const folders = await dbContext.Folders.find({ folder }).populate('fileCount folderCount')
    return folders
  }
  async createFolderRecord(body) {
    const folder = await dbContext.Folders.create(body)
    return folder
  }

  async deleteFolder(folderId, userId) {
    const folder = await dbContext.Folders.findById(folderId)
    if (!folder) throw new BadRequest(`No folder with id: ${folderId}`)
    if (folder.ownerId != userId) throw new Forbidden(`Invalid access to folder ${folderId}`)
    const slug = folder.slug ?? folder.folder + '/' + folder.name
    const files = await dbContext.Files.find({ folder: { $regex: new RegExp(slug) } })
    const subFolders = await dbContext.Folders.find({ folder: { $regex: new RegExp(slug) } })
    await dbContext.Folders.deleteMany({ folder: { $regex: new RegExp(slug) } })
    for (let f of files) {
      await filesService.deleteFile(userId, f.id)
    }
    await folder.deleteOne()
    return { deleted: folder.name, deletedPath: slug, files: files.length, subFolders: subFolders.length }
  }

}

export const foldersService = new FoldersService()
