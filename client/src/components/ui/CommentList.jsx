import React, { useState } from "react";
import CommentItem from "./CommentItem";

const CommentList = ({
  comments,
  currentUser,
  isOwner,
  isAdmin,
  onDelete,
  onReply,
  onFlag,
}) => {
  const [visibleCount, setVisibleCount] = useState(3);

  if (!comments?.length)
    return <p className="text-gray-500 text-sm ml-14">No comments yet.</p>;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <div className="space-y-2">
      {visibleComments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUser={currentUser}
          isOwner={isOwner}
          isAdmin={isAdmin}
          onDelete={onDelete}
          onReply={onReply}
          onFlag={onFlag}
        />
      ))}

      {visibleCount < comments.length && (
        <button
          onClick={handleLoadMore}
          className="text-gray-600 text-sm font-medium ml-14 hover:text-blue-600 transition"
        >
          View more comments
        </button>
      )}
    </div>
  );
};

export default CommentList;
