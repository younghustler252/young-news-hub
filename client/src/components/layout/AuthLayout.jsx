import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Logo from "../../assets/logo.jpg";

const AuthLayout = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("login")) return "Welcome back 👋";
    if (location.pathname.includes("register")) return "Create Your Account";
    if (location.pathname.includes("verify")) return "Verify Your Account";
    if (location.pathname.includes("complete-profile"))
      return "Set Up Your Profile";
    return "Welcome to EveryVoice";
  };

  const title = getTitle();
  const showBackHome = !location.pathname.includes("verify");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={Logo}
            alt="EveryVoice Logo"
            className="h-24 w-auto object-contain" // ← no rounding, no cropping
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          {title}
        </h2>

        {/* Content */}
        <Outlet />

        {/* Back Home */}
        {showBackHome && (
          <p className="text-sm text-center mt-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition hover:underline"
            >
              ← Back to Home
            </Link>
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6 absolute bottom-4 text-center w-full">
        © {new Date().getFullYear()} EveryVoice — All rights reserved.
      </p>
    </div>
  );
};

export default AuthLayout;
