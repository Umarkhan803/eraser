import React, { useState, useEffect } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import fabric from "fabric";

const PropertiesPanel: React.FC = () => {
  const { fabricCanvas, updateObject } = useCanvasContext();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [properties, setProperties] = useState({
    fill: "#000000",
    stroke: "#000000",
    strokeWidth: 1,
    opacity: 1,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
  });

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleSelection = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        setSelectedObject(activeObject);
        setProperties({
          fill: (activeObject as any).fill || "#000000",
          stroke: (activeObject as any).stroke || "#000000",
          strokeWidth: (activeObject as any).strokeWidth || 1,
          opacity: activeObject.opacity || 1,
          left: activeObject.left || 0,
          top: activeObject.top || 0,
          width: (activeObject as any).width || 0,
          height: (activeObject as any).height || 0,
          angle: activeObject.angle || 0,
          scaleX: activeObject.scaleX || 1,
          scaleY: activeObject.scaleY || 1,
        });
      } else {
        setSelectedObject(null);
      }
    };

    fabricCanvas.on("selection:created", handleSelection);
    fabricCanvas.on("selection:updated", handleSelection);
    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    return () => {
      fabricCanvas.off("selection:created", handleSelection);
      fabricCanvas.off("selection:updated", handleSelection);
      fabricCanvas.off("selection:cleared", handleSelection);
    };
  }, [fabricCanvas]);

  const handlePropertyChange = (key: string, value: any) => {
    if (!selectedObject) return;

    setProperties((prev) => ({ ...prev, [key]: value }));
    selectedObject.set(key as any, value);
    fabricCanvas?.renderAll();

    const objectId = (selectedObject as any).id;
    if (objectId) {
      updateObject(objectId, { [key]: value });
    }
  };

  if (!selectedObject) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Select an object to edit properties
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg mb-4">Properties</h3>

      {/* Fill Color */}
      <div>
        <label className="block text-sm font-medium mb-1">Fill Color</label>
        <input
          type="color"
          value={properties.fill}
          onChange={(e) => handlePropertyChange("fill", e.target.value)}
          className="w-full h-10 rounded border"
        />
      </div>

      {/* Stroke Color */}
      <div>
        <label className="block text-sm font-medium mb-1">Stroke Color</label>
        <input
          type="color"
          value={properties.stroke}
          onChange={(e) => handlePropertyChange("stroke", e.target.value)}
          className="w-full h-10 rounded border"
        />
      </div>

      {/* Stroke Width */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Stroke Width: {properties.strokeWidth}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={properties.strokeWidth}
          onChange={(e) =>
            handlePropertyChange("strokeWidth", parseInt(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Opacity: {Math.round(properties.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={properties.opacity}
          onChange={(e) =>
            handlePropertyChange("opacity", parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">X</label>
          <input
            type="number"
            value={Math.round(properties.left)}
            onChange={(e) =>
              handlePropertyChange("left", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Y</label>
          <input
            type="number"
            value={Math.round(properties.top)}
            onChange={(e) =>
              handlePropertyChange("top", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Width</label>
          <input
            type="number"
            value={Math.round(properties.width)}
            onChange={(e) =>
              handlePropertyChange("width", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <input
            type="number"
            value={Math.round(properties.height)}
            onChange={(e) =>
              handlePropertyChange("height", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Rotation: {Math.round(properties.angle)}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={properties.angle}
          onChange={(e) =>
            handlePropertyChange("angle", parseInt(e.target.value))
          }
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PropertiesPanel;
