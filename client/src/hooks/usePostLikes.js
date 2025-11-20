import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostLike, getPostLikeStatus } from "../service/likeService";
import toast from "react-hot-toast";

export default function usePostLikes(post) {
  const queryClient = useQueryClient();

  // Fetch like status
  const { data, isLoading } = useQuery({
    queryKey: ["postLikeStatus", post._id],
    queryFn: () => getPostLikeStatus(post._id),
    enabled: !!post._id, // only fetch if post._id exists
    initialData: { liked: post.likedByCurrentUser ?? false, likesCount: post.likesCount ?? 0 },
  });

  // Mutation for toggling like
  const mutation = useMutation({
    mutationFn: () => togglePostLike(post._id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["postLikeStatus", post._id] });

      const previous = queryClient.getQueryData(["postLikeStatus", post._id]);

      queryClient.setQueryData(["postLikeStatus", post._id], (old) => ({
        liked: !old.liked,
        likesCount: old.likesCount + (old.liked ? -1 : 1),
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // revert to previous if error
      queryClient.setQueryData(["postLikeStatus", post._id], context.previous);
      toast.error("Could not update like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikeStatus", post._id] });
    },
  });

  const handleLikeClick = () => {
    mutation.mutate();
  };

  return {
    liked: data?.liked ?? false,
    likesCount: data?.likesCount ?? 0,
    handleLikeClick,
    loading: isLoading || mutation.isLoading,
  };
}
