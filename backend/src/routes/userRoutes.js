const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUsers,
  uploadAvatar,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// All routes require authentication
router.use(protect);

// Search users
router.get("/search", searchUsers);

// Avatar upload
router.post("/avatar", upload.single("avatar"), uploadAvatar);

// User operations (admin only)
router.route("/").get(authorize("admin"), getAllUsers);

router
  .route("/:id")
  .get(getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

module.exports = router;
