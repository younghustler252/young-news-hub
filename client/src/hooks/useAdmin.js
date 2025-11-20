import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOverviewStats,
  fetchTopPosts,
  fetchTopAuthors,
  fetchPostsByDate,
  fetchAllUsers,
  fetchUserById,
  toggleUserBan,
  toggleAdminRole,
  fetchAllPosts,
  approvePost,
  rejectPost,
} from "../service/adminService";

/* ===========================
📊 Dashboard Stats Hooks
=========================== */

// Overview stats
export const useOverviewStats = () =>
  useQuery({
    queryKey: ["admin", "overview"],
    queryFn: fetchOverviewStats,
    staleTime: 5 * 60 * 1000,
  });

// Top liked posts
export const useTopPosts = () =>
  useQuery({
    queryKey: ["admin", "top-posts"],
    queryFn: fetchTopPosts,
    staleTime: 10 * 60 * 1000,
  });

// Top authors
export const useTopAuthors = () =>
  useQuery({
    queryKey: ["admin", "top-authors"],
    queryFn: fetchTopAuthors,
    staleTime: 10 * 60 * 1000,
  });

// Posts grouped by date
export const usePostsByDate = (days = 7) =>
  useQuery({
    queryKey: ["admin", "posts-by-date", days],
    queryFn: () => fetchPostsByDate(days),
    staleTime: 5 * 60 * 1000,
  });


/* ===========================
👥 User Management Hooks
=========================== */

// Get all users
export const useAllUsers = (params = {}) =>
  useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchAllUsers(params),
    staleTime: 5 * 60 * 1000,
  });

// Get user by ID
export const useUserById = (userId) =>
  useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });

// Ban / Unban user
export const useToggleUserBan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, action, reason }) =>
      toggleUserBan(userId, action, reason),

    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]);
      queryClient.invalidateQueries(["admin", "overview"]);
    },
  });
};

// Promote or Demote Admin
export const useToggleAdminRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) => toggleAdminRole(userId, role),

    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]);
      queryClient.invalidateQueries(["admin", "overview"]);
    },
  });
};


/* ===========================
📝 Post Management Hooks
=========================== */

// Get all posts
export const useAllPosts = (params = {}) =>
  useQuery({
    queryKey: ["admin", "posts", params],
    queryFn: () => fetchAllPosts(params),
    staleTime: 5 * 60 * 1000,
  });

// Approve post
export const useApprovePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => approvePost(postId),

    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "posts"]);
      queryClient.invalidateQueries(["admin", "overview"]);
      queryClient.invalidateQueries(["admin", "top-posts"]);
    },
  });
};

// Reject post
export const useRejectPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, reason }) => rejectPost(postId, reason),

    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "posts"]);
      queryClient.invalidateQueries(["admin", "overview"]);
    },
  });
};
