import React from "react";
import { Link } from "react-router-dom";

const ChatHeader = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-t-md">
      <div className="flex items-center">
        <img
          src={user?.profileImageUrl || "/default-avatar.png"}
          alt={user?.name}
          className="w-10 h-10 rounded-full mr-4"
        />
        <span className="font-semibold text-lg">{user?.name}</span>
      </div>
      <Link to="/messages" className="text-gray-400 hover:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>
    </div>
  );
};

export default ChatHeader;
