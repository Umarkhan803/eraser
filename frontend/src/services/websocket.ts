import { io, Socket } from "socket.io-client";
import { proxyUrl } from "./utils";

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    const baseURL = proxyUrl().replace("/api", "");

    this.socket = io(baseURL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Canvas events
  joinCanvas(canvasId: string, userId: string) {
    this.socket?.emit("join-canvas", { canvasId, userId });
  }

  leaveCanvas(canvasId: string, userId: string) {
    this.socket?.emit("leave-canvas", { canvasId, userId });
  }

  sendCanvasUpdate(
    canvasId: string,
    objects: any[],
    userId: string,
    action: string
  ) {
    this.socket?.emit("canvas-update", { canvasId, objects, userId, action });
  }

  onCanvasUpdate(callback: (data: any) => void) {
    this.socket?.on("canvas-update", callback);
  }

  // Cursor events
  sendCursorMove(
    canvasId: string,
    userId: string,
    cursor: { x: number; y: number }
  ) {
    this.socket?.emit("cursor-move", { canvasId, userId, cursor });
  }

  onCursorUpdate(callback: (data: any) => void) {
    this.socket?.on("cursor-update", callback);
  }

  // Object events
  sendObjectAdded(canvasId: string, object: any, userId: string) {
    this.socket?.emit("object-added", { canvasId, object, userId });
  }

  onObjectAdded(callback: (data: any) => void) {
    this.socket?.on("object-added", callback);
  }

  sendObjectDeleted(canvasId: string, objectId: string, userId: string) {
    this.socket?.emit("object-deleted", { canvasId, objectId, userId });
  }

  onObjectDeleted(callback: (data: any) => void) {
    this.socket?.on("object-deleted", callback);
  }

  sendObjectUpdated(
    canvasId: string,
    objectId: string,
    properties: any,
    userId: string
  ) {
    this.socket?.emit("object-updated", {
      canvasId,
      objectId,
      properties,
      userId,
    });
  }

  onObjectUpdated(callback: (data: any) => void) {
    this.socket?.on("object-updated", callback);
  }

  sendObjectSelected(canvasId: string, objectId: string, userId: string) {
    this.socket?.emit("object-selected", { canvasId, objectId, userId });
  }

  onObjectSelected(callback: (data: any) => void) {
    this.socket?.on("object-selected", callback);
  }

  sendObjectDeselected(canvasId: string, objectId: string, userId: string) {
    this.socket?.emit("object-deselected", { canvasId, objectId, userId });
  }

  onObjectDeselected(callback: (data: any) => void) {
    this.socket?.on("object-deselected", callback);
  }

  // User presence events
  onUserJoined(callback: (data: any) => void) {
    this.socket?.on("user-joined", callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on("user-left", callback);
  }

  // Comment events
  sendNewComment(canvasId: string, comment: any, userId: string) {
    this.socket?.emit("new-comment", { canvasId, comment, userId });
  }

  onCommentAdded(callback: (data: any) => void) {
    this.socket?.on("comment-added", callback);
  }

  sendCommentResolved(canvasId: string, commentId: string, userId: string) {
    this.socket?.emit("comment-resolved", { canvasId, commentId, userId });
  }

  onCommentResolved(callback: (data: any) => void) {
    this.socket?.on("comment-resolved", callback);
  }

  // Typing events
  sendTypingStart(canvasId: string, userId: string, userName: string) {
    this.socket?.emit("typing-start", { canvasId, userId, userName });
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on("user-typing", callback);
  }

  sendTypingStop(canvasId: string, userId: string) {
    this.socket?.emit("typing-stop", { canvasId, userId });
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    this.socket?.on("user-stopped-typing", callback);
  }

  // Canvas operations
  sendUndo(canvasId: string, userId: string) {
    this.socket?.emit("undo", { canvasId, userId });
  }

  onUndoPerformed(callback: (data: any) => void) {
    this.socket?.on("undo-performed", callback);
  }

  sendRedo(canvasId: string, userId: string) {
    this.socket?.emit("redo", { canvasId, userId });
  }

  onRedoPerformed(callback: (data: any) => void) {
    this.socket?.on("redo-performed", callback);
  }

  // View events
  sendZoomChange(canvasId: string, zoom: number, userId: string) {
    this.socket?.emit("zoom-change", { canvasId, zoom, userId });
  }

  onZoomChanged(callback: (data: any) => void) {
    this.socket?.on("zoom-changed", callback);
  }

  sendPanChange(
    canvasId: string,
    pan: { x: number; y: number },
    userId: string
  ) {
    this.socket?.emit("pan-change", { canvasId, pan, userId });
  }

  onPanChanged(callback: (data: any) => void) {
    this.socket?.on("pan-changed", callback);
  }

  // Generic event handlers
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
