import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { proxyUrl } from "../services/utils";
import type { User } from "../types/Interface";
import { getMe } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  message: string | null;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [userType, setUserType] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
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

  // Define sign up and logout methods here to match AuthContextType requirements
  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setMessage(null);
    try {
      // Example POST to sign up endpoint
      const response = await axios.post(`${proxyUrl()}/api/auth/register`, {
        name,
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        setLoading(false);
        // Optionally store token if you use JWT, etc.
      } else {
        setMessage(response.data.message || "Sign up failed");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Sign up failed");
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const logout = () => {
    // Delete any stored auth tokens/cookies as needed
    setUser(null);
    setIsAuthenticated(false);
    setMessage(null);
    setLoading(false);
    // Optionally make an API call to logout as well
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        message,
        signUp,
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
