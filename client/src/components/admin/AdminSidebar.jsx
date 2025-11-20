import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { ROUTE } from "../../routes/route";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const notificationCount = user?.unreadNotifications || 0;

  const navItems = [
    { to: ROUTE.admin, label: "Dashboard", icon: <FiHome /> },
    { to: ROUTE.adminUsers, label: "Users", icon: <FiUsers /> },
    { to: ROUTE.adminPosts, label: "Posts", icon: <FiFileText /> },
    {
      to: ROUTE.adminNotifications,
      label: "Notifications",
      icon: <FiBell />,
      badge: notificationCount,
    },
    { to: ROUTE.adminSettings, label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex md:flex-col
        `}
      >
        {/* Desktop logo */}
        <div className="hidden md:flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-lg font-bold text-green-600">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Admin avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
