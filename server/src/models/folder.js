import { Schema } from "mongoose";
import { dbContext } from "../db/DbContext.js";




export const folderSchema = new Schema({
  name: { type: String, minLength: 2, maxLength: 50, required: true, default: 'new folder' },
  slug: { type: String },
  ownerId: { type: Schema.ObjectId, required: true, ref: 'Account' },
  folder: { type: String },
}, { timestamps: true, toJSON: { virtuals: true } })


folderSchema.virtual('fileCount', {
  localField: 'slug',
  foreignField: 'folder',
  ref: 'File',
  count: true
})
folderSchema.virtual('folderCount', {
  localField: 'slug',
  foreignField: 'folder',
  ref: 'Folder',
  count: true
})
