const HttpStatus = require('../enums/http-status.enum');

/**
 * Success response.
 * @template T
 * @param {import('express').Response} res
 * @param {number} [status=200]
 * @param {string=} message
 * @param {T=} data
 */
function resSucc(
  res, 
  status = HttpStatus.CREATED, 
  message, 
  data
) {
  res.status(status).json({
    ...(message ? { message } : {}),
    ...(typeof data !== 'undefined' ? { data } : {})
  });
}

/**
 * Error response.
 * @param {import('express').Response} res
 * @param {any} error
 * @param {number} [status=500]
 */
function resErr(
  res, 
  error, 
  status = HttpStatus.INTERNAL_SERVER_ERROR
) {
  const message = error?.message || 'Internal server error';
  res.status(status).json({ message });
}

module.exports = { 
  resSucc, 
  resErr 
};