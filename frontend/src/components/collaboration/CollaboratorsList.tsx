import React from "react";
import { useCollaboration } from "../../context/CollaborationContext";
import { User, UserPlus, Crown } from "lucide-react";
import type { User as UserType } from "../../types/Interface";

const CollaboratorsList: React.FC = () => {
  const { collaborators, activeUsers, loading } = useCollaboration();

  if (loading) {
    return <div className="p-4 text-gray-500">Loading collaborators...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Collaborators
      </h3>

      {/* Active Users */}
      {activeUsers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Active Now</h4>
          <div className="space-y-2">
            {activeUsers.map((user: UserType) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 bg-green-50 rounded"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Collaborators */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          All Collaborators
        </h4>
        {collaborators.length === 0 ? (
          <div className="text-sm text-gray-500">No collaborators yet</div>
        ) : (
          <div className="space-y-2">
            {collaborators.map((user: UserType) => {
              const isActive = activeUsers.some((au) => au.id === user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      {user.name}
                      {user.role === "admin" && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsList;
