import { useState, useRef, useEffect } from "react";
import { Heart, HeartOff, MoreHorizontal, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import formatDate from "../../utils/formatDate";
import { useDeletePost } from "../../hooks/usePosts";
import usePostLikes from "../../hooks/usePostLikes";
import usePostComments from "../../hooks/usePostComments";

import Avatar from "./Avatar";
import PostMenu from "./PostMenu";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

const PostCard = ({ post = {}, currentUser, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const {
    liked,
    likesCount,
    handleLikeClick,
    loading: likeLoading,
  } = usePostLikes(post);
  const {
    comments,
    newComment,
    replyingTo,
    setNewComment,
    setReplyingTo,
    handleCommentSubmit,
    handleDeleteComment,
    handleFlagComment,
    flattenComments,
  } = usePostComments(post, currentUser);

  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { mutate: deletePostMutate, isLoading: isDeleting } = useDeletePost();
  const menuRef = useRef();
  const inputContainerRef = useRef();

  const isOwner = [currentUser?._id, currentUser?.id].includes(
    post.author?._id
  );
  const isAdmin = currentUser?.role === "admin";

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to reply input
  useEffect(() => {
    if (replyingTo && inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [replyingTo]);

  const handleDeletePost = () => {
    deletePostMutate(post._id, {
      onSuccess: () => {
        onDeleteSuccess?.(post._id);
        toast.success("Post deleted");
      },
      onError: () => {
        toast.error("Failed to delete post");
      },
    });
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200">
      {/* Header */}
      <header className="flex items-start justify-between p-4 pb-2 relative">
        <div
          className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-md p-1 transition"
          onClick={() => navigate(`/profile/${post.author?._id}`)}
        >
          <Avatar
            src={post.author?.profileImageUrl}
            alt={post.author?.name}
            username={post.author?.username}
            userId={post.author?._id}
            currentUserId={currentUser?.id}
            size="md"
            isOnline={post.author?.isOnline}
          />
          <div className="flex flex-col">
            <h2 className="font-semibold text-gray-900 text-sm hover:text-blue-600 leading-tight">
              {post.author?.name || "Unknown"}
            </h2>
            <p className="text-xs text-gray-500">
              {post.author?.title || "Anonymous Member"}
            </p>
            <time
              dateTime={post.createdAt}
              className="text-xs text-gray-400 mt-0.5"
            >
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>

        {/* Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="text-gray-600 hover:text-gray-800 p-1 rounded-full"
            aria-label="Post options"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 z-20 w-44 bg-white border border-gray-200 rounded-lg shadow-md animate-fadeIn p-1">
              <PostMenu
                isOwner={isOwner}
                isAdmin={isAdmin}
                isDeleting={isDeleting}
                onDeletePost={handleDeletePost}
              />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <section className="px-4 pb-2 text-gray-800">
        {post.title && (
          <h3
            onClick={() => navigate(`/post/${post._id}`)}
            className="font-semibold mb-1 text-[15px] leading-snug text-gray-900 hover:text-blue-600 cursor-pointer transition"
          >
            {post.title}
          </h3>
        )}

        {post.coverImageUrl && (
          <div
            className="mt-2 mb-3 cursor-pointer group relative"
            onClick={() => navigate(`/post/${post._id}`)}
          >
            <img
              src={post.coverImageUrl}
              alt="Post Cover"
              className="w-full h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>
        )}

        <p
          onClick={() => setExpanded(!expanded)}
          className={`text-[14px] leading-relaxed whitespace-pre-line cursor-pointer hover:text-gray-900 transition ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {post.content || ""}
        </p>

        {(post.content?.length ?? 0) > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm font-medium mt-1 hover:underline"
          >
            {expanded ? "Show less" : "…see more"}
          </button>
        )}
      </section>

      {/* Reactions Summary */}
      <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-500 border-t">
        <div className="flex items-center space-x-1">
          {likeLoading ? (
            <HeartOff size={12} className="animate-pulse text-gray-400" />
          ) : liked ? (
            <Heart size={12} className="text-red-500" />
          ) : (
            <HeartOff size={12} />
          )}
          <span>{likesCount}</span>
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:underline"
          aria-expanded={showComments}
        >
          {flattenComments(comments).length} comments
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around text-sm border-t border-gray-200 text-gray-600 font-medium">
        <button
          onClick={handleLikeClick}
          disabled={likeLoading}
          className={`flex items-center justify-center py-2 px-3 w-full rounded-md hover:bg-gray-100 transition ${
            liked ? "text-blue-600 font-semibold" : ""
          }`}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this post" : "Like this post"}
        >
          {liked ? (
            <Heart className="mr-2 text-red-500" size={14} />
          ) : (
            <HeartOff className="mr-2" size={14} />
          )}
          Like
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center py-2 px-3 w-full rounded-md hover:bg-gray-100 transition"
        >
          <MessageCircle className="mr-2" size={14} />
          Comment
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div
          className="px-4 py-3 bg-gray-50 border-t space-y-3"
          ref={inputContainerRef}
        >
          <CommentInput
            currentUser={currentUser}
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleCommentSubmit}
            placeholder={
              replyingTo
                ? `Replying to ${replyingTo.author?.name || "a comment"}...`
                : "Add a comment..."
            }
            onCancelReply={() => setReplyingTo(null)}
          />

          <CommentList
            comments={comments || []}
            currentUser={currentUser}
            isOwner={isOwner}
            isAdmin={isAdmin}
            onDelete={handleDeleteComment}
            onReply={setReplyingTo}
            onFlag={handleFlagComment}
          />
        </div>
      )}
    </article>
  );
};

export default PostCard;
