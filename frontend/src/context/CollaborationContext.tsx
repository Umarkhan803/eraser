import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { getCollaborators, getPendingInvitations } from "../services/api";
import type { User, Notification } from "../types/Interface";

interface CollaborationContextType {
  collaborators: User[];
  activeUsers: User[];
  pendingInvitations: Notification[];
  loading: boolean;
  error: string | null;
  refreshCollaborators: (projectId: string) => Promise<void>;
  refreshInvitations: () => Promise<void>;
}

const CollaborationContext = createContext<
  CollaborationContextType | undefined
>(undefined);

export const CollaborationProvider = ({
  children,
  projectId,
}: {
  children: ReactNode;
  projectId?: string;
}) => {
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Notification[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { socket, on } = useWebSocket({ enabled: !!projectId });

  // Load collaborators
  const refreshCollaborators = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await getCollaborators(projectId);
      if (response.data.success) {
        const data = response.data.data;
        setCollaborators((data.collaborators || []).map((c: any) => c.user));
        setActiveUsers(data.activeUsers || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load collaborators");
    } finally {
      setLoading(false);
    }
  };

  // Load pending invitations
  const refreshInvitations = async () => {
    try {
      setLoading(true);
      const response = await getPendingInvitations();
      if (response.data.success) {
        setPendingInvitations(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  // Setup WebSocket listeners for user presence
  useEffect(() => {
    if (!projectId) return;

    const cleanupUserJoined = on("user-joined", (data: any) => {
      setActiveUsers((prev) => {
        const exists = prev.some((u) => u.id === data.userId);
        if (!exists && data.activeUsers) {
          return data.activeUsers.map((au: any) => au.user);
        }
        return prev;
      });
    });

    const cleanupUserLeft = on("user-left", (data: any) => {
      setActiveUsers((prev) => prev.filter((u) => u.id !== data.userId));
    });

    return () => {
      cleanupUserJoined();
      cleanupUserLeft();
    };
  }, [projectId, on]);

  // Load data on mount
  useEffect(() => {
    if (projectId) {
      refreshCollaborators(projectId);
    }
    refreshInvitations();
  }, [projectId]);

  return (
    <CollaborationContext.Provider
      value={{
        collaborators,
        activeUsers,
        pendingInvitations,
        loading,
        error,
        refreshCollaborators,
        refreshInvitations,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = (): CollaborationContextType => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      "useCollaboration must be used within a CollaborationProvider"
    );
  }
  return context;
};
