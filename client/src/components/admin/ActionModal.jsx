const ActionModal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  onConfirm,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="space-y-3">
      {children}
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">
          Cancel
        </button>
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {confirmText || "Confirm"}
          </button>
        )}
      </div>
    </div>
  </Modal>
);
export default ActionModal;
