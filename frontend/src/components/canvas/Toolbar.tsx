import React from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import fabric from "fabric";
import {
  Square,
  Circle,
  Type,
  Minus,
  Image,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Save,
} from "lucide-react";

const Toolbar: React.FC = () => {
  const {
    fabricCanvas,
    addObject,
    deleteSelected,
    undo,
    redo,
    exportCanvas,
    saveCanvas,
  } = useCanvasContext();

  const addRectangle = () => {
    if (!fabricCanvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "#3b82f6",
      id: `rect-${Date.now()}`,
    });
    addObject(rect);
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: "#10b981",
      id: `circle-${Date.now()}`,
    });
    addObject(circle);
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.Text("Text", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#1f2937",
      id: `text-${Date.now()}`,
    });
    addObject(text);
  };

  const addLine = () => {
    if (!fabricCanvas) return;
    const line = new fabric.Line([50, 100, 200, 100], {
      stroke: "#ef4444",
      strokeWidth: 2,
      id: `line-${Date.now()}`,
    });
    addObject(line);
  };

  const handleExport = async (format: "png" | "json" | "svg") => {
    const data = await exportCanvas(format);
    if (data) {
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `canvas-${Date.now()}.png`;
        link.href = data;
        link.click();
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `canvas-${Date.now()}.${format}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b shadow-sm">
      {/* Shape Tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          onClick={addRectangle}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Rectangle"
        >
          <Square className="w-5 h-5" />
        </button>
        <button
          onClick={addCircle}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Circle"
        >
          <Circle className="w-5 h-5" />
        </button>
        <button
          onClick={addText}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Text"
        >
          <Type className="w-5 h-5" />
        </button>
        <button
          onClick={addLine}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Line"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Action Tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
        <button
          onClick={deleteSelected}
          className="p-2 hover:bg-gray-100 rounded transition-colors text-red-600"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Export & Save */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => saveCanvas()}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Save"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleExport("png")}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Export PNG"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
