import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";

const NavBar: React.FC = () => {
  const { logout } = useAuth();
  return (
    <header className="w-full h-16 bg-white shadow-md">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Eraser
        </Link>
        <div>
          <Link
            to="/"
            onClick={logout}
            className="text-gray-600 hover:text-gray-800 mx-4"
          >
            logout
          </Link>
          <Link to="/signup" className="text-gray-600 hover:text-gray-800 mx-4">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
