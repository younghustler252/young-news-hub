import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../admin/AdminSidebar";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

const AdminLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h1 className="text-lg font-medium text-gray-800">
              Admin Dashboard
            </h1>
          </div>
          <div className="hidden md:flex items-center justify-between w-full">
            <h1 className="text-lg font-medium text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="Admin avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
