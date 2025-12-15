const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "flowchart",
        "diagram",
        "wireframe",
        "mindmap",
        "kanban",
        "timeline",
        "other",
      ],
      default: "other",
    },
    thumbnail: {
      type: String, // URL to thumbnail image
      required: [true, "Thumbnail is required"],
    },
    objects: [
      {
        type: mongoose.Schema.Types.Mixed, // Canvas objects data
      },
    ],
    isPremium: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    usageCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search
templateSchema.index({ title: "text", description: "text", tags: "text" });
templateSchema.index({ category: 1, isPublic: 1, isPremium: 1 });

// Virtual for URL
templateSchema.virtual("url").get(function () {
  return `/api/templates/${this._id}`;
});

// Pre-save middleware to update usage count or other logic
templateSchema.pre("save", function (next) {
  // Add any pre-save logic here
  next();
});

module.exports = mongoose.model("Template", templateSchema);
