import React, { useRef, useState } from "react";
import NavBar from "../components/Navbar/NavBar";
import Sidebar from "../components/sidebar/Sidebar";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react";
const modules = [AllCommunityModule];

const Dashboard: React.FC = () => {
  const gridRef = useRef<any>(null);

  const clearAllFilters = () => {
    gridRef.current.api.setFilterModel(null);
  };

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950 },
    { make: "Ford", model: "F-Series", price: 33850 },
    { make: "Toyota", model: "Corolla", price: 29600 },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<any>([
    { field: "make", filter: false },
    { field: "model", filter: false },
    { field: "price", filter: false },
  ]);
  return (
    <>
      <NavBar />
      <div className="flex" style={{ height: "calc(100vh - 4rem)" }}>
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <div className="m-10 bg-red-700">
            <AgGridProvider modules={modules}>
              <div
                className="ag-theme-alpine bg-gray-700"
                style={{ height: 400 }}
              >
                <AgGridReact
                  className="w-ful"
                  rowData={rowData}
                  columnDefs={colDefs}
                  ref={gridRef}
                />
              </div>
            </AgGridProvider>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
