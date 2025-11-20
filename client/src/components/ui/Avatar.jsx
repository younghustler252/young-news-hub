import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../routes/route";

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const Avatar = ({
  src,
  alt = "User",
  size = "md",
  username,
  userId,
  currentUserId,
  clickable = true,
  isOnline = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const sizeClass = sizeMap[size] || sizeMap.md;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!clickable) return;

    // Navigate to "My Profile" if it's the current user
    if (
      currentUserId &&
      userId &&
      userId.toString() === currentUserId.toString()
    ) {
      navigate("/me"); // or ROUTE.myProfile() if ROUTE is a function
      return;
    }

    // Navigate to public user profile if username exists
    if (username) {
      navigate(`/profile/${username}`); // or ROUTE.userProfile(username)
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block ${clickable ? "cursor-pointer" : ""}`}
    >
      <img
        src={
          src ||
          "https://i.pinimg.com/736x/2c/bb/0e/2cbb0ee6c1c55b1041642128c902dadd.jpg"
        }
        alt={alt}
        className={`${sizeClass} rounded-full object-cover border border-gray-200 ${
          clickable ? "hover:opacity-90" : ""
        } ${className}`}
      />

      {isOnline && (
        <span
          className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          title="Online"
        ></span>
      )}
    </div>
  );
};

export default Avatar;
