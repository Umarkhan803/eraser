import React from "react";
import fabric from "fabric";

interface Shape {
  name: string;
  icon: string;
  create: () => fabric.Object;
}

const shapes: Shape[] = [
  {
    name: "Rectangle",
    icon: "▭",
    create: () =>
      new fabric.Rect({
        width: 100,
        height: 100,
        fill: "#3b82f6",
      }),
  },
  {
    name: "Circle",
    icon: "●",
    create: () =>
      new fabric.Circle({
        radius: 50,
        fill: "#10b981",
      }),
  },
  {
    name: "Triangle",
    icon: "△",
    create: () =>
      new fabric.Triangle({
        width: 100,
        height: 100,
        fill: "#f59e0b",
      }),
  },
  {
    name: "Line",
    icon: "─",
    create: () =>
      new fabric.Line([0, 0, 100, 0], {
        stroke: "#ef4444",
        strokeWidth: 2,
      }),
  },
  {
    name: "Arrow",
    icon: "→",
    create: () =>
      new fabric.Line([0, 0, 100, 0], {
        stroke: "#8b5cf6",
        strokeWidth: 2,
      }),
  },
];

interface ShapesProps {
  onSelect: (shape: fabric.Object) => void;
}

const Shapes: React.FC<ShapesProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {shapes.map((shape) => (
        <button
          key={shape.name}
          onClick={() => {
            const obj = shape.create();
            (obj as any).id = `${shape.name.toLowerCase()}-${Date.now()}`;
            onSelect(obj);
          }}
          className="p-3 border rounded hover:bg-gray-100 transition-colors text-center"
        >
          <div className="text-2xl mb-1">{shape.icon}</div>
          <div className="text-xs text-gray-600">{shape.name}</div>
        </button>
      ))}
    </div>
  );
};

export default Shapes;
