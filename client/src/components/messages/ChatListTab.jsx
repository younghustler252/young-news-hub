// components/messages/ChatListTab.jsx
import { useNavigate } from "react-router-dom";
import { useChatList } from "../../hooks/useMessages";
import { FullScreenSpinner } from "../ui/Loader";
import { ROUTE } from "../../routes/route";

const ChatListTab = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useChatList();

  if (isLoading) return <FullScreenSpinner />;
  if (isError)
    return <p className="text-center text-gray-500">Failed to load chats</p>;

  const chats = data?.chats || [];

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No conversations yet.
          </p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => navigate(ROUTE.message(chat.user.username))}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            >
              <img
                src={chat.user.avatar || "/default-avatar.png"}
                alt={chat.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{chat.user.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage?.content}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListTab;
