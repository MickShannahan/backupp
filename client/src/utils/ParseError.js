import { logger } from "./Logger.js"


export function parseError(errorObj, object = 'object') {
  logger.log('errors are butt', errorObj)
  let message = 'Im actually not sure why'
  if (errorObj.errorResponse?.errmsg) {
    const err = errorObj.errorResponse?.errmsg
    if (err.includes('E11000')) return `${object} already exists`
  }
  return message
}