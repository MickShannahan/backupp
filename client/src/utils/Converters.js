

export function byteSize(bytes) {
  const kilo = bytes / 1024
  if (kilo < 1024) return kilo.toFixed(3) + 'kb'
  const mega = kilo / 1024
  if (mega < 1024) return mega.toFixed(3) + 'mb'
  const gig = mega / 1024
  if (gig < 1024) return gig.toFixed(3) + 'gb'
  const tera = gig / 1024
  return tera.toFixed(3) + 'tb'
}