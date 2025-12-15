const express = require("express");
const router = express.Router();
const {
  getCanvas,
  updateCanvas,
  saveCanvasVersion,
  getCanvasHistory,
  restoreCanvasVersion,
  exportCanvas,
  updateCanvasSettings,
} = require("../controllers/canvasController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Canvas operations
router.route("/:id").get(getCanvas).put(updateCanvas);

// Canvas versioning
router.post("/:id/save-version", saveCanvasVersion);
router.get("/:id/history", getCanvasHistory);
router.put("/:id/restore/:versionId", restoreCanvasVersion);

// Canvas export
router.post("/:id/export", exportCanvas);

// Canvas settings
router.put("/:id/settings", updateCanvasSettings);

module.exports = router;
