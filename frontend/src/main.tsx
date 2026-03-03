import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/Auth.context.tsx";
import { AgGridProvider } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import { CanvasProvider } from "./context/CanvasContext.tsx";
const modules = [AllCommunityModule];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CanvasProvider>
        <AgGridProvider modules={modules}>
          <Toaster />
          <App />
        </AgGridProvider>
      </CanvasProvider>
    </AuthProvider>
  </StrictMode>,
);
