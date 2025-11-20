import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import Avatar from "./Avatar";

const CommentItem = ({
  comment,
  currentUser,
  isOwner,
  isAdmin,
  onDelete,
  onReply,
  onFlag,
  replyingTo,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const authorId = comment.author?._id || comment.author || null;
  const isCurrentUserAuthor = authorId === currentUser?.id;
  const authorName =
    comment.author?.name ||
    (isCurrentUserAuthor ? currentUser?.name || "You" : "Unknown");

  const isReplyingToThis = replyingTo?._id === comment._id;

  return (
    <div className="flex items-start space-x-2">
      {/* Avatar */}
      <Avatar
        src={comment.author?.profileImageUrl}
        alt={authorName}
        username={comment.author?.username}
        isCurrentUser={isCurrentUserAuthor}
        size="sm"
      />

      <div className="flex-1">
        {/* Name + comment text */}
        <div className="bg-transparent">
          <div className="flex items-center space-x-1">
            <p className="text-[14px] font-semibold text-gray-900">
              {authorName}
            </p>
            <span className="text-xs text-gray-500">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString()
                : "· 1d"}
            </span>
          </div>
          <p
            className={`text-[14px] text-gray-800 mt-0.5 leading-snug ${
              isReplyingToThis ? "bg-blue-50 rounded-md p-1" : ""
            }`}
          >
            {comment.content}
          </p>
        </div>

        {/* Actions row (LinkedIn style) */}
        <div className="flex items-center space-x-3 mt-1 text-[13px] text-gray-600">
          <button
            onClick={() => onReply(comment)}
            className={`hover:text-blue-600 font-medium ${
              isReplyingToThis ? "text-blue-600" : ""
            }`}
          >
            Reply
          </button>

          {(isCurrentUserAuthor || isOwner || isAdmin) && (
            <button
              onClick={() => onDelete(comment._id)}
              className="hover:text-red-600"
            >
              Delete
            </button>
          )}

          {!isCurrentUserAuthor && isAdmin && (
            <button
              onClick={() => onFlag(comment._id)}
              className="hover:text-yellow-600"
            >
              Flag
            </button>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1 ml-8 border-l border-gray-200 pl-3">
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                View {comment.replies.length} more repl
                {comment.replies.length > 1 ? "ies" : "y"}
              </button>
            ) : (
              <>
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    currentUser={currentUser}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onDelete={onDelete}
                    onReply={onReply}
                    onFlag={onFlag}
                    replyingTo={replyingTo}
                  />
                ))}
                {comment.replies.length > 2 && (
                  <button
                    onClick={() => setCollapsed(true)}
                    className="text-xs text-gray-500 hover:text-blue-600"
                  >
                    Hide replies
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Optional dropdown menu (LinkedIn uses ellipsis) */}
      {(isCurrentUserAuthor || isOwner || isAdmin) && (
        <button className="text-gray-400 hover:text-gray-700">
          <FaEllipsisH size={14} />
        </button>
      )}
    </div>
  );
};

export default CommentItem;
