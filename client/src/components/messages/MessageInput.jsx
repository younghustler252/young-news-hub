// components/messages/MessageInput.jsx
import { useState, useRef } from "react";
import { Send, Image, X } from "lucide-react";
import { useUploadMedia } from "../../hooks/useMedia";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const uploadMediaMutation = useUploadMedia();

  const handleSend = async () => {
    if (!message.trim() && !selectedImage) return;

    let imageUrl = null;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);

      try {
        const res = await uploadMediaMutation.mutateAsync(formData);
        imageUrl = res?.url || null; // Adjust based on your API response
      } catch (err) {
        console.error("Failed to upload media", err);
      }
    }

    // Send text + image
    // Send text + image
    onSendMessage({ content: message, image: imageUrl });

    setMessage("");
    setSelectedImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
  };

  const removeSelectedImage = () => setSelectedImage(null);

  return (
    <div className="flex flex-col gap-2 bg-white p-2 rounded-md border border-gray-200 shadow-sm">
      {/* Image Preview */}
      {selectedImage && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-300">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={removeSelectedImage}
            className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-gray-100"
            title="Remove image"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Upload image"
        >
          <Image className="w-5 h-5 text-gray-500" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none border border-gray-200 rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="Type a message..."
          rows={1}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center"
          title="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
