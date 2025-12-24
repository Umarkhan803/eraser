import type { ApiResponse, User } from "../types/Interface";
import axiosInstance from "./axiosInstance";

export const signUpUser = (data: User) => {
  return axiosInstance.post<ApiResponse<any>>("/api/auth/register", data);
};
export const login = (data: User) => {
  return axiosInstance.post<ApiResponse<any>>("/api/auth/login", data);
};
export const logout = () => {
  return axiosInstance.post<ApiResponse<void>>("/api/auth/logout");
};
export const getMe = () => {
  return axiosInstance.get<ApiResponse<any>>("/api/auth/me");
};
export const updateProfile = (data: User) => {
  return axiosInstance.put<ApiResponse<any>>("/api/auth/profile", data);
};
