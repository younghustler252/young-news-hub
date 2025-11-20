import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useChatList,
  useConversation,
  useSendMessage,
} from "../hooks/useMessages";
import { FullScreenSpinner, Spinner } from "../components/ui/Loader";
import MessageInput from "../components/messages/MessageInput";
import Avatar from "../components/ui/Avatar";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

const Messages = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [page, setPage] = useState(1);
  const [messageSending, setMessageSending] = useState(false);
  const bottomRef = useRef(null);

  const { data: chatListData, isLoading: chatListLoading } = useChatList();
  const {
    data: messages = [],
    isLoading: convoLoading,
    error: convoError,
  } = useConversation(username, page, 50);

  const { mutateAsync: sendMessage } = useSendMessage();

  const chats = chatListData?.chats || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async ({ content, image }) => {
    if ((!content || !content.trim()) && !image) return;

    try {
      setMessageSending(true);
      await sendMessage({
        username,
        content: content || "",
        image: image || null,
      });
    } finally {
      setMessageSending(false);
    }
  };

  if (chatListLoading) return <FullScreenSpinner />;

  const activeChat = chats.find((c) => c.user.username === username);

  const isMobile = window.innerWidth < 768;

  /** -------------------------------------------------
   *  MOBILE BEHAVIOR LOGIC:
   *  - If NO username → show chat list.
   *  - If username → show conversation only.
   --------------------------------------------------*/

  const showChatList = isMobile ? !username : true;
  const showConversation = isMobile ? !!username : true;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-6 pb-10">
      <div className="w-full max-w-4xl flex bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* CHAT LIST */}
        {showChatList && (
          <aside className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 text-lg">Messages</h2>
            </div>

            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No conversations yet
              </div>
            ) : (
              <ul className="overflow-y-auto">
                {chats.map((chat) => (
                  <li
                    key={chat.user.username}
                    onClick={() => navigate(`/messages/${chat.user.username}`)}
                    className={`flex items-center gap-3 p-4 cursor-pointer ${
                      chat.user.username === username
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Avatar
                      src={chat.user.profileImageUrl}
                      size="lg"
                      username={chat.user.username}
                      userId={chat.user._id}
                      currentUserId={currentUser?._id}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800 truncate">
                          {chat.user.name}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        {/* CONVERSATION */}
        {showConversation && (
          <main className="flex-1 flex flex-col">
            {!username ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting 💬
              </div>
            ) : convoLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner />
              </div>
            ) : convoError ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Failed to load conversation.
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white sticky top-0 z-10">
                  {isMobile && (
                    <button
                      className="p-2 -ml-2"
                      onClick={() => navigate("/messages")}
                    >
                      <FiArrowLeft size={24} />
                    </button>
                  )}

                  <Avatar
                    src={activeChat?.user.profileImageUrl}
                    size="md"
                    username={username}
                    userId={activeChat?.user._id}
                    currentUserId={currentUser?._id}
                  />

                  <h2 className="font-semibold text-gray-800">{username}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isCurrentUser =
                        message.sender._id === currentUser._id;
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isCurrentUser && (
                            <Avatar
                              src={message.sender.profileImageUrl}
                              size="sm"
                              username={message.sender.username}
                              userId={message.sender._id}
                              currentUserId={currentUser?._id}
                              className="mr-2"
                            />
                          )}

                          <div
                            className={`px-4 py-2 rounded-lg max-w-xs ${
                              isCurrentUser
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {message.content}
                            {message.image && (
                              <img
                                src={message.image}
                                className="mt-2 rounded-md"
                                alt="sent"
                              />
                            )}
                            <div
                              className={`text-xs mt-1 text-right ${
                                isCurrentUser
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 bg-white p-4">
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    loading={messageSending}
                  />
                </div>
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default Messages;
