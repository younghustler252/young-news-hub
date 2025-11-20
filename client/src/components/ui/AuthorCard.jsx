// components/ui/AuthorCard.jsx
import React from "react";
import Avatar from "./Avatar";
import { ROUTE } from "../../routes/route";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useAuth } from "../../context/AuthContext"; // 👈 add this

const AuthorCard = ({ author }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // 👈 get current user here

  const handleProfileClick = () => {
    navigate(ROUTE.userProfile(author.username));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
      <Avatar
        src={author.profileImageUrl}
        alt={author.name}
        size="lg"
        username={author.username}
        userId={author._id}
        currentUserId={currentUser?._id}
        clickable
      />

      <div className="flex-1">
        <h3
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
          onClick={handleProfileClick}
        >
          {author.name}
        </h3>
        <p className="text-sm text-gray-500">@{author.username}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{author.bio}</p>
      </div>

      <FollowButton targetUserId={author._id} />
    </div>
  );
};

export default AuthorCard;
