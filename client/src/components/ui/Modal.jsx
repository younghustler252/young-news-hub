import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
  // ESC KEY CLOSE
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // PREVENT BODY SCROLL
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center md:items-center items-end animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="
          bg-white rounded-t-xl md:rounded-lg shadow-2xl 
          w-full md:max-w-lg 
          p-4 md:p-6
          transform animate-slideUp md:animate-scaleIn
          max-h-[90vh] md:max-h-[80vh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 break-words">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none px-2"
          >
            &times;
          </button>
        </div>

        {/* CONTENT */}
        <div className="pb-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
