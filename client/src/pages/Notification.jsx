import React, { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationsInfinite } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { Spinner, FullScreenSpinner } from "../components/ui/Loader";
import toast from "react-hot-toast";

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notificationsQuery,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationsInfinite();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    notificationsQuery;

  const observer = useRef();
  const lastNotifRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (notificationsQuery.isLoading) return <FullScreenSpinner />;

  if (notificationsQuery.isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-md shadow text-center">
          Unable to load notifications. Please try again later.
          <p className="text-sm mt-2 text-gray-600">
            {notificationsQuery.error.message}
          </p>
        </div>
      </div>
    );

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  const handleClickNotification = (notif) => {
    markAsRead(notif._id);
    switch (notif.type) {
      case "post":
        navigate(`/post/${notif.post._id}`);
        break;
      case "comment":
        navigate(`/post/${notif.post._id}#comment-${notif.comment._id}`);
        break;
      case "message":
        navigate(`/messages/${notif.message._id}`);
        break;
      default:
        console.warn("Unknown notification type");
    }
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    toast.success("Notification deleted");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-6 pb-10">
      <div className="w-full max-w-2xl mx-auto space-y-5 px-3 md:px-6">
        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Notifications{" "}
            <span className="text-sm text-gray-500 font-normal">
              ({unreadCount} unread)
            </span>
          </h1>

          <div className="mt-2 sm:mt-0 space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 transition"
            >
              Mark all as read
            </button>
            <button
              onClick={deleteAllNotifications}
              className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition"
            >
              Delete all
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        {notifications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
            No notifications yet 📭
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif, index) => {
              const isLast = index === notifications.length - 1;
              const sender = notif.sender || {};
              const avatarUrl = sender.profileImageUrl;

              return (
                <motion.div
                  key={notif._id}
                  ref={isLast ? lastNotifRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition duration-200 ${
                    notif.isRead ? "" : "border-blue-300 bg-blue-50"
                  }`}
                >
                  {/* LEFT: Avatar */}
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleClickNotification(notif)}
                  >
                    <img
                      src={avatarUrl}
                      alt={sender.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 hover:scale-105 transition-transform duration-200"
                    />

                    <div className="flex-1">
                      <p className="text-gray-800 text-sm leading-snug">
                        <span className="font-semibold">
                          {sender.name || "Someone"}
                        </span>{" "}
                        {notif.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: Delete */}
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="text-xs text-red-500 hover:text-red-700 ml-3"
                  >
                    Delete
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* INFINITE SCROLL LOADER */}
        {isFetchingNextPage && (
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        )}

        {!hasNextPage && notifications.length > 0 && (
          <p className="text-center text-gray-400 text-sm mt-4">
            You’ve reached the end 🎉
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
