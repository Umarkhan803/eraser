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
    <div className="page-container">
      <Outlet />
    </div>
  );
};

export default PrivetRoute;
