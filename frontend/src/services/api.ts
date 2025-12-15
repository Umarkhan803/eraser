import type { ApiResponse, User } from "../types/Interface";
import axiosInstance from "./axiosInstance";

export const signUpUser = (data: User) => {
  return axiosInstance.post<ApiResponse<any>>("/auth/register", data);
};
export const login = (data: User) => {
  return axiosInstance.post<ApiResponse<any>>("/auth/login", data);
};
export const logout = () => {
  return axiosInstance.post<ApiResponse<void>>("/auth/logout");
};
export const getMe = () => {
  return axiosInstance.get<ApiResponse<any>>("/auth/me");
};
export const updateProfile = (data: User) => {
  return axiosInstance.put<ApiResponse<any>>("/auth/profile", data);
};
