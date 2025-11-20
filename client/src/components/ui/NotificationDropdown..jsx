import React, { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    loading,
    error,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error.message || error}</div>;

  return (
    <div className="notification-dropdown">
      <button onClick={toggleDropdown} className="notification-button">
        Notifications{" "}
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {notifications.length === 0 && <div>No notifications</div>}

          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                notification.isRead ? "" : "unread"
              }`}
            >
              <p>{notification.content}</p>
              <div className="actions">
                {!notification.isRead && (
                  <button onClick={() => markAsRead(notification._id)}>
                    Mark as read
                  </button>
                )}
                <button onClick={() => deleteNotification(notification._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {notifications.length > 0 && (
            <div className="dropdown-footer">
              <button onClick={markAllAsRead}>Mark all as read</button>
              <button onClick={deleteAllNotifications}>Delete all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
