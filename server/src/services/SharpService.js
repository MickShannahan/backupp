import sharp from "sharp"



class SharpService {
  /**
   *
   * @param {Buffer} data
   * @param {number?} length
   * @returns {import("sharp").Sharp} sharpData
   */
  fileToSharp(data, length = 0) {
    const sharpData = sharp(data)
      .withMetadata()
      .rotate()
    return sharpData
  }

  /**
   * @param {import("sharp").Sharp} sharp
   * @param {*} options
   * @returns {import("sharp").Sharp} sharpData
   */
  toWebp(sharp, options = {}) {
    const webp = sharp.webp({ ...options, quality: options.quality ?? 80 }).withMetadata()
    return webp
  }

}

export const sharpService = new SharpService()
