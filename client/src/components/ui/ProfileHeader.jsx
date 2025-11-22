// components/ui/ProfileHeader.jsx
import { useRef } from "react";
import Avatar from "./Avatar";

const ProfileHeader = ({
  name,
  username,
  bio,
  avatar,
  isEditable = false,
  onAvatarChange,
  disabled,
}) => {
  const fileInputRef = useRef();

  const openFilePicker = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <header className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
      <div className="relative group">
        <Avatar
          src={avatar}
          alt={name}
          className="md:w-32 md:h-32 w-20 h-20 border rounded-full object-cover"
        />

        {isEditable && (
          <>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onAvatarChange}
              className="hidden"
              disabled={disabled}
            />

            {/* Pen Icon */}
            <button
              type="button"
              onClick={openFilePicker}
              className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow-sm
                         hover:bg-gray-100 group-hover:opacity-100 opacity-0 transition
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={disabled}
              aria-label="Change avatar"
            >
              ✏️
            </button>
          </>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-4xl font-extrabold truncate">{name}</h1>
        <p className="text-green-700 font-medium">@{username}</p>
        {bio && (
          <p className="mt-3 text-gray-700 leading-relaxed break-words">
            {bio}
          </p>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;
