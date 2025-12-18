import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./Auth.context";
import Loader from "../components/common/Loader";

const PrivetRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="page-container">
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <div className={`page-container ${location.pathname}`}>
          <Outlet />
        </div>
      ) : (
        <div className="page-container">
          <p>Unauthorized access</p>
        </div>
      )}
    </div>
  );
};

export default PrivetRoute;
