import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account.js'
import { folderSchema } from '../models/folder.js'
import { fileSchema } from '../models/file.js'

class DbContext {
  Account = mongoose.model('Account', AccountSchema);

  Folders = mongoose.model('Folder', folderSchema)

  Files = mongoose.model('File', fileSchema)
}

export const dbContext = new DbContext()
