// Standard API response utilities
const responses = {
  success: (res, data, message = 'Success') => {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  },

  created: (res, data, message = 'Resource created successfully') => {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  },

  badRequest: (res, message = 'Bad request', errors = null) => {
    return res.status(400).json({
      success: false,
      message,
      errors
    });
  },

  unauthorized: (res, message = 'Unauthorized') => {
    return res.status(401).json({
      success: false,
      message
    });
  },

  forbidden: (res, message = 'Forbidden') => {
    return res.status(403).json({
      success: false,
      message
    });
  },

  notFound: (res, message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message
    });
  },

  conflict: (res, message = 'Resource conflict') => {
    return res.status(409).json({
      success: false,
      message
    });
  },

  internalError: (res, message = 'Internal server error') => {
    return res.status(500).json({
      success: false,
      message
    });
  },

  // Paginated response
  paginated: (res, data, pagination) => {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit)
      }
    });
  }
};

module.exports = responses;
