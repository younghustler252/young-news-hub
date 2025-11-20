// src/pages/MyProfile.jsx
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, updateProfile } from "../service/userService";
import { uploadMedia } from "../service/mediaService";
import { getMyPosts } from "../service/postService";

import { FullScreenSpinner } from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Tabs from "../components/ui/Tabs";
import ProfileHeader from "../components/ui/ProfileHeader";
import UserStats from "../components/ui/UserStats";

import OverviewTab from "../components/profile/OverviewTab";
import PostsTab from "../components/profile/PostsTab";
import EditProfileTab from "../components/profile/EditProfileTab";
import AccountSettingsTab from "../components/profile/AccountSettingsTab";
import PreferencesTab from "../components/profile/PreferencesTab";

const tabs = [
  "Overview",
  "My Posts",
  "Edit Profile",
  "Account Settings",
  "Preferences",
];

const MyProfile = () => {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentUser();
        setProfile(data);
        const postsData = await getMyPosts(1, 10);
        setPosts(postsData.posts || []);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    if (authUser) fetchData();
  }, [authUser]);

  if (authLoading || loading) return <FullScreenSpinner />;
  if (!profile)
    return (
      <div className="text-center mt-10 text-gray-600 font-medium">
        Profile not found.
      </div>
    );

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploaded = await uploadMedia(formData);
      const updated = await updateProfile({
        profileImageUrl: uploaded.media.url,
      });
      setProfile((p) => ({
        ...p,
        avatar: updated.user?.avatar || uploaded.media.url,
      }));
      setSuccess("Avatar updated successfully!");
    } catch {
      setError("Failed to update avatar.");
    }
  };

  const handleFieldUpdate = async (field, value) => {
    try {
      const payload = { [field]: value };
      const updated = await updateProfile(payload);
      setProfile((p) => ({ ...p, [field]: updated[field] ?? value }));
      setSuccess(`${field} updated successfully!`);
    } catch {
      setError(`Failed to update ${field}.`);
    }
  };

  const handleTogglePreference = async (key, value) => {
    try {
      const newPrefs = { ...(profile.preferences || {}), [key]: value };
      const updated = await updateProfile({ preferences: newPrefs });
      setProfile((p) => ({
        ...p,
        preferences: updated.preferences || newPrefs,
      }));
      setSuccess("Preferences updated.");
    } catch {
      setError("Failed to update preferences.");
    }
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post._id !== id));
    setSuccess("Post deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-800">My Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-8 space-y-6">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        {/* Profile Header */}
        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6">
          <ProfileHeader
            name={profile.name}
            username={profile.username}
            bio={profile.bio}
            avatar={profile.avatar}
            isEditable
            fileInputRef={fileInputRef}
            onAvatarChange={handleAvatarChange}
          />
          <div className="mt-4">
            <UserStats
              postsCount={profile.postsCount || 0}
              followersCount={profile.followers?.length || 0}
              followingCount={profile.following?.length || 0}
            />
          </div>
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
                <OverviewTab profile={profile} />
              </motion.div>
            )}

            {activeTab === "My Posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PostsTab
                  posts={posts}
                  currentUser={authUser}
                  onDelete={handleDeletePost}
                />
              </motion.div>
            )}

            {activeTab === "Edit Profile" && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <EditProfileTab
                  profile={profile}
                  onFieldUpdate={handleFieldUpdate}
                />
              </motion.div>
            )}

            {activeTab === "Account Settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AccountSettingsTab
                  profile={profile}
                  onTogglePreference={handleTogglePreference}
                  logout={logout}
                />
              </motion.div>
            )}

            {activeTab === "Preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PreferencesTab
                  preferences={profile.preferences || {}}
                  onTogglePreference={handleTogglePreference}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;
