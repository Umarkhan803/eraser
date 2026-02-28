const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  loginValidation,
  registerValidation,
  validate,
} = require("../middleware/validation");

// Public routes
router.post("/register", ...registerValidation, validate, register);
router.post("/login", ...loginValidation, validate, login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.get("/verify-email/:token", verifyEmail);

// Protected routes (require authentication)
router.use(protect);
router.post("/logout", logout);
router.get("/me", getMe);
router.put("/update-profile", updateProfile);
router.put("/update-password", updatePassword);

module.exports = router;
