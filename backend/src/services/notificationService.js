const Notification = require("../models/Notification");

// Create a single notification
const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Create multiple notifications (batch)
const createBatchNotifications = async (notifications) => {
  try {
    const createdNotifications = await Notification.insertMany(notifications);
    return createdNotifications;
  } catch (error) {
    console.error("Error creating batch notifications:", error);
    throw error;
  }
};

// Get user notifications with pagination
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name avatar")
      .populate("relatedProject", "title")
      .populate("relatedComment", "content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments({ recipient: userId });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error getting user notifications:", error);
    throw error;
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all user notifications as read
const markAllUserNotificationsAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete notification
const deleteNotification = async (notificationId) => {
  try {
    await Notification.findByIdAndDelete(notificationId);
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Delete all user notifications
const deleteAllUserNotifications = async (userId) => {
  try {
    await Notification.deleteMany({ recipient: userId });
    return true;
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
};

// Clean up old notifications (older than specified days)
const cleanupOldNotifications = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    });

    console.log(`Cleaned up ${result.deletedCount} old notifications`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up old notifications:", error);
    throw error;
  }
};

// Get unread notification count for user
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  createBatchNotifications,
  getUserNotifications,
  markNotificationAsRead,
  markAllUserNotificationsAsRead,
  deleteNotification,
  deleteAllUserNotifications,
  cleanupOldNotifications,
  getUnreadCount,
};
