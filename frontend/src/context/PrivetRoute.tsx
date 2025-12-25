import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Auth.context";
import Loader from "../components/common/Loader";
import "../styles/global.css";

const PrivetRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <Outlet />
    </div>
  );
};

export default PrivetRoute;
