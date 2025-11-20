import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  addComment,
  getCommentsByPost,
  deleteComment,
  flagComment,
} from "../service/commentService";

export default function usePostComments(post, currentUser) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const inputContainerRef = useRef();

  // 🧩 Helper: safely build nested comments from flat array
  const nestComments = (flatComments = []) => {
    const map = {};
    const roots = [];

    // Build map with replies array
    flatComments.forEach((c) => {
      if (!c?._id) return; // skip invalid comment
      map[c._id] = { ...c, replies: [] };
    });

    // Build nested structure
    flatComments.forEach((c) => {
      if (!c?._id) return;
      if (c.parentComment) {
        if (map[c.parentComment]) {
          map[c.parentComment].replies.push(map[c._id]);
        } else {
          console.warn(`Parent not found for comment ${c._id}, treating as root`);
          roots.push(map[c._id]); // orphaned reply becomes root
        }
      } else {
        roots.push(map[c._id]);
      }
    });

    return roots;
  };

  // 🧩 Helper: flatten nested comments
  const flattenComments = (nested) => {
    const flat = [];
    const traverse = (list) => {
      for (const c of list || []) {
        flat.push({ ...c, replies: undefined });
        if (c.replies && c.replies.length) traverse(c.replies);
      }
    };
    traverse(nested);
    return flat;
  };

  // 🧩 Fetch comments on mount or when post changes
  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      if (!post?._id) return;

      try {
        const res = await getCommentsByPost(post._id);
        if (isMounted) {
          const nested = nestComments(res.data || []);
          setComments(nested);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
        toast.error("Failed to load comments");
      }
    };

    fetchComments();

    return () => {
      isMounted = false;
    };
  }, [post?._id]);

  // 🧩 Add comment or reply
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    const tempComment = {
      _id: `temp-${Date.now()}`,
      content,
      author: currentUser,
      isTemp: true,
      parentComment: replyingTo?._id || null,
    };

    setNewComment("");
    setReplyingTo(null);

    // Optimistic update: add temp comment
    setComments((prev) => {
      const flat = flattenComments(prev);
      return nestComments([tempComment, ...flat]);
    });

    try {
      const res = await addComment(post._id, content, replyingTo?._id);

      // Replace temp comment with actual comment from server
      setComments((prev) => {
        const flat = flattenComments(prev).map((c) =>
          c._id === tempComment._id ? res.data.data : c
        );
        return nestComments(flat);
      });
    } catch (err) {
      toast.error("Failed to add comment");
      // Remove temp comment if failed
      setComments((prev) => {
        const flat = flattenComments(prev).filter((c) => c._id !== tempComment._id);
        return nestComments(flat);
      });
    }
  };

  // 🧩 Delete a comment
  const handleDeleteComment = async (commentId) => {
    const flat = flattenComments(comments);
    const prevComments = [...flat];

    const updated = prevComments.filter((c) => c._id !== commentId);
    setComments(nestComments(updated));

    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
    } catch {
      setComments(nestComments(prevComments));
      toast.error("Failed to delete comment");
    }
  };

  // 🧩 Flag a comment
  const handleFlagComment = async (commentId) => {
    try {
      await flagComment(commentId);
      toast.success("Comment flagged for review");
    } catch {
      toast.error("Failed to flag comment");
    }
  };

  // 🧩 Scroll to input when replying
  useEffect(() => {
    if (replyingTo && inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [replyingTo]);

  return {
    comments,
    newComment,
    setNewComment,
    replyingTo,
    setReplyingTo,
    handleCommentSubmit,
    handleDeleteComment,
    handleFlagComment,
    inputContainerRef,
    flattenComments,
  };
}
