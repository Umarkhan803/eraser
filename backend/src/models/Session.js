const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true,
    },
    ipAddress: {
      type: String,
      required: [true, "IP address is required"],
    },
    userAgent: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
      index: { expires: "expiresAt" }, // TTL index
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient queries
sessionSchema.index({ user: 1, isActive: 1 });
sessionSchema.index({ token: 1 });

// Method to check if session is expired
sessionSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Method to update last activity
sessionSchema.methods.updateActivity = function () {
  this.lastActivity = new Date();
  return this.save();
};

// Static method to clean up expired sessions
sessionSchema.statics.cleanupExpired = function () {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Pre-save middleware
sessionSchema.pre("save", function (next) {
  // Ensure expiresAt is set if not provided
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }
  next();
});

module.exports = mongoose.model("Session", sessionSchema);
