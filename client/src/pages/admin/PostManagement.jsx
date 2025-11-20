import React, { useState, useMemo } from "react";
import {
  useAllPosts,
  useApprovePost,
  useRejectPost,
} from "../../hooks/useAdmin";
import { toast } from "react-hot-toast";
import { FullScreenSpinner } from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import PostCard from "../../components/ui/PostCard";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";

const PostManagement = ({ currentUser }) => {
  const [filter, setFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionType, setActionType] = useState(null); // "approve" | "reject" | "view"
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, isError } = useAllPosts();
  const { mutate: approvePost } = useApprovePost();
  const { mutate: rejectPost } = useRejectPost();

  const posts = data?.posts || [];

  // Filtering posts
  const filteredPosts = useMemo(() => {
    const term = filter.toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(term) ||
        post.author?.name?.toLowerCase().includes(term) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(term));

      return matchesSearch;
    });
  }, [filter, posts]);

  if (isLoading) return <FullScreenSpinner />;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-10">Failed to load posts</div>
    );

  const openActionModal = (post, type) => {
    setSelectedPost(post);
    setActionType(type);
    if (type === "reject") setRejectReason("");
  };

  const handleConfirmAction = () => {
    if (!selectedPost) return;

    if (actionType === "approve") {
      approvePost(selectedPost._id, {
        onSuccess: () => {
          toast.success("Post approved");
          setSelectedPost(null);
          setActionType(null);
        },
        onError: (err) => toast.error(err.message),
      });
    }

    if (actionType === "reject") {
      if (!rejectReason.trim()) {
        toast.error("Please enter a rejection reason.");
        return;
      }

      rejectPost(
        { postId: selectedPost._id, reason: rejectReason },
        {
          onSuccess: () => {
            toast.success("Post rejected");
            setSelectedPost(null);
            setActionType(null);
            setRejectReason("");
          },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Post Management</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute top-3 left-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search posts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-gray-500 text-center py-6">No posts found.</div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-100"
            >
              <div>
                <p className="font-medium text-lg">{post.title}</p>
                <p className="text-sm text-gray-500">
                  By {post.author?.name || "Unknown"}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => openActionModal(post, "view")}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  <Eye size={16} /> View
                </button>

                <span
                  className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1 ${
                    post.status === "approved"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : post.status === "rejected"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  {post.status === "approved" && <CheckCircle size={14} />}
                  {post.status === "rejected" && <XCircle size={14} />}
                  {post.status || "pending"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Actions */}
      <Modal
        isOpen={!!actionType}
        onClose={() => {
          setSelectedPost(null);
          setActionType(null);
        }}
        title={
          actionType === "approve"
            ? "Approve Post"
            : actionType === "reject"
            ? "Reject Post"
            : selectedPost?.title
        }
      >
        {selectedPost && (
          <>
            {actionType === "view" && (
              <PostCard post={selectedPost} currentUser={currentUser} />
            )}

            {(actionType === "approve" || actionType === "reject") && (
              <>
                <PostCard post={selectedPost} currentUser={currentUser} />

                {actionType === "reject" && (
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border rounded-lg p-3 mt-2 h-32 focus:ring focus:ring-red-200"
                    placeholder="Enter reason for rejection..."
                  />
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      setActionType(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmAction}
                    className={`px-4 py-2 rounded-md flex items-center gap-1 ${
                      actionType === "approve"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {actionType === "approve" ? (
                      <>
                        <CheckCircle size={16} /> Approve
                      </>
                    ) : (
                      <>
                        <XCircle size={16} /> Reject
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default PostManagement;
