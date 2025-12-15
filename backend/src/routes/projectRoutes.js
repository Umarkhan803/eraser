const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  toggleFavorite,
  getSharedProjects,
  updateProjectThumbnail,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Project CRUD operations
router.route("/").get(getProjects).post(createProject);

router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);

// Additional project operations
router.post("/:id/duplicate", duplicateProject);
router.put("/:id/favorite", toggleFavorite);
router.put("/:id/thumbnail", updateProjectThumbnail);
router.get("/shared/all", getSharedProjects);

module.exports = router;
