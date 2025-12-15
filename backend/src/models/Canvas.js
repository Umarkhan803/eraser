const mongoose = require("mongoose");

const canvasSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    objects: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    background: {
      type: String,
      default: "#ffffff",
    },
    width: {
      type: Number,
      default: 1920,
    },
    height: {
      type: Number,
      default: 1080,
    },
    zoom: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 5,
    },
    version: {
      type: Number,
      default: 1,
    },
    history: [
      {
        objects: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        action: {
          type: String,
          enum: ["create", "update", "delete", "move", "resize"],
        },
      },
    ],
    activeUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        socketId: String,
        cursor: {
          x: Number,
          y: Number,
        },
        lastActive: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    layers: [
      {
        name: String,
        visible: {
          type: Boolean,
          default: true,
        },
        locked: {
          type: Boolean,
          default: false,
        },
        objects: [String], // Array of object IDs
      },
    ],
    gridEnabled: {
      type: Boolean,
      default: true,
    },
    snapToGrid: {
      type: Boolean,
      default: false,
    },
    gridSize: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Limit history to last 50 entries
canvasSchema.pre("save", function (next) {
  if (this.history.length > 50) {
    this.history = this.history.slice(-50);
  }
  next();
});

module.exports = mongoose.model("Canvas", canvasSchema);
