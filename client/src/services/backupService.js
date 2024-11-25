import { AppState } from "@/AppState.js"
import { api } from "./AxiosService.js"
import { logger } from "@/utils/Logger.js"
import Pop from "@/utils/Pop.js"
import { Folder } from "@/models/Folder.js"
import { File } from "@/models/File.js"




class BackupService {
  async deleteFolder(folderId, folderPath) {
    const res = await api.delete(`api/backup/folders/${folderId}`)
    logger.log(res.data)
    let dir = getFolderDir(AppState.backup, folderPath)
    let folderName = Object.keys(dir._folders).find(k => dir._folders[k].id == folderId)
    delete dir._folders[folderName]
    logger.log('💣', folderName, dir._folders)
    AppState.activeDir = dir
  }
  async deleteBackup(fileId, folderPath) {
    try {
      const res = await api.delete(`api/backup/files/${fileId}`)
      const dir = getFolderDir(AppState.backup, folderPath)
      let files = dir?._files
      files.splice(files.findIndex(f => f.id == fileId), 1)
      dir.fileCount--
      console.log('➖', res.data)
    } catch (error) {
      Pop.error(error)
      console.error(error)
    }
  }
  async uploadFile(data) {
    try {
      const res = await api.post('api/backup/files', data)
      const file = new File(res.data)
      const dir = getFolderDir(AppState.backup, file.folder)
      dir._files.push(file)
      dir.fileCount++
      console.log('➕', file)
      return file
    } catch (error) {
      // Pop.error(error)
      console.error(error)
    }

  }
  async getFolder(folderPath = '') {
    logger.log('getting data for', folderPath)
    const folders = await api.get(`api/backup/folders/${urlSafe(folderPath)}`)
    const files = await api.get(`api/backup/files/${urlSafe(folderPath)}`)
    logger.log('got data', folders, files)
    const dir = getFolderDir(AppState.backup, folderPath)
    folders.data.forEach(f => {
      let fold = new Folder(f)
      dir._folders[fold.name] = fold
    })
    dir._files = files.data.map(f => new File(f))
  }

  async createFolder(folderData) {
    const res = await api.post('api/backup/folders', folderData)
    const folder = new Folder(res.data)
    logger.log(folder)
    const dir = getFolderDir(AppState.backup, folder.folder)
    dir._folders[folder.name] = folder

  }
}

function urlSafe(url) {
  return encodeURIComponent(url)
}

function getFolderDir(dir, folderPath) {
  if (folderPath === '') return dir
  logger.log('nested dir', dir, folderPath)
  folderPath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath
  let nextSlash = folderPath.includes('/') ? folderPath.indexOf('/') : folderPath.length
  let cut = folderPath.slice(0, nextSlash)
  let rest = folderPath.slice(nextSlash)
  logger.log('digging', cut, rest)
  return getFolderDir(dir._folders[cut], rest)
}

export const backupService = new BackupService()