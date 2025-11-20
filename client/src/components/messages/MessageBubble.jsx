// components/messages/MessageBubble.jsx
import Avatar from "../ui/Avatar";

const MessageBubble = ({ message, currentUser }) => {
  const isOwnMessage = message.sender._id === currentUser._id;

  return (
    <div
      className={`flex items-end ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {/* Show avatar for other user */}
      {!isOwnMessage && (
        <Avatar
          src={message.sender.profileImageUrl}
          alt={message.sender.name}
          size="sm"
          username={message.sender.username}
          userId={message.sender._id}
          currentUserId={currentUser._id}
          className="mr-2"
        />
      )}

      <div
        className={`flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words ${
            isOwnMessage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {/* Text content */}
          {message.content && <p>{message.content}</p>}

          {/* Image content */}
          {message.image && (
            <img
              src={message.image}
              alt="sent media"
              className="mt-2 w-full max-h-64 object-cover rounded-md"
            />
          )}
        </div>

        {/* Timestamp */}
        <span
          className={`text-xs mt-1 ${
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
