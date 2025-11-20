// pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUserCog } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { useUserByUsername, useToggleFollow } from "../hooks/useUser";
import { getPostsByUsername } from "../service/postService";
import { FullScreenSpinner } from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import ProfileHeader from "../components/ui/ProfileHeader";
import UserStats from "../components/ui/UserStats";
import PostCard from "../components/ui/PostCard";
import Tabs from "../components/ui/Tabs";
import { ROUTE } from "../routes/route";

// Tabs for user profile
const tabs = ["Overview", "Posts", "About"];

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { user, loading, error, reload } = useUserByUsername(username);
  const { toggleFollow, loading: followLoading } = useToggleFollow();

  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  // Set following status
  useEffect(() => {
    if (user && currentUser) {
      setIsFollowing(user.followers?.some((f) => f._id === currentUser._id));
    }
  }, [user, currentUser]);

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      if (!username) return;
      setPostsLoading(true);
      try {
        const res = await getPostsByUsername(username);
        setPosts(res.posts || []);
      } catch (err) {
        toast.error(err.message || "Failed to load posts");
      } finally {
        setPostsLoading(false);
      }
    };
    loadPosts();
  }, [username]);

  const handleFollow = async () => {
    if (!currentUser) return toast.error("Login required");
    setIsFollowing((prev) => !prev);
    try {
      await toggleFollow(user._id);
      reload();
    } catch (err) {
      setIsFollowing((prev) => !prev);
      toast.error(err.message || "Follow/unfollow failed");
    }
  };

  const startChat = () => {
    if (!user?._id) return;
    navigate(ROUTE.message(user.username));
  };

  const goToSettings = () => navigate(ROUTE.settings(user._id));
  const goToChangePassword = () => navigate(ROUTE.changePassword);

  if (loading || postsLoading) return <FullScreenSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6">
        <ProfileHeader
          name={user.name}
          username={user.username}
          bio={user.bio}
          avatar={user.avatar}
          isEditable={false}
        />
        <div className="mt-4">
          <UserStats
            postsCount={user.postsCount ?? posts.length}
            followersCount={user.followers?.length ?? 0}
            followingCount={user.following?.length ?? 0}
          />
        </div>

        {/* Action Buttons */}
        {currentUser && currentUser._id !== user._id && (
          <div className="flex flex-wrap gap-3 justify-end mt-4">
            {isFollowing && (
              <button
                onClick={startChat}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <FaEnvelope /> Message
              </button>
            )}
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-4 py-2 rounded-md font-medium transition ${
                isFollowing
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        )}

        {/* Account Settings Buttons */}
        {currentUser && currentUser._id === user._id && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={goToSettings}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              <FaUserCog /> Account Settings
            </button>
            <button
              onClick={goToChangePassword}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              <FaLock /> Change Password
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <section className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-gray-700">{user.bio || "No bio available."}</p>
            </motion.div>
          )}

          {activeTab === "Posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {posts.length === 0 ? (
                <p className="text-gray-500">
                  This user hasn't posted anything yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "About" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-gray-700">
                Followers: {user.followers?.length || 0} <br />
                Following: {user.following?.length || 0}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default UserProfile;
