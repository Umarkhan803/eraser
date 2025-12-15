const asyncHandler = require("../middleware/asyncHandler");
const Notification = require("../models/Notification");
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification: deleteNotificationService,
} = require("../services/notificationService");

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const notifications = await getUserNotifications(req.user._id, page, limit);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  // Check if notification belongs to user
  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this notification",
    });
  }

  await markNotificationAsRead(req.params.id);

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  // Check if notification belongs to user
  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this notification",
    });
  }

  await deleteNotificationService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Notification deleted",
  });
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });

  res.status(200).json({
    success: true,
    message: "All notifications deleted",
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
