const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

class AuthService {
  // Generate JWT Token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
  }

  // Verify JWT Token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  // Generate refresh token
  generateRefreshToken() {
    return crypto.randomBytes(40).toString("hex");
  }

  // Hash password reset token
  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  // Create password reset token
  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = this.hashToken(resetToken);
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    return { resetToken, hashedToken, expiry };
  }

  // Verify password strength
  validatePasswordStrength(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return {
        valid: false,
        message: `Password must be at least ${minLength} characters long`,
      };
    }

    return { valid: true, message: "Password is valid" };
  }

  // Sanitize user data for response
  sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }

  // Check if email exists
  async emailExists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  // Get user by email
  async getUserByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  // Get user by ID
  async getUserById(userId) {
    return await User.findById(userId);
  }

  // Update last login
  async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, { lastLogin: Date.now() });
  }

  // Create user session
  createSession(user, token) {
    return {
      user: this.sanitizeUser(user),
      token,
      expiresIn: process.env.JWT_EXPIRE || "7d",
    };
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Generate email verification token
  generateEmailVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Send verification email (placeholder)
  async sendVerificationEmail(email, token) {
    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    console.log(`Verification email sent to ${email} with token: ${token}`);
    return true;
  }

  // Send password reset email (placeholder)
  async sendPasswordResetEmail(email, resetToken) {
    // In production, integrate with email service
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log(`Password reset email sent to ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    return true;
  }
}

module.exports = new AuthService();
