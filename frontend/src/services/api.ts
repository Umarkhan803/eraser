import type {
  ApiResponse,
  User,
  Project,
  Canvas,
  Comment,
} from "../types/Interface";
import axiosInstance from "./axiosInstance";

// ==================== AUTH API ====================
export const signUpUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axiosInstance.post<ApiResponse<User>>("/api/auth/register", data);
};

export const login = (data: { email: string; password: string }) => {
  return axiosInstance.post<ApiResponse<User>>("/api/auth/login", data);
};

export const logout = () => {
  return axiosInstance.post<ApiResponse<void>>("/api/auth/logout");
};

export const getMe = () => {
  return axiosInstance.get<ApiResponse<User>>("/api/auth/me");
};

export const updateProfile = (data: Partial<User>) => {
  return axiosInstance.put<ApiResponse<User>>("/api/auth/update-profile", data);
};

export const updatePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return axiosInstance.put<ApiResponse<void>>(
    "/api/auth/update-password",
    data
  );
};

// ==================== PROJECT API ====================
export const getProjects = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  folder?: string;
  isFavorite?: boolean;
}) => {
  return axiosInstance.get<ApiResponse<Project[]>>("/api/projects", { params });
};

export const getProject = (id: string) => {
  return axiosInstance.get<ApiResponse<Project>>(`/api/projects/${id}`);
};

export const createProject = (data: {
  title: string;
  description?: string;
  tags?: string[];
  folder?: string;
}) => {
  return axiosInstance.post<ApiResponse<Project>>("/api/projects", data);
};

export const updateProject = (id: string, data: Partial<Project>) => {
  return axiosInstance.put<ApiResponse<Project>>(`/api/projects/${id}`, data);
};

export const deleteProject = (id: string) => {
  return axiosInstance.delete<ApiResponse<void>>(`/api/projects/${id}`);
};

export const duplicateProject = (id: string) => {
  return axiosInstance.post<ApiResponse<Project>>(
    `/api/projects/${id}/duplicate`
  );
};

export const toggleFavorite = (id: string) => {
  return axiosInstance.put<ApiResponse<Project>>(
    `/api/projects/${id}/favorite`
  );
};

export const getSharedProjects = () => {
  return axiosInstance.get<ApiResponse<Project[]>>("/api/projects/shared/all");
};

// ==================== CANVAS API ====================
export const getCanvas = (id: string) => {
  return axiosInstance.get<ApiResponse<Canvas>>(`/api/canvas/${id}`);
};

export const updateCanvas = (id: string, data: Partial<Canvas>) => {
  return axiosInstance.put<ApiResponse<Canvas>>(`/api/canvas/${id}`, data);
};

export const saveCanvasVersion = (id: string, action?: string) => {
  return axiosInstance.post<ApiResponse<Canvas>>(
    `/api/canvas/${id}/save-version`,
    { action }
  );
};

export const getCanvasHistory = (id: string) => {
  return axiosInstance.get<ApiResponse<any[]>>(`/api/canvas/${id}/history`);
};

export const restoreCanvasVersion = (id: string, versionId: string) => {
  return axiosInstance.put<ApiResponse<Canvas>>(
    `/api/canvas/${id}/restore/${versionId}`
  );
};

export const exportCanvas = (id: string, format: string = "json") => {
  return axiosInstance.post<ApiResponse<any>>(`/api/canvas/${id}/export`, {
    format,
  });
};

export const updateCanvasSettings = (
  id: string,
  settings: { gridEnabled?: boolean; snapToGrid?: boolean; gridSize?: number }
) => {
  return axiosInstance.put<ApiResponse<Canvas>>(
    `/api/canvas/${id}/settings`,
    settings
  );
};

// ==================== COLLABORATION API ====================
export const inviteCollaborator = (
  projectId: string,
  data: { email: string; permission?: string }
) => {
  return axiosInstance.post<ApiResponse<Project>>(
    `/api/collaboration/${projectId}/invite`,
    data
  );
};

export const getCollaborators = (projectId: string) => {
  return axiosInstance.get<ApiResponse<any>>(
    `/api/collaboration/${projectId}/collaborators`
  );
};

export const updateCollaboratorPermission = (
  projectId: string,
  userId: string,
  permission: string
) => {
  return axiosInstance.put<ApiResponse<Project>>(
    `/api/collaboration/${projectId}/collaborators/${userId}`,
    { permission }
  );
};

export const removeCollaborator = (projectId: string, userId: string) => {
  return axiosInstance.delete<ApiResponse<void>>(
    `/api/collaboration/${projectId}/collaborators/${userId}`
  );
};

export const getPendingInvitations = () => {
  return axiosInstance.get<ApiResponse<any[]>>(
    "/api/collaboration/invitations/pending"
  );
};

export const acceptInvitation = (invitationId: string) => {
  return axiosInstance.post<ApiResponse<void>>(
    `/api/collaboration/invitations/${invitationId}/accept`
  );
};

export const rejectInvitation = (invitationId: string) => {
  return axiosInstance.post<ApiResponse<void>>(
    `/api/collaboration/invitations/${invitationId}/reject`
  );
};

export const leaveProject = (projectId: string) => {
  return axiosInstance.post<ApiResponse<void>>(
    `/api/collaboration/${projectId}/leave`
  );
};

// ==================== COMMENT API ====================
export const getComments = (canvasId: string) => {
  return axiosInstance.get<ApiResponse<Comment[]>>(
    `/api/comments/canvas/${canvasId}`
  );
};

export const createComment = (
  canvasId: string,
  data: {
    content: string;
    position: { x: number; y: number };
    objectId?: string;
  }
) => {
  return axiosInstance.post<ApiResponse<Comment>>(
    `/api/comments/canvas/${canvasId}`,
    data
  );
};

export const updateComment = (id: string, data: { content: string }) => {
  return axiosInstance.put<ApiResponse<Comment>>(`/api/comments/${id}`, data);
};

export const deleteComment = (id: string) => {
  return axiosInstance.delete<ApiResponse<void>>(`/api/comments/${id}`);
};

export const addReply = (id: string, content: string) => {
  return axiosInstance.post<ApiResponse<Comment>>(
    `/api/comments/${id}/replies`,
    { content }
  );
};

export const deleteReply = (id: string, replyId: string) => {
  return axiosInstance.delete<ApiResponse<void>>(
    `/api/comments/${id}/replies/${replyId}`
  );
};

export const resolveComment = (id: string) => {
  return axiosInstance.put<ApiResponse<Comment>>(`/api/comments/${id}/resolve`);
};

export const addReaction = (id: string, emoji: string) => {
  return axiosInstance.post<ApiResponse<Comment>>(
    `/api/comments/${id}/reactions`,
    { emoji }
  );
};

export const removeReaction = (id: string, emoji: string) => {
  return axiosInstance.delete<ApiResponse<void>>(
    `/api/comments/${id}/reactions/${emoji}`
  );
};

// ==================== USER API ====================
export const searchUsers = (query: string) => {
  return axiosInstance.get<ApiResponse<User[]>>(`/api/users/search?q=${query}`);
};

export const getUser = (id: string) => {
  return axiosInstance.get<ApiResponse<User>>(`/api/users/${id}`);
};

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return axiosInstance.post<ApiResponse<User>>("/api/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ==================== TEMPLATE API ====================
export const getTemplates = (category?: string) => {
  return axiosInstance.get<ApiResponse<any[]>>("/api/templates", {
    params: { category },
  });
};

export const getTemplate = (id: string) => {
  return axiosInstance.get<ApiResponse<any>>(`/api/templates/${id}`);
};

export const useTemplate = (id: string) => {
  return axiosInstance.post<ApiResponse<Project>>(`/api/templates/${id}/use`);
};

export const getTemplatesByCategory = (category: string) => {
  return axiosInstance.get<ApiResponse<any[]>>(
    `/api/templates/category/${category}`
  );
};

// ==================== NOTIFICATION API ====================
export const getNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  return axiosInstance.get<ApiResponse<any[]>>("/api/notifications", {
    params,
  });
};

export const getUnreadCount = () => {
  return axiosInstance.get<ApiResponse<number>>(
    "/api/notifications/unread-count"
  );
};

export const markAsRead = (id: string) => {
  return axiosInstance.put<ApiResponse<void>>(`/api/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return axiosInstance.put<ApiResponse<void>>("/api/notifications/read-all");
};

export const deleteNotification = (id: string) => {
  return axiosInstance.delete<ApiResponse<void>>(`/api/notifications/${id}`);
};
