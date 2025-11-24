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
import Modal from "../components/ui/Modal";

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

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fileInputRef = useRef();

  // Fetch profile + posts
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

  // Avatar Update
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

  // Field Update
  const handleFieldUpdate = async (field, value) => {
    try {
      const payload = { [field]: value };
      const updated = await updateProfile(payload);

      setProfile((p) => ({
        ...p,
        [field]: updated[field] ?? value,
      }));

      setSuccess(`${field} updated successfully!`);
    } catch {
      setError(`Failed to update ${field}.`);
    }
  };

  // Preferences
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

  // Post Delete
  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post._id !== id));
    setSuccess("Post deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 flex justify-between items-start">
          <ProfileHeader
            name={profile.name}
            username={profile.username}
            bio={profile.bio}
            avatar={profile.avatar}
            isEditable
            fileInputRef={fileInputRef}
            onAvatarChange={handleAvatarChange}
          />

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* User Stats */}
        <div>
          <UserStats
            postsCount={profile.postsCount || 0}
            followersCount={profile.followers?.length || 0}
            followingCount={profile.following?.length || 0}
          />
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
                  logout={() => setShowLogoutModal(true)}
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

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p className="text-gray-700 mb-4">Are you sure you want to logout?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfile;
