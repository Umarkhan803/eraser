const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a project title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit", "admin"],
          default: "edit",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    canvas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canvas",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    folder: {
      type: String,
      default: "Uncategorized",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Project", projectSchema);
