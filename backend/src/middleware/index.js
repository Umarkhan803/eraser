const {
  protect,
  authorize,
  checkOwnership,
  checkProjectPermission,
} = require("./authMiddleware");
const errorHandler = require("./errorHandler");
const {
  validate,
  registerValidation,
  loginValidation,
} = require("./validation");
const upload = require("./upload");
const {
  apiLimiter,
  authLimiter,
  canvasLimiter,
  uploadLimiter,
} = require("./rateLimiter");
const asyncHandler = require("./asyncHandler");
const logger = require("./logger");
const corsMiddleware = require("./cors");

module.exports = {
  protect,
  authorize,
  checkOwnership,
  checkProjectPermission,
  errorHandler,
  validate,
  registerValidation,
  loginValidation,
  upload,
  apiLimiter,
  authLimiter,
  canvasLimiter,
  uploadLimiter,
  asyncHandler,
  logger,
  corsMiddleware,
};
