// Success response
exports.successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response
exports.errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Pagination response
exports.paginationResponse = (res, data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

// Created response
exports.createdResponse = (res, message, data) => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

// No content response
exports.noContentResponse = (res) => {
  return res.status(204).send();
};

// Validation error response
exports.validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation error",
    errors: errors.map((error) => ({
      field: error.param,
      message: error.msg,
    })),
  });
};

// Unauthorized response
exports.unauthorizedResponse = (res, message = "Unauthorized access") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

// Forbidden response
exports.forbiddenResponse = (res, message = "Forbidden") => {
  return res.status(403).json({
    success: false,
    message,
  });
};

// Not found response
exports.notFoundResponse = (res, message = "Resource not found") => {
  return res.status(404).json({
    success: false,
    message,
  });
};

// Server error response
exports.serverErrorResponse = (
  res,
  message = "Internal server error",
  error = null
) => {
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development" && error) {
    response.error = error.message;
    response.stack = error.stack;
  }

  return res.status(500).json(response);
};
