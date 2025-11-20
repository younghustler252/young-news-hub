import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  deleteAllNotifications 
} from '../service/notificationService';
import { initSocket } from '../api/socketClient';

export const useNotificationsInfinite = (limit = 20) => {
  const queryClient = useQueryClient();

  // ✅ FIXED: useInfiniteQuery now uses object syntax
  const notificationsQuery = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 1 }) => getNotifications(pageParam, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination.page < pagination.pages) return pagination.page + 1;
      return undefined;
    },
  });

  // ✅ FIXED: useQuery now uses object syntax too
  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: getUnreadCount,
  });

  // ------------------ Mutations ------------------
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: ({ notification }) => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            notifications: page.notifications.map(n =>
              n._id === notification._id ? notification : n
            ),
          })),
        };
      });
      queryClient.setQueryData(['notifications', 'unreadCount'], old => (old || 1) - 1);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            notifications: page.notifications.map(n => ({ ...n, isRead: true })),
          })),
        };
      });
      queryClient.setQueryData(['notifications', 'unreadCount'], 0);
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            notifications: page.notifications.filter(n => n._id !== notificationId),
          })),
        };
      });
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            notifications: [],
          })),
        };
      });
    },
  });

  // ------------------ Socket.io ------------------
  useEffect(() => {
    const socket = initSocket();

    const handleNewNotification = (notification) => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData) {
          return {
            pages: [
              {
                notifications: [notification],
                pagination: { total: 1, page: 1, pages: 1 },
              },
            ],
          };
        }

        const firstPage = oldData.pages[0];
        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              notifications: [notification, ...firstPage.notifications],
              pagination: {
                ...firstPage.pagination,
                total: firstPage.pagination.total + 1,
              },
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
      queryClient.setQueryData(['notifications', 'unreadCount'], old => (old || 0) + 1);
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [queryClient]);

  return {
    notificationsQuery,
    unreadCount: unreadCountQuery.data?.count || 0,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    deleteAllNotifications: deleteAllNotificationsMutation.mutate,
  };
};
