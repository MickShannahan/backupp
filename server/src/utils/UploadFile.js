// const { parentPort, threadId, isMainThread } = require('worker_threads')
// const { filesService } = require('../services/FilesService.js')
// const { logger } = require('./Logger.js')

import { threadId, parentPort, isMainThread } from "worker_threads"
import { FileDTO } from "../models/file.js"
import { filesService } from "../services/FilesService.js"

// const { sharpService } = require('../services/SharpService.js')
const emojis = ['🦍', '🦧', '🦎', '🐦‍⬛', '🐅', '🐋', '🦏', '🦓', '🦒', '🐒', '🦈', '🦑', '🐊', '🫏', '🦌', '🐄', '🐖', '🦘', '🦣', '🐫', '🐆', '🐎', '🐃', '🦥', '🦫', '🦖', '🦔', '🐐']

const workerId = threadId
const workerName = emojis[Math.floor(Math.random() * emojis.length)]
const worker = workerName + '-' + workerId


async function init() {
  parentPort.on('message', async ({ action, data }) => {
    switch (action) {
      case 'uploadImage':
        await uploadImage(data)
        break
      case 'uploadFile':
        await uploadFile(data)
        break
      default:
        parentPort.postMessage({ status: 'Exiting', workerName })
        parentPort.close()
    }
  })
}
function readyForWork() {
  parentPort.postMessage({ status: 'ready', workerId })
}


async function uploadImage(file) {
  try {
    const payload = await filesService.uploadImage(file)
    parentPort.postMessage({ status: 'fileUploaded', data: payload })
    readyForWork()
  } catch (error) {
    readyForWork()
  }
}

async function uploadFile(file) {
  try {
    const payload = await filesService.uploadMiscFile(file)
    parentPort.postMessage({ status: 'fileUploaded', data: payload })
    readyForWork()
  } catch (error) {
    readyForWork()
  }
}

// start worker
if (!isMainThread) {
  init()
  console.log(`${worker} Started`)
  readyForWork()
} else {
  console.log('this is the main thread???')
}
