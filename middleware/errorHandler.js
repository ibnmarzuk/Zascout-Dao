function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[Error] ${req.method} ${req.path} — ${status}: ${message}`);
  
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // API request — return JSON
  if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
    return res.status(status).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  }

  // Browser request — render error page
  res.status(status).render('error', {
    title: `Error ${status}`,
    code: status,
    message
  });
}

module.exports = errorHandler;
