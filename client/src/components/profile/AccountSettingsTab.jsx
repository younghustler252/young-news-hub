// components/profile/AccountSettingsTab.jsx
import { LogOut, Trash2, Bell, EyeOff } from "lucide-react";

const AccountSettingsTab = ({ profile, logout, onTogglePreference }) => {
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action is permanent."
      )
    )
      return;

    try {
      await fetch(`/api/users/${profile._id}`, { method: "DELETE" });
      logout();
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>
      <p className="text-gray-500 text-sm">
        Manage your account security, preferences, and data.
      </p>

      {/* Preferences Section */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Preferences</h3>

        {onTogglePreference && (
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences?.emailNotifications || false}
                onChange={(e) =>
                  onTogglePreference("emailNotifications", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-700">Email Notifications</span>
              <Bell className="ml-auto text-gray-400" size={18} />
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences?.privateProfile || false}
                onChange={(e) =>
                  onTogglePreference("privateProfile", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-700">Private Profile</span>
              <EyeOff className="ml-auto text-gray-400" size={18} />
            </label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={logout}
          className="flex items-center gap-2 justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm"
        >
          <LogOut size={18} /> Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 justify-center px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-sm"
        >
          <Trash2 size={18} /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsTab;
