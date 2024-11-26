import { Worker } from 'node:worker_threads'
import { FileDTO } from '../models/file.js'
import { logger } from '../utils/Logger.js'
import path from 'path'
import { filesService } from './FilesService.js'


const jobQ = []
const workers = []
const workerLimit = 4

class WorkersService {
  /**
   *
   * @param {FileDTO} data
   */
  addJobToQ(data) {
    if (data.mimetype.includes('image')) {
      jobQ.push({ action: 'uploadImage', data })
    } else {
      jobQ.push({ action: 'uploadFile', data })
    }
    startWork()
    return { currentQ: jobQ.length }
  }
}

export const workersService = new WorkersService()

export function startWork() {
  if (workers.length < workerLimit && workers.length <= jobQ.length) {
    logger.log('adding worker to 🤽', workers.length, jobQ.length)
    const worker = new Worker('./src/utils/UploadFile.js')
    workers.push(worker)
    worker.on('message', doJob)
    worker.on('error', (e) => logger.error('[⚒️Err]', e))
    worker.on('exit', () => {
      workers.splice(workers.findIndex(w => w.threadId === worker.threadId), 1)
      logger.warn('⏲️', workers.length)
    })
  }
  // logger.log('🏁All work done')
}

async function doJob(message) {
  logger.log('☎️', message)
  switch (message.status) {
    case 'ready':
      continueWork(message.workerId)
      break
    case 'fileUploaded':
      const fileRecord = await filesService.createFileRecord(message.data)
      logger.log('📂', fileRecord)
    case 'done':
      // TODO socket message front end

      logger.log('done')
      break
    default: logger.error(message)
  }
}

function continueWork(workerId) {
  const worker = workers.find(w => w.threadId === workerId)
  logger.log('[JOBS LEFT]', jobQ.length)
  if (jobQ.length > 0) {
    const nextJob = jobQ.shift()
    worker.postMessage(nextJob)
  } else {
    worker.postMessage({ action: 'All in a hard days work', data: null })
  }
}



