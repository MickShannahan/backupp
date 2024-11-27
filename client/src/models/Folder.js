import { logger } from "@/utils/Logger.js"
import { File } from "./File.js"



export class Folder {
  constructor(data) {
    this.id = data.id ?? data._id
    this.name = data.name
    this.folder = data.folder.replace(data.ownerId, '')
    if (this.folder.startsWith('/')) this.folder = this.folder.slice(1)
    this.folderSlug = data.slug ?? this.folder + '/' + this.name
    this.folderSlug = this.folderSlug.replace(data.ownerId, '')
    if (this.folderSlug.startsWith('/')) this.folderSlug = this.folderSlug.slice(1)
    this.rawFolder = data.folder
    this.ownerId = data.ownerId
    this.createdAt = new Date(data.createdAt)
    /**
     * @type {File[]}
     */
    this._files = data._files ?? []
    this._folders = data._folders ?? {}
    this.fileCount = data.fileCount ?? this._files.length
    this.folderCount = data.folderCount ?? this._folders.length
    this.fetchedExp = 0
  }

  get isStale() {
    return this.fetchedExp < Date.now()
  }

  setExp(minutes = 6) {
    this.fetchedExp = Date.now() * (1000 * 60 * minutes)
  }
}