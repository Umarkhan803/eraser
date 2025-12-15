const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    canvas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canvas",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment cannot be empty"],
      trim: true,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    objectId: {
      type: String, // ID of the canvas object being commented on
      default: null,
    },
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, "Reply cannot be more than 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: Date,
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: {
          type: String,
          enum: ["👍", "❤️", "😊", "🎉", "👀"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
commentSchema.index({ canvas: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
