const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = {
      statusCode: 404,
      message,
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      statusCode: 400,
      message,
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = {
      statusCode: 400,
      message: message.join(", "),
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      statusCode: 401,
      message,
    };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = {
      statusCode: 401,
      message,
    };
  }

  const response = {
    success: false,
    error: error.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  // prefer explicit handler name recorded earlier
  if (req && req.handlerName) {
    response.resMessafe = `this function name is ${req.handlerName}`;
  } else {
    // fallback: inspect stack trace like the response middleware does
    let fnName = "unknown";
    const stackLines = (new Error().stack || "").split("\n");
    for (let i = 2; i < stackLines.length; i++) {
      const line = stackLines[i];
      if (
        line.includes("errorHandler.js") ||
        line.includes("(node:") ||
        line.includes("node_modules")
      )
        continue;
      const m = line.match(/at\s+([^\s]+)\s*/);
      if (m && m[1]) {
        const parts = m[1].split(".");
        fnName = parts[parts.length - 1];
        break;
      }
    }
    response.resMessafe = `this function name is ${fnName}`;
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
