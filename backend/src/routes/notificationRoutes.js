const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// GET /api/notifications - Get user's notifications
router.get("/", getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/:id/read", markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put("/read-all", markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete("/:id", deleteNotification);

// DELETE /api/notifications - Delete all notifications
router.delete("/", deleteAllNotifications);

module.exports = router;
