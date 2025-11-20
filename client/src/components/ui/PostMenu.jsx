import { FaTrashAlt, FaFlag } from "react-icons/fa";
import ConfirmButton from "../ui/ConfirmButton";

const PostMenu = ({ isOwner, isAdmin, isDeleting, onDeletePost }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md w-40">
      {isOwner || isAdmin ? (
        <ConfirmButton
          title="Delete this post?"
          message="Are you sure you want to permanently delete this post? This action cannot be undone."
          confirmText="Delete"
          danger
          onConfirm={onDeletePost}
          className="block w-full text-left text-sm text-red-600 px-4 py-2 hover:bg-gray-100 rounded"
        >
          {isDeleting ? (
            "Deleting..."
          ) : (
            <span className="flex items-center gap-2">
              <FaTrashAlt /> Delete Post
            </span>
          )}
        </ConfirmButton>
      ) : (
        <button
          onClick={() => alert("Report functionality coming soon!")}
          className="block w-full text-left text-sm text-gray-700 px-4 py-2 hover:bg-gray-100 rounded"
        >
          <span className="flex items-center gap-2">
            <FaFlag /> Report Post
          </span>
        </button>
      )}
    </div>
  );
};

export default PostMenu;
