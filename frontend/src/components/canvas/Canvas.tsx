import React, { useEffect } from "react";
// import { Circle, Rect, Textbox } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import * as fabric from "fabric";

const Canvas: React.FC = () => {
  const {
    canvasRef,
    fabricCanvas,
    addObject,
    deleteSelected,
    undo,
    redo,
    saveCanvas,
    loading,
  } = useCanvasContext();

  // attach a simple save-on-modify listener
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleModified = () => {
      saveCanvas();
    };

    fabricCanvas.on("object:modified", handleModified);

    return () => {
      fabricCanvas.off("object:modified", handleModified);
    };
  }, [fabricCanvas, saveCanvas]);

  const addRectangle = () => {
    const rect = new fabric.Rect({
      width: 100,
      height: 60,
      fill: "#ff5722",
      left: 50,
      top: 50,
      id: new Date().getTime().toString(),
    });
    addObject(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: "#2196f3",
      left: 100,
      top: 100,
      id: new Date().getTime().toString(),
    });
    addObject(circle);
  };

  const addText = () => {
    const text = new fabric.Textbox("Hello", {
      left: 150,
      top: 150,
      fontSize: 20,
      fill: "#000000",
      id: new Date().getTime().toString(),
    });
    addObject(text);
  };

  if (loading) {
    return <div className="p-4">Loading canvas...</div>;
  }

  return (
    <div className="canvas-wrapper relative w-full h-full">
      <div className="toolbar absolute top-0 left-0 p-2 bg-white bg-opacity-90 z-10 flex space-x-2">
        <button onClick={addRectangle}>Rect</button>
        <button onClick={addCircle}>Circle</button>
        <button onClick={addText}>Text</button>
        <button onClick={deleteSelected}>Del</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={saveCanvas}>Save</button>
      </div>
      <canvas ref={canvasRef} className="border" />
    </div>
  );
};

export default Canvas;
