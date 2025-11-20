import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { FullScreenSpinner } from "../components/ui/Loader";
import { usePostById } from "../hooks/usePosts";
import toast from "react-hot-toast";
import PostCard from "../components/ui/PostCard";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: post, isLoading, isError, error } = usePostById(id);

  const handleDeleteSuccess = (postId) => {
    toast.success("Post deleted!");
    queryClient.invalidateQueries(["approvedPosts"]);
    navigate("/");
  };

  if (isLoading) return <FullScreenSpinner />;

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-md shadow text-center">
          Unable to load post.
          <p className="text-sm mt-2 text-gray-600">{error?.message}</p>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Post not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-10 pb-16 px-4 md:px-0">
      <div className="h-auto object-contain">
        <PostCard
          post={post}
          currentUser={user}
          onDeleteSuccess={handleDeleteSuccess}
          fullWidthImage // <-- prop to make image full width
        />
      </div>
    </div>
  );
};

export default PostDetails;
