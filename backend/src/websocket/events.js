// WebSocket event names
const EVENTS = {
  // Connection events
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Canvas events
  JOIN_CANVAS: "join-canvas",
  LEAVE_CANVAS: "leave-canvas",
  CANVAS_UPDATE: "canvas-update",
  CANVAS_UPDATED: "canvas-updated",

  // User presence events
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
  CURSOR_MOVE: "cursor-move",
  CURSOR_UPDATE: "cursor-update",

  // Object events
  OBJECT_ADDED: "object-added",
  OBJECT_DELETED: "object-deleted",
  OBJECT_UPDATED: "object-updated",
  OBJECT_SELECTED: "object-selected",
  OBJECT_DESELECTED: "object-deselected",

  // Comment events
  NEW_COMMENT: "new-comment",
  COMMENT_ADDED: "comment-added",
  COMMENT_UPDATED: "comment-updated",
  COMMENT_DELETED: "comment-deleted",
  COMMENT_RESOLVED: "comment-resolved",
  TYPING_START: "typing-start",
  TYPING_STOP: "typing-stop",
  USER_TYPING: "user-typing",
  USER_STOPPED_TYPING: "user-stopped-typing",

  // Canvas operations
  UNDO: "undo",
  REDO: "redo",
  UNDO_PERFORMED: "undo-performed",
  REDO_PERFORMED: "redo-performed",

  // View events
  ZOOM_CHANGE: "zoom-change",
  ZOOM_CHANGED: "zoom-changed",
  PAN_CHANGE: "pan-change",
  PAN_CHANGED: "pan-changed",

  // Collaboration events
  COLLABORATOR_INVITED: "collaborator-invited",
  PERMISSION_CHANGED: "permission-changed",

  // Notification events
  NOTIFICATION: "notification",
  NOTIFICATION_READ: "notification-read",
};

module.exports = EVENTS;
