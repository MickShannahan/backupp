import { Schema } from "mongoose";

export class FileDTO {
  constructor(data) {
    this.name = data.name || ''
    this.fileName = data.name.slice(0, data.name.lastIndexOf('.'))
    this.extension = this.name.slice(this.name.lastIndexOf('.'))
    this.folder = data.folder
    this.data = data.data
    this.encoding = data.encoding
    this.mimetype = data.mimetype
    this.size = data.size
    this.ownerId = data.ownerId
    this.container = data.container
    this.kb = parseFloat((data.size / 1024).toFixed(2))
    this.mb = parseFloat((data.size / 1024 / 1024).toFixed(2))
    this.gb = parseFloat((data.size / 1024 / 1024 / 1024).toFixed(2))
    this.md5 = data.md5
    this.truncated = data.truncated
    this.metadata = data.metadata || {}
  }
}

export const fileSchema = new Schema({
  name: { type: String, minLength: 2, maxLength: 100 },
  slug: { type: String },
  url: { type: String },
  type: { type: String, maxLength: 100 },
  size: { type: Number, required: true, default: 0 },
  thumbnail: { type: Object },
  extension: { type: String, maxLength: 100 },
  folder: { type: String },
  ownerId: { type: Schema.ObjectId, required: true, ref: 'Account' },
  metadata: { type: Object, default: () => { } }
}, { timestamps: true })

fileSchema.index({ name: 1, folder: 1, owner: 1 }, { unique: true })
