/**
 * Created by pure on 2017/8/30.
 */
import httpStatus from 'http-status';

class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    Error.captureStackTrace(this, this.constructor.name);
  }
}
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message, status, isPublic);
  }
}
class ClientError extends ExtendableError {
  constructor(message, code, isPublic = false) {
    super(message, code, isPublic);
    this.code = code;
  }
}
export {APIError, ClientError};
