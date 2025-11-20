import { useChatList } from "../hooks/useMessages";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MessagesList = () => {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useChatList();

  if (isLoading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats</p>;

  const chats = data?.chats || [];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <div className="space-y-2">
        {chats.map((chat) => (
          <Link
            to={`/messages/${chat.user.username}`}
            key={chat.user.username}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src={chat.user.profileImageUrl || "/default-avatar.png"}
              alt={chat.user.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{chat.user.name}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-gray-500 truncate">{chat.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessagesList;
