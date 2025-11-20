import { useState, useEffect } from "react";
import { toggleFollow } from "../../service/userService";
import { useAuth } from "../../context/AuthContext";

const FollowButton = ({ targetUserId }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Check following using flexible matching
  useEffect(() => {
    if (!currentUser?.following) return;

    const followingIds = currentUser.following.map((f) =>
      typeof f === "string" ? f : f._id
    );

    setIsFollowing(followingIds.includes(targetUserId));
  }, [currentUser, targetUserId]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await toggleFollow(targetUserId);
      setIsFollowing((prev) => !prev);
      // optionally update AuthContext here
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?._id === targetUserId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-medium transition ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
