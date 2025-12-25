import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type { User } from "../types/Interface";
import {
  getMe,
  login as loginApi,
  signUpUser,
  logout as logoutApi,
} from "../services/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  message: string | null;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [userType, setUserType] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (hasCheckedAuth.current) return;

    const checkAuth = async () => {
      hasCheckedAuth.current = true;

      // Check if token exists in localStorage first
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        const response = await getMe();
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          // Token might be invalid, remove it
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error: any) {
        // If 401, token is invalid
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
        setIsAuthenticated(false);
        setUser(null);
        console.log("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Define sign up and logout methods here to match AuthContextType requirements
  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setMessage(null);
    try {
      // Use signUpUser from api service instead of direct axios
      const response = await signUpUser({ name, email, password });

      if (response.data.success) {
        // Token is stored by axiosInstance interceptor
        setUser(response.data.data);
        setIsAuthenticated(true);
        hasCheckedAuth.current = true; // Mark as checked
        toast.success(response.data.message || "Sign up successful");
      } else {
        toast.error(response.data.message || "Sign up failed");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Sign up failed");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await loginApi({ email, password });

      if (response.data.success) {
        // Token is stored by axiosInstance interceptor
        // After successful login, get user data
        const meResponse = await getMe();
        if (meResponse.data.success) {
          setUser(meResponse.data.data);
          setIsAuthenticated(true);
          hasCheckedAuth.current = true; // Mark as checked
          toast.success(response.data.message || "Login successful");
        }
      } else {
        toast.error(response.data.message || "Login failed");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      setMessage(null);
      hasCheckedAuth.current = false; // Reset check flag
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        message,
        loading,
        signUp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
