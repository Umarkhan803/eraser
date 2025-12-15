// Validate MongoDB ObjectId
exports.isValidObjectId = (id) => {
  const ObjectId = require("mongoose").Types.ObjectId;
  return ObjectId.isValid(id);
};

// Validate URL
exports.isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate hex color
exports.isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Validate phone number
exports.isValidPhoneNumber = (phone) => {
  return /^\+?[\d\s-()]+$/.test(phone);
};

// Validate password strength
exports.validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
  };
};

// Sanitize input
exports.sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript:
    .replace(/on\w+=/gi, ""); // Remove event handlers
};

// Validate file extension
exports.isValidFileExtension = (filename, allowedExtensions) => {
  const ext = filename.split(".").pop().toLowerCase();
  return allowedExtensions.includes(ext);
};

// Validate file size
exports.isValidFileSize = (size, maxSize) => {
  return size <= maxSize;
};

// Validate date range
exports.isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

// Validate JSON
exports.isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
