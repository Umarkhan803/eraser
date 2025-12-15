const { validationResult } = require("express-validator");
const { body, param, query } = require("express-validator");

// Check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

// User validation rules
exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

// Project validation rules
exports.createProjectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

exports.updateProjectValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

// Comment validation rules
exports.createCommentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
  body("position.x")
    .notEmpty()
    .withMessage("X position is required")
    .isNumeric()
    .withMessage("X position must be a number"),
  body("position.y")
    .notEmpty()
    .withMessage("Y position is required")
    .isNumeric()
    .withMessage("Y position must be a number"),
];

// Collaboration validation rules
exports.inviteCollaboratorValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("permission")
    .optional()
    .isIn(["view", "edit", "admin"])
    .withMessage("Permission must be view, edit, or admin"),
];

// Canvas validation rules
exports.updateCanvasValidation = [
  body("objects").optional().isArray().withMessage("Objects must be an array"),
  body("background")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("Background must be a valid hex color"),
  body("zoom")
    .optional()
    .isFloat({ min: 0.1, max: 5 })
    .withMessage("Zoom must be between 0.1 and 5"),
];

// ID validation
exports.validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

// Query validation
exports.paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
