export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  error.status = 404
  next(error)
}

export function errorHandler(error, req, res, _next) {
  const status = error.status || (error.name === 'ValidationError' ? 400 : 500)
  const message =
    error.code === 11000
      ? `${Object.keys(error.keyValue || {}).join(', ') || 'Value'} already exists`
      : error.name === 'ValidationError'
        ? Object.values(error.errors).map((item) => item.message).join(', ')
        : error.name === 'CastError'
          ? 'Invalid identifier'
          : error.message || 'Internal server error'

  if (status >= 500) console.error(error)
  res.status(status).json({ success: false, message })
}
