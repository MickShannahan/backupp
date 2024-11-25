import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import fileUpload from 'express-fileupload'
import { filesService } from "../services/FilesService.js";
import { BadRequest } from "../utils/Errors.js";
import { FileDTO } from "../models/file.js";
import { foldersService } from "../services/FoldersService.js";



export class UploadsController extends BaseController {
  constructor() {
    super('api/backup')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .use(fileUpload())
      .get('/files', this.getFilesInFolder)
      .get('/folders', this.getFoldersInFolder)
      .get('/files/:folderSlug', this.getFilesInFolder)
      .get('/folders/:folderSlug', this.getFoldersInFolder)
      .post('/folders', this.addFolder)
      .post('/files', this.addFile)
      .delete('/files/:fileId', this.deleteFile)
      .delete('/folders/:folderId', this.deleteFolder)
  }

  async getFilesInFolder(req, res, next) {
    try {
      const user = req.user
      const folder = `${user.id}${req.params.folderSlug ? `/${req.params.folderSlug}` : ''}`
      const files = await filesService.getFileRecords(folder)
      res.send(files)
    } catch (error) {
      next(error)
    }
  }
  async getFoldersInFolder(req, res, next) {
    try {
      const user = req.user
      const folder = `${user.id}${req.params.folderSlug ? `/${req.params.folderSlug}` : ''}`
      const folders = await foldersService.getFolderRecord(folder)
      res.send(folders)
    } catch (error) {
      next(error)
    }
  }

  async addFolder(req, res, next) {
    try {
      const user = req.userInfo
      const folder = `${user.id}${req.body.folder ? `/${req.body.folder}` : ''}`
      req.body.ownerId = user.id
      req.body.folder = folder
      req.body.slug = `${folder}${req.body.name ? `/${req.body.name}` : ''}`
      const folderRef = await foldersService.createFolderRecord(req.body)
      res.send(folderRef)
    } catch (error) {
      next(error)
    }
  }

  async addFile(req, res, next) {
    try {
      if (!req.files || Object.keys(req.files).length == 0) throw new BadRequest("No File attached")
      const user = req.userInfo
      req.body.ownerId = user.id
      const file = new FileDTO(req.files.upload)
      const container = req.body.container
      const folder = `${user.id}${req.body.folderSlug ? `/${req.body.folderSlug}` : ''}`
      const payload = await handleFileForUpload(file, { container, folder })
      const fileRef = await filesService.createFileRecord({ ...payload, ownerId: user.id, folder })
      res.send(fileRef)
    } catch (error) {
      next(error)
    }
  }

  async deleteFile(req, res, next) {
    try {
      const user = req.userInfo
      const fileId = req.params.fileId
      const message = await filesService.deleteFile(user.id, fileId)
      res.send(message)
    } catch (error) {
      next(error)
    }
  }
  async deleteFolder(req, res, next) {
    try {
      const folderId = req.params.folderId
      const userId = req.userInfo.id
      const deleteData = await foldersService.deleteFolder(folderId, userId)
      res.send(deleteData)
    } catch (error) {
      next(error)
    }
  }
}


async function handleFileForUpload(file, { container, folder }) {
  if (file.mimetype.includes('image')) {
    const { hotBackup, coldBackUp } = await filesService.uploadImage(file, { folder })
    coldBackUp.thumbnail = hotBackup
    return coldBackUp
  }
  return await filesService.uploadFile(file, { container, folder, temp: 'cold' })
}
