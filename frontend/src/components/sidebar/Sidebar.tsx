import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  return (
    <nav className="w-64 bg-gray-800 text-white h-[90vh] p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-2 py-1 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `block px-2 py-1 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `block px-2 py-1 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `block px-2 py-1 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="mt-4 border-2 border-gray-200">
        <img src={user?.avatar || "/default-avatar.png"} alt="User Avatar" />
        <h2>{user?.name}</h2>
      </div>
    </nav>
  );
};

export default Sidebar;
