import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/NavBar";
import Sidebar from "../components/sidebar/Sidebar";
import { AgGridReact } from "ag-grid-react";
import { getProjects, createProject, createCanvas } from "../services/api";
import type { Project } from "../types/Interface";

const Dashboard: React.FC = () => {
  const gridRef = useRef<any>(null);
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // column definitions
  const [colDefs] = useState<any>([
    {
      field: "title",
      headerName: "Name",
    },
    {
      field: "createdAt",
      headerName: "Created",
      headerClass: "center-header",
      cellClass: "center-cell",
    },
    {
      field: "updatedAt",
      headerName: "Edited",
      headerClass: "center-header",
      cellClass: "center-cell",
    },
  ]);

  const defaultColDef = {
    flex: 1,
    resizable: false,
    filter: false,
    floatingFilter: false,
    suppressMenu: true,
    sortable: false,
    suppressMovable: true,
  };

  // fetch projects on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProjects();
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRowClick = (event: any) => {
    const proj: Project = event.data;
    if (proj.canvas && typeof proj.canvas !== "string") {
      navigate(`/editor?canvasId=${(proj.canvas as any)._id || proj.canvas}`);
    } else if (proj.canvas) {
      navigate(`/editor?canvasId=${proj.canvas}`);
    }
  };

  const handleNew = async () => {
    try {
      // create a standalone canvas (no project)
      const res = await createCanvas();
      if (res.data.success) {
        const canvas = res.data.data as any;
        navigate(`/editor?canvasId=${canvas._id || canvas.id}`);
      }
    } catch (err) {
      console.error("Failed to create canvas", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex" style={{ height: "calc(100vh - 4rem)" }}>
        <Sidebar />
        <main className="flex-1 pt-6 pl-2 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleNew}
            >
              New Canvas
            </button>
          </div>
          <div className="">
            <div
              className="ag-theme-alpine"
              style={{ height: 400, width: "100%" }}
            >
              <AgGridReact
                className="w-full"
                rowData={projects}
                columnDefs={colDefs}
                onRowClicked={handleRowClick}
                ref={gridRef}
                defaultColDef={defaultColDef}
                loading={loading}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
