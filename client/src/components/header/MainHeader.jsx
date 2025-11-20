import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import { FiBell, FiMessageSquare, FiHome } from "react-icons/fi";
import { ROUTE } from "../../routes/route";
import SearchInput from "../ui/SearchInput";

import logo from "../../assets/logo.jpg";

const MainHeader = () => {
  const { isLoggedIn, user } = useAuth();
  const [query, setQuery] = useState("");

  const handleSuggestionClick = (value, type) => {
    const tab = type.toLowerCase() + "s"; // e.g., "Post" -> "posts"
    window.location.href = `${ROUTE.search}?q=${encodeURIComponent(
      value
    )}&tab=${tab}`;
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-white shadow-sm px-4 md:px-8 py-2 flex items-center justify-between sticky top-0 z-50">
        {/* Logo (updated to image) */}
        <Link to={ROUTE.home} className="whitespace-nowrap">
          <img
            src={logo} // Use the imported logo image here
            alt="Logo"
            className="h-10 md:h-16 " // Set the height of the logo (adjust as needed)
          />
        </Link>

        {/* Search Input */}
        <div className="flex-1 mx-4">
          <SearchInput
            query={query}
            setQuery={setQuery}
            onSelect={handleSuggestionClick}
          />
        </div>

        {/* Desktop-only Nav + Avatar/Login */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <Link
              to={ROUTE.home}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600"
            >
              <FiHome /> Home
            </Link>
            <Link
              to={ROUTE.notifications}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600"
            >
              <FiBell /> Notifications
            </Link>
            <Link
              to={ROUTE.messageList}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600"
            >
              <FiMessageSquare /> Messages
            </Link>
            <Link
              to={ROUTE.createPost}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition text-sm font-medium"
            >
              Create Post
            </Link>
          </nav>

          {isLoggedIn ? (
            <Avatar
              src={user?.avatar}
              size="8"
              userId={user?._id}
              currentUserId={user?._id} // pass current user ID
              clickable={true} // optional, default true
            />
          ) : (
            <Link
              to={ROUTE.login}
              className="text-sm text-gray-700 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-inner flex justify-around items-center py-2 md:hidden z-50">
        <Link
          to={ROUTE.home}
          className="flex flex-col items-center text-gray-600 hover:text-green-600 text-xs"
        >
          <FiHome className="text-xl" />
          Home
        </Link>
        <Link
          to={ROUTE.notifications}
          className="flex flex-col items-center text-gray-600 hover:text-green-600 text-xs"
        >
          <FiBell className="text-xl" />
          Notif
        </Link>
        <Link
          to={ROUTE.createPost}
          className="flex flex-col items-center text-white bg-green-600 px-3 py-1 rounded-full text-xs shadow-md hover:bg-green-700"
        >
          +<span className="text-[10px] mt-0">Post</span>
        </Link>
        <Link
          to={ROUTE.messageList}
          className="flex flex-col items-center text-gray-600 hover:text-green-600 text-xs"
        >
          <FiMessageSquare className="text-xl" />
          Msg
        </Link>
        {isLoggedIn && (
          <Avatar
            src={user?.avatar}
            size="8"
            userId={user?._id}
            currentUserId={user?._id} // pass current user ID
            clickable={true} // optional, default true
          />
        )}
      </div>
    </>
  );
};

export default MainHeader;
