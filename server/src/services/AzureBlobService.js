import { BlobServiceClient } from "@azure/storage-blob"
import { BadRequest } from "../utils/Errors.js"
import { logger } from "../utils/Logger.js"


const storage = {
  hot: BlobServiceClient.fromConnectionString(process.env.AZURE_HOT_CONNECTION).getContainerClient('backup'),
  cold: BlobServiceClient.fromConnectionString(process.env.AZURE_COLD_CONNECTION).getContainerClient('backup')
}

const config = {
  blobHTTPHeaders: {
    blobCacheControl: 'max-age=36000'
  }
}

class AzureBlobService {

  async uploadFile(file, { temp = 'hot', containerName = 'backup', folder = 'test' }) {
    const container = storage[temp]
    const blockBlob = container.getBlockBlobClient(folder + '/' + file.fileName + file.extension)
    const blobOptions = {
      blobHTTPHeaders: {
        ...config.blobHTTPHeaders,
        blobContentType: file.mimetype
      }
    }
    const response = await blockBlob.upload(file.data, file.data.length, blobOptions)
    if (response.errorCode) throw new Error(response.errorCode)
    return { url: blockBlob.url }
  }

  async deleteBlob(deleteUrl, temp = 'cold', containerName = 'backup') {
    const container = storage[temp]
    const blob = container.getBlockBlobClient(deleteUrl)
    await blob.deleteIfExists({ deleteSnapshots: 'include' })
    return blob
  }

}

export const azBlobService = new AzureBlobService()
