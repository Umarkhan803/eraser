const express = require("express");
const router = express.Router();
const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  useTemplate,
  getTemplatesByCategory,
} = require("../controllers/templateController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getTemplates);
router.get("/category/:category", getTemplatesByCategory);
router.get("/:id", getTemplate);

// Protected routes
router.use(protect);
router.post("/:id/use", useTemplate);

// Admin only routes
router.post("/", authorize("admin"), createTemplate);
router.put("/:id", authorize("admin"), updateTemplate);
router.delete("/:id", authorize("admin"), deleteTemplate);

module.exports = router;
