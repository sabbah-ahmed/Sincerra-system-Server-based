// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    success: false,
    message: 'Internal server error'
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(error);
  }

  // AWS DynamoDB errors
  if (err.name === 'ResourceNotFoundException') {
    error.message = 'Database table not found';
    return res.status(500).json(error);
  }

  if (err.name === 'ConditionalCheckFailedException') {
    error.message = 'Resource conflict or condition failed';
    return res.status(409).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error.message = 'Invalid JSON format';
    return res.status(400).json(error);
  }

  // Default to 500 server error
  const statusCode = err.statusCode || err.status || 500;
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    error.message = statusCode === 500 ? 'Internal server error' : err.message;
  } else {
    error.message = err.message;
    error.stack = err.stack;
  }

  res.status(statusCode).json(error);
};

module.exports = errorHandler;
