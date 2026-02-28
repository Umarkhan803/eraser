import React from "react";
import { Link } from "react-router-dom";
import images from "../../assets/images";
import { useAuth } from "../../context/Auth.context";

const NavBar: React.FC = () => {
  const { logout } = useAuth();
  return (
    <header className="w-full h-16 bg-white shadow-md">
      <div className="container mx-auto pl-1 pr-4 h-full flex items-center justify-between">
        <div className="flex justify-center items-center h-full">
          <img src={images.logo} alt="Eraser Logo" className="w-25 h-7 mr-2" />
          <Link to="/" className="text-2xl font-bold">
            Eraser
          </Link>
        </div>

        <div>
          <Link
            to="/"
            onClick={logout}
            className=" text-gray-600 bg-blue-400  hover:text-gray-800 "
          >
            logout
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
