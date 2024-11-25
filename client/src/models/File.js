export class Thumbnail {
  constructor(data) {
    this.url = data.url
    this.name = data.name
    this.size = data.size
    this.type = data.type
  }
}



export class File {
  constructor(data) {
    this.id = data.id ?? data._id
    this.name = data.name
    this.type = data.type
    this.mimetype = data.type
    this.size = data.size
    this.url = data.url
    this.thumbnail = data.thumbnail ? new Thumbnail(data.thumbnail) : placeHolderThumbnail(this.type)
    this.folder = data.folder.replace(data.ownerId, '')
    if (this.folder.startsWith('/')) this.folder = this.folder.slice(1)
    this.rawFolder = data.folder
    this.ownerId = data.ownerId
    this.height = data.metadata?.height
    this.width = data.metadata?.width
    this.createdAt = new Date(data.createdAt)
  }

  get dateShort() {
    return this.createdAt.toLocaleDateString('en-us', { day: '2-digit', month: 'short', year: '2-digit' })
  }
}

export function placeHolderThumbnail(fileType) {
  let data = { size: 0, url: '' }
  switch (fileType) {
    case 'image/png':
      break
    default: data.url = 'https://plus.unsplash.com/premium_photo-1683121713210-97667d2e83c8?q=60&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      break
  }
  return data
}