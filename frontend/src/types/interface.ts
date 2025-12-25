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
  owner: string | User;
  collaborators: Collaborator[];
  canvas: string | Canvas;
  thumbnail: string;
  isPublic: boolean;
  tags: string[];
  folder: string;
  isFavorite: boolean;
  lastAccessed: Date;
  status?: "active" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaborator {
  user: string | User;
  permission: "view" | "edit" | "admin";
  addedAt: Date;
}

export interface Canvas {
  id: string;
  project: string | Project;
  objects: any[];
  background: string;
  width: number;
  height: number;
  zoom: number;
  version: number;
  history: CanvasHistory[];
  activeUsers: ActiveUser[];
  layers: Layer[];
  gridEnabled?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasHistory {
  objects: any[];
  timestamp: Date;
  user: string | User;
  action: "create" | "update" | "delete" | "move" | "resize";
}

export interface ActiveUser {
  user: string | User;
  socketId: string;
  cursor: { x: number; y: number };
  lastActive: Date;
}

export interface Layer {
  name: string;
  visible: boolean;
  locked: boolean;
  objects: string[];
}

export interface Comment {
  id: string;
  canvas: string | Canvas;
  user: string | User;
  content: string;
  position: { x: number; y: number };
  objectId?: string;
  replies: CommentReply[];
  isResolved: boolean;
  resolvedBy?: string | User;
  resolvedAt?: Date;
  mentions?: string[] | User[];
  reactions?: CommentReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentReply {
  user: string | User;
  content: string;
  createdAt: Date;
}

export interface CommentReaction {
  user: string | User;
  emoji: "👍" | "❤️" | "😊" | "🎉" | "👀";
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category:
    | "flowchart"
    | "uml"
    | "wireframe"
    | "mindmap"
    | "diagram"
    | "architecture"
    | "other";
  thumbnail: string;
  objects: any[];
  isPremium: boolean;
  isPublic: boolean;
  createdBy?: string | User;
  usageCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  recipient: string | User;
  sender?: string | User;
  type: "comment" | "mention" | "share" | "invite" | "update" | "reply";
  message: string;
  relatedProject?: string | Project;
  relatedComment?: string | Comment;
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}
