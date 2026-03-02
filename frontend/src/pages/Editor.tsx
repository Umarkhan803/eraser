import React, { useEffect } from "react";
import Canvas from "../components/canvas/Canvas";
import { CanvasProvider, useCanvasContext } from "../context/CanvasContext";
import { useAuth } from "../context/Auth.context";

const EditorContent: React.FC = () => {
  const { setCanvasId, setUserId } = useCanvasContext();
  const { user } = useAuth();

  useEffect(() => {
    // Read canvasId from query string or other source
    const params = new URLSearchParams(window.location.search);
    const id = params.get("canvasId") || params.get("id") || "";
    if (id) setCanvasId(id);
    if (user && user.id) setUserId(user.id);
  }, [user, setCanvasId, setUserId]);

  return <Canvas />;
};

const Editor: React.FC = () => (
  <CanvasProvider>
    <EditorContent />
  </CanvasProvider>
);

export default Editor;
