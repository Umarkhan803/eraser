import { useState, useEffect, useCallback, useRef } from "react";
import fabric from "fabric";
import { getCanvas, updateCanvas } from "../services/api";
import websocketService from "../services/websocket";
import type { Canvas } from "../types/Interface";

interface UseCanvasOptions {
  canvasId: string;
  userId: string;
  onUpdate?: (objects: any[]) => void;
}

export const useCanvas = ({ canvasId, userId, onUpdate }: UseCanvasOptions) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isUpdatingRef = useRef(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvasInstance = new fabric.Canvas(canvasRef.current, {
      width: 1920,
      height: 1080,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(fabricCanvasInstance);

    return () => {
      fabricCanvasInstance.dispose();
    };
  }, []);

  // Load canvas data
  useEffect(() => {
    const loadCanvas = async () => {
      try {
        setLoading(true);
        const response = await getCanvas(canvasId);
        if (response.data.success) {
          const canvasData = response.data.data;
          setCanvas(canvasData);

          // Load objects into Fabric.js canvas
          if (fabricCanvas && canvasData.objects) {
            fabricCanvas.loadFromJSON({ objects: canvasData.objects }, () => {
              fabricCanvas.renderAll();
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load canvas");
        setLoading(false);
      }
    };

    if (canvasId) {
      loadCanvas();
    }
  }, [canvasId, fabricCanvas]);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!canvasId || !userId) return;

    // Join canvas room
    websocketService.joinCanvas(canvasId, userId);

    // Listen for canvas updates from other users
    const handleCanvasUpdate = (data: any) => {
      if (data.userId !== userId && fabricCanvas) {
        isUpdatingRef.current = true;
        fabricCanvas.loadFromJSON({ objects: data.objects }, () => {
          fabricCanvas.renderAll();
          isUpdatingRef.current = false;
          onUpdate?.(data.objects);
        });
      }
    };

    websocketService.onCanvasUpdate(handleCanvasUpdate);

    // Listen for object events
    websocketService.onObjectAdded((data) => {
      if (data.userId !== userId && fabricCanvas) {
        const obj = data.object;
        fabric.Canvas.prototype.add.apply(fabricCanvas, [obj]);
        fabricCanvas.renderAll();
      }
    });

    websocketService.onObjectDeleted((data) => {
      if (data.userId !== userId && fabricCanvas) {
        const obj = fabricCanvas
          .getObjects()
          .find((o: any) => o.id === data.objectId);
        if (obj) {
          fabricCanvas.remove(obj);
          fabricCanvas.renderAll();
        }
      }
    });

    return () => {
      websocketService.leaveCanvas(canvasId, userId);
      websocketService.off("canvas-update", handleCanvasUpdate);
    };
  }, [canvasId, userId, fabricCanvas, onUpdate]);

  // Save canvas to server
  const saveCanvas = useCallback(async () => {
    if (!fabricCanvas || !canvasId || isUpdatingRef.current) return;

    try {
      const objects = fabricCanvas.toJSON();
      await updateCanvas(canvasId, { objects: objects.objects });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save canvas");
    }
  }, [fabricCanvas, canvasId]);

  // Send canvas update via WebSocket
  const sendCanvasUpdate = useCallback(
    (action: string = "update") => {
      if (!fabricCanvas || !canvasId || isUpdatingRef.current) return;

      const objects = fabricCanvas.toJSON();
      websocketService.sendCanvasUpdate(
        canvasId,
        objects.objects,
        userId,
        action
      );
      onUpdate?.(objects.objects);
    },
    [fabricCanvas, canvasId, userId, onUpdate]
  );

  // Add object to canvas
  const addObject = useCallback(
    (object: any) => {
      if (!fabricCanvas) return;

      fabricCanvas.add(object);
      fabricCanvas.setActiveObject(object);
      fabricCanvas.renderAll();

      websocketService.sendObjectAdded(
        canvasId,
        object.toObject(["id"]),
        userId
      );
      sendCanvasUpdate("add");
    },
    [fabricCanvas, canvasId, userId, sendCanvasUpdate]
  );

  // Delete selected object
  const deleteSelected = useCallback(() => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      const objectId = (activeObject as any).id;
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();

      websocketService.sendObjectDeleted(canvasId, objectId, userId);
      sendCanvasUpdate("delete");
    }
  }, [fabricCanvas, canvasId, userId, sendCanvasUpdate]);

  // Update object properties
  const updateObject = useCallback(
    (objectId: string, properties: any) => {
      if (!fabricCanvas) return;

      const obj = fabricCanvas.getObjects().find((o: any) => o.id === objectId);
      if (obj) {
        obj.set(properties);
        fabricCanvas.renderAll();

        websocketService.sendObjectUpdated(
          canvasId,
          objectId,
          properties,
          userId
        );
        sendCanvasUpdate("update");
      }
    },
    [fabricCanvas, canvasId, userId, sendCanvasUpdate]
  );

  // Undo/Redo (basic implementation)
  const undo = useCallback(() => {
    websocketService.sendUndo(canvasId, userId);
  }, [canvasId, userId]);

  const redo = useCallback(() => {
    websocketService.sendRedo(canvasId, userId);
  }, [canvasId, userId]);

  // Export canvas
  const exportCanvas = useCallback(
    async (format: string = "json") => {
      if (!fabricCanvas) return null;

      if (format === "json") {
        return fabricCanvas.toJSON();
      } else if (format === "png") {
        // Provide required 'multiplier' property to satisfy the type checker
        return fabricCanvas.toDataURL({ format: "png", multiplier: 1 });
      } else if (format === "svg") {
        return fabricCanvas.toSVG();
      }
      return null;
    },
    [fabricCanvas]
  );

  return {
    canvas,
    fabricCanvas,
    canvasRef,
    loading,
    error,
    saveCanvas,
    sendCanvasUpdate,
    addObject,
    deleteSelected,
    updateObject,
    undo,
    redo,
    exportCanvas,
  };
};
