// components/profile/OverviewTab.jsx
import { Calendar, Mail, User, Users } from "lucide-react";

const OverviewTab = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          About {profile.name?.split(" ")[0] || "User"}
        </h2>
        <p className="mt-1 text-gray-500 text-sm">
          A quick overview of your account details and profile info.
        </p>
      </div>

      {/* Bio Card */}
      <div className="bg-gradient-to-br from-white/80 via-white/70 to-blue-50/60 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Bio</h3>
        <p className="text-gray-700 leading-relaxed">
          {profile.bio ||
            "No bio available yet. You can add one in Edit Profile."}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm">
          <Mail className="text-blue-500" size={18} />
          <div>
            <p className="text-xs uppercase text-gray-500 font-medium">Email</p>
            <p className="text-gray-800 font-medium">{profile.email || "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm">
          <User className="text-blue-500" size={18} />
          <div>
            <p className="text-xs uppercase text-gray-500 font-medium">
              Username
            </p>
            <p className="text-gray-800 font-medium">
              {profile.username || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm">
          <Calendar className="text-blue-500" size={18} />
          <div>
            <p className="text-xs uppercase text-gray-500 font-medium">
              Joined
            </p>
            <p className="text-gray-800 font-medium">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm">
          <Users className="text-blue-500" size={18} />
          <div>
            <p className="text-xs uppercase text-gray-500 font-medium">
              Followers
            </p>
            <p className="text-gray-800 font-medium">
              {profile.followers?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
