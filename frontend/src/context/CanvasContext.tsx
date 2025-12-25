import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useCanvas } from "../hooks/useCanvas";
import type { Canvas } from "../types/Interface";
import type fabric from "fabric";

interface CanvasContextType {
  canvas: Canvas | null;
  fabricCanvas: fabric.Canvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  loading: boolean;
  error: string | null;
  saveCanvas: () => Promise<void>;
  sendCanvasUpdate: (action?: string) => void;
  addObject: (object: any) => void;
  deleteSelected: () => void;
  updateObject: (objectId: string, properties: any) => void;
  undo: () => void;
  redo: () => void;
  exportCanvas: (format?: string) => Promise<any>;
  setCanvasId: (id: string) => void;
  setUserId: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [canvasId, setCanvasId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const {
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
  } = useCanvas({
    canvasId,
    userId,
    onUpdate: (objects) => {
      // Handle canvas updates
      console.log("Canvas updated:", objects);
    },
  });

  return (
    <CanvasContext.Provider
      value={{
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
        setCanvasId,
        setUserId,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
