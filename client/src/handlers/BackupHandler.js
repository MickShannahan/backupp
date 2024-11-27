import { logger } from "@/utils/Logger.js";
import { SocketHandler } from "../utils/SocketHandler.js";
import { getFolderDir } from "@/services/backupService.js";
import { AppState } from "@/AppState.js";
import { File } from "@/models/File.js";
import Pop from "@/utils/Pop.js";

class BackupHandler extends SocketHandler {

  constructor() {
    super(true)
    this
      .on('JOINED_ROOM', this.onJoinedRoom)
      .on('LEFT_ROOM', this.onLeftRoom)
      .on('USER_JOINED', this.onUserJoinedRoom)
      .on('USER_LEFT', this.onUserLeftRoom)
      .on('FILE_UPLOADED', this.fileUploaded)
      .on('UPLOAD_FAILED', this.uploadFailed)

  }

  onJoinedRoom(roomName) {
    logger.log('You joined room', roomName)
  }
  onLeftRoom(roomName) {
    logger.log('You left room', roomName)
  }
  onUserJoinedRoom(user) {
    logger.log('A user joined your room', user)
  }
  onUserLeftRoom(user) {
    logger.log('A user left your room', user)
  }


  fileUploaded(payload) {
    logger.log('socket payload', payload)
    const file = new File(payload)
    const dir = getFolderDir(AppState.backup, file.folder)
    dir._files.push(file)
    dir.fileCount++
    AppState.socketMessages = [...AppState.socketMessages, { file }]
  }


  uploadFailed(payload) {
    logger.log('⚡💢', payload)
    Pop.error(payload.error)
    AppState.socketMessages = [...AppState.socketMessages, payload]
  }

}

export const sockets = new BackupHandler()
