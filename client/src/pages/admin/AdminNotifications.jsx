import React, { useState, useMemo } from "react";
import { useNotificationsInfinite } from "../../hooks/useNotifications";
import { FullScreenSpinner } from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import { Search, Bell, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminNotifications = () => {
  const {
    notificationsQuery,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationsInfinite();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications =
    notificationsQuery.data?.pages.flatMap((p) => p.notifications) || [];

  // 🔍 Search & Filter
  const filteredNotifications = useMemo(() => {
    return notifications.filter(
      (n) =>
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notifications, searchTerm]);

  // Loading & error states
  if (notificationsQuery.isLoading) return <FullScreenSpinner />;
  if (notificationsQuery.isError)
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load notifications
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Bell size={24} /> Notifications
        </h1>
        <div className="flex gap-2 items-center">
          <span className="text-gray-600">Unread: {unreadCount}</span>
          <button
            onClick={() => markAllAsRead()}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Mark All as Read
          </button>
          <button
            onClick={() => deleteAllNotifications()}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search className="absolute top-3 left-3 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            No notifications.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n._id}
              className={`flex justify-between items-center p-4 rounded-lg border hover:shadow cursor-pointer transition ${
                n.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
              }`}
              onClick={() => setSelectedNotification(n)}
            >
              <div className="flex flex-col">
                <p className="font-medium">{n.content}</p>
                <p className="text-sm text-gray-500">
                  From {n.sender?.name || "System"} •{" "}
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n._id);
                      toast.success("Marked as read");
                    }}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1"
                  >
                    <Check size={16} /> Read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n._id);
                    toast.success("Notification deleted");
                  }}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Detail Modal */}
      <Modal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        title="Notification Details"
      >
        {selectedNotification && (
          <div className="space-y-4">
            <p className="font-medium">{selectedNotification.content}</p>
            <p className="text-sm text-gray-500">
              From {selectedNotification.sender?.name || "System"} •{" "}
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-3 mt-4">
              {!selectedNotification.isRead && (
                <button
                  onClick={() => {
                    markAsRead(selectedNotification._id);
                    toast.success("Marked as read");
                    setSelectedNotification(null);
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1"
                >
                  <Check size={16} /> Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  deleteNotification(selectedNotification._id);
                  toast.success("Notification deleted");
                  setSelectedNotification(null);
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminNotifications;
