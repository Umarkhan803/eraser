import { useEffect, useRef, useCallback } from "react";
import websocketService from "../services/websocket";

interface UseWebSocketOptions {
  canvasId?: string;
  userId?: string;
  enabled?: boolean;
}

export const useWebSocket = ({
  canvasId,
  userId,
  enabled = true,
}: UseWebSocketOptions) => {
  const callbacksRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem("token");
    if (token) {
      websocketService.connect(token);
    }

    return () => {
      if (canvasId && userId) {
        websocketService.leaveCanvas(canvasId, userId);
      }
    };
  }, [enabled, canvasId, userId]);

  // Generic event listener
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (!callbacksRef.current.has(event)) {
      callbacksRef.current.set(event, new Set());
    }
    callbacksRef.current.get(event)?.add(callback);
    websocketService.on(event, callback);

    return () => {
      callbacksRef.current.get(event)?.delete(callback);
      websocketService.off(event, callback);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      callbacksRef.current.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          websocketService.off(event, callback);
        });
      });
      callbacksRef.current.clear();
    };
  }, []);

  return {
    socket: websocketService,
    isConnected: websocketService.isConnected(),
    on,
  };
};
