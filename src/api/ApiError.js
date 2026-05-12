/**
 * Error thrown for non-2xx API responses.
 */
export class ApiError extends Error {
  /** @param {string} message */
  constructor(message, options = {}) {
    super(message);
    this.name = 'ApiError';
    /** @type {number | undefined} */
    this.status = options.status;
    /** @type {unknown} */
    this.data = options.data;
    /** @type {string | undefined} */
    this.url = options.url;
  }
}
