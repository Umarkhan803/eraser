const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// Generate a random string of specified length
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

// Generate a unique ID using UUID v4
const generateUniqueId = () => {
  return uuidv4();
};

// Sanitize string by removing potentially dangerous characters
const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim();
};

// Format date to readable string
const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(date).toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
};

// Get relative time (e.g., "2 hours ago")
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

// Convert string to URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// Truncate string to specified length with ellipsis
const truncate = (str, length = 100, ending = "...") => {
  if (str.length <= length) return str;
  return str.substring(0, length - ending.length) + ending;
};

// Pagination helper
const paginate = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
};

// Format bytes to human readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Check if value is empty (null, undefined, empty string, empty array, empty object)
const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

// Capitalize first letter of string
const capitalize = (str) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate random number between min and max (inclusive)
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  generateRandomString,
  generateUniqueId,
  sanitizeString,
  formatDate,
  timeAgo,
  slugify,
  truncate,
  paginate,
  formatBytes,
  isEmpty,
  capitalize,
  randomInt,
};
