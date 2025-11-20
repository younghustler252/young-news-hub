import React, { useRef, useEffect, useState } from "react";
import { Send, Image, Paperclip, Smile, X } from "lucide-react";
import Avatar from "./Avatar";

const CommentInput = ({
  currentUser,
  value,
  onChange,
  onSubmit,
  loading,
  placeholder,
  onCancelReply,
}) => {
  const inputRef = useRef();
  const [attachments, setAttachments] = useState([]); // store uploaded files/images

  useEffect(() => {
    inputRef.current?.focus();
  }, [placeholder]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.(e);
      setAttachments([]); // reset attachments after submit
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-xs text-gray-600"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="px-1">{file.name}</span>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          onSubmit(e, attachments);
          setAttachments([]); // clear attachments after submit
        }}
        className="flex items-start space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2"
      >
        <Avatar
          src={currentUser?.avatar || currentUser?.profileImageUrl}
          alt={currentUser?.name}
          username={currentUser?.username}
          isCurrentUser
          size="sm"
          className="mr-2"
        />

        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add a comment..."}
          className="flex-1 text-sm bg-transparent outline-none resize-none max-h-24 overflow-y-auto"
        />

        {onCancelReply && placeholder?.startsWith("Replying to") && (
          <button
            type="button"
            onClick={onCancelReply}
            className="text-gray-400 text-xs hover:underline"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={(!value.trim() && attachments.length === 0) || loading}
          className={`p-2 rounded-full transition-colors ${
            value.trim() || attachments.length > 0
              ? "text-blue-600 hover:bg-blue-50"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Send comment"
        >
          <Send size={18} />
        </button>
      </form>

      {/* Activity Bar */}
      <div className="flex items-center space-x-4 px-3">
        <label className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors text-sm">
          <Image size={16} />
          <span className="hidden sm:inline">Photo</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <label className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors text-sm">
          <Paperclip size={16} />
          <span className="hidden sm:inline">File</span>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors flex items-center space-x-1 text-sm"
        >
          <Smile size={16} /> <span className="hidden sm:inline">Emoji</span>
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
