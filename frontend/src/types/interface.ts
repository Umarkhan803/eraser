export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  password?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  owner: string;
  collaborators: string[];
  canvas: string;
  thumbnail: string;
  isPublic: boolean;
  tags: string[];
  folder: string;
  isFavorite: boolean;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface Canvas {
  id: string;
  project: string;
  objects: any[];
  background: string;
  width: number;
  height: number;
  zoom: number;
  version: number;
  history: any[];
  activeUsers: any[];
  layers: any[];
  createdAt: Date;
  updatedAt: Date;
}
