import React, { useState } from "react";
import { Pencil, Eraser, Highlighter } from "lucide-react";

interface DrawingToolsProps {
  onToolSelect: (tool: "pencil" | "eraser" | "highlighter" | null) => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ onToolSelect }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleToolClick = (tool: "pencil" | "eraser" | "highlighter") => {
    if (activeTool === tool) {
      setActiveTool(null);
      onToolSelect(null);
    } else {
      setActiveTool(tool);
      onToolSelect(tool);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <button
        onClick={() => handleToolClick("pencil")}
        className={`p-2 rounded transition-colors ${
          activeTool === "pencil"
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
        }`}
        title="Pencil"
      >
        <Pencil className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleToolClick("eraser")}
        className={`p-2 rounded transition-colors ${
          activeTool === "eraser"
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
        }`}
        title="Eraser"
      >
        <Eraser className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleToolClick("highlighter")}
        className={`p-2 rounded transition-colors ${
          activeTool === "highlighter"
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
        }`}
        title="Highlighter"
      >
        <Highlighter className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DrawingTools;
