import React, { useState, useEffect } from "react";
import {
  getComments,
  createComment,
  addReply,
  resolveComment,
} from "../../services/api";
import { MessageSquare, Send, Check } from "lucide-react";
import type { Comment } from "../../types/Interface";

interface CommentThreadProps {
  canvasId: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({ canvasId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [canvasId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await getComments(canvasId);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await createComment(canvasId, {
        content: newComment,
        position: { x: 0, y: 0 }, // In real app, get from click position
      });
      if (response.data.success) {
        setComments([...comments, response.data.data]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      const response = await addReply(commentId, replyText);
      if (response.data.success) {
        loadComments();
        setReplyingTo(null);
        setReplyText("");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleResolve = async (commentId: string) => {
    try {
      const response = await resolveComment(commentId);
      if (response.data.success) {
        loadComments();
      }
    } catch (error) {
      console.error("Failed to resolve comment:", error);
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments
      </h3>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded mb-2 resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500 text-sm">No comments yet</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 border rounded ${
                comment.isResolved ? "bg-gray-50 opacity-75" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {(comment.user as any)?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {(comment.user as any)?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {!comment.isResolved && (
                  <button
                    onClick={() => handleResolve(comment.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Resolve"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                )}
              </div>
              <p className="text-sm mb-2">{comment.content}</p>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {comment.replies.map((reply, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium mb-1">
                        {(reply.user as any)?.name || "Unknown"}
                      </div>
                      <div>{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id ? (
                <div className="mt-2 ml-6">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 border rounded mb-2 resize-none text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
