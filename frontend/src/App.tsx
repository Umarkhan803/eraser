import "./App.css";
import "./styles/global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PrivetRoute from "./context/PrivetRoute";
import Login from "./components/login/Login";
import { useAuth } from "./context/Auth.context";
import Loader from "./components/common/Loader";
import SignUp from "./components/signup/SignUp";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Main = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }
  return isAuthenticated ? <Dashboard /> : <Home />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route */}
        <Route path="" element={<Main />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route element={<PrivetRoute />}>
          <Route path="/editor" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
