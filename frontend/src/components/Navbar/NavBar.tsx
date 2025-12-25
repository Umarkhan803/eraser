import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <header className="w-full h-16 bg-white shadow-md">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Eraser
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
