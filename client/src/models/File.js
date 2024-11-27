
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
    this.extension = data.extension || this.name.slice(this.name.lastIndexOf('.'))
    this.nameClean = this.name.slice(0, this.name.lastIndexOf('.'))
    this.thumbnail = data.thumbnail ? new Thumbnail(data.thumbnail) : placeHolderThumbnail(this.type)
    this.folder = data.folder.replace(data.ownerId, '')
    if (this.folder.startsWith('/')) this.folder = this.folder.slice(1)
    this.rawFolder = data.folder
    this.ownerId = data.ownerId
    this.height = data.metadata?.height
    this.width = data.metadata?.width
    this.createdAt = new Date(data.createdAt)
  }

  get color() {
    let color = 'teal'
    switch (this.mimetype) {
      case '.jpg':
      case '.jpeg':
        color = 'primary'
        break
      case '.png':
        color = 'blue'
        break
      case '.webp':
        color = 'teal'
        break
      case '.txt':
      case '.json':
      case '.bsh':
      case '.ini':
        color = 'purple'
        break
    }
    return color
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
    default: data.url = '/img/backupLogo.png'
      break
  }
  return data
}