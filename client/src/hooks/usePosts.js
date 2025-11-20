import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from "@tanstack/react-query";

import {
	createPost,
	getAllApprovedPosts,
	getMyPosts,
	getPostsByUsername,
	getPostById,
	deletePost,
	approvePost,
	rejectPost,
} from '../service/postService';

/*-------------------------------------------------------
📥 Fetch all approved posts (with filters/pagination)
-------------------------------------------------------*/
export const useInfiniteApprovedPosts = ({ tag } = {}) => {
  return useInfiniteQuery({
    queryKey: ["approvedPosts", tag],
    queryFn: ({ pageParam = 1 }) =>
      getAllApprovedPosts({ page: pageParam, tag }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: true,
  });
};


/*-------------------------------------------------------
👤 Fetch posts created by the current user
-------------------------------------------------------*/
export const useMyPosts = (page = 1, limit = 10) => {
	return useQuery({
		queryKey: ['myPosts', page, limit],
		queryFn: () => getMyPosts(page, limit),
		keepPreviousData: true,
	});
};

/*-------------------------------------------------------
👥 Fetch posts by username
-------------------------------------------------------*/
export const usePostsByUsername = (username, page = 1, limit = 10) => {
	return useQuery({
		enabled: !!username, // only runs when username exists
		queryKey: ['userPosts', username, page, limit],
		queryFn: () => getPostsByUsername(username, page, limit),
		keepPreviousData: true,
	});
};

/*-------------------------------------------------------
📄 Fetch a single post by ID
-------------------------------------------------------*/
export const usePostById = (postId) => {
	return useQuery({
		enabled: !!postId,
		queryKey: ['post', postId],
		queryFn: () => getPostById(postId),
	});
};

/*-------------------------------------------------------
🟢 Create a new post
-------------------------------------------------------*/
export const useCreatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (postData) => createPost(postData),
		onSuccess: () => {
			// ✅ Refresh related lists automatically
			queryClient.invalidateQueries(['myPosts']);
			queryClient.invalidateQueries(['approvedPosts']);
		},
	});
};

/*-------------------------------------------------------
❌ Delete a post
-------------------------------------------------------*/
export const useDeletePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (postId) => deletePost(postId),
		onSuccess: () => {
			// Invalidate all lists containing posts
			queryClient.invalidateQueries(['myPosts']);
			queryClient.invalidateQueries(['approvedPosts']);
			queryClient.invalidateQueries(['userPosts']);
		},
	});
};

/*-------------------------------------------------------
✅ Admin Approve / 🚫 Reject post
-------------------------------------------------------*/
export const useAdminActions = () => {
	const queryClient = useQueryClient();

	const approveMutation = useMutation({
		mutationFn: (postId) => approvePost(postId),
		onSuccess: () => {
			queryClient.invalidateQueries(['approvedPosts']);
			queryClient.invalidateQueries(['post']);
		},
	});

	const rejectMutation = useMutation({
		mutationFn: ({ postId, reason }) => rejectPost(postId, reason),
		onSuccess: () => {
			queryClient.invalidateQueries(['approvedPosts']);
			queryClient.invalidateQueries(['post']);
		},
	});

	return {
		handleApprove: approveMutation.mutateAsync,
		handleReject: rejectMutation.mutateAsync,
		loading: approveMutation.isPending || rejectMutation.isPending,
		error: approveMutation.error || rejectMutation.error,
	};
};
