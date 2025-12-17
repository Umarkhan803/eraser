import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { proxyUrl } from "../services/utils";
import type { User } from "../types/Interface";
import { getMe } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [userType, setUserType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Define login and logout methods here to match AuthContextType requirements
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Example POST to login endpoint
      const response = await axios.post(`${proxyUrl}/auth/login`, {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        setLoading(false);
        // Optionally store token if you use JWT, etc.
      } else {
        setError(response.data.message || "Login failed");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const logout = () => {
    // Delete any stored auth tokens/cookies as needed
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setLoading(false);
    // Optionally make an API call to logout as well
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
