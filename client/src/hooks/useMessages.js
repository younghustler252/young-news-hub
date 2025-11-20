import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as messageService from '../service/messageService';

/**
 * Hook: Get all chat conversations
 */
export const useChatList = () => {
    return useQuery({
        queryKey: ['chatList'],
        queryFn: messageService.getChatList,
        staleTime: 1000 * 60, // 1 min
        refetchOnWindowFocus: false,
    });
};

/**
 * Hook: Get conversation with a specific user
 * @param {string} username
 * @param {number} page
 * @param {number} limit
 */
export const useConversation = (username, page = 1, limit = 50) => {
    return useQuery({
        queryKey: ['conversation', username, page, limit], // include pagination
        queryFn: () => messageService.getConversation(username, page, limit),
        keepPreviousData: true,
        enabled: !!username,
    });
};



/**
 * Hook: Send a message
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ username, content, image }) =>
            messageService.sendMessage(username, content, image),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['conversation', variables.username] });
            queryClient.invalidateQueries({ queryKey: ['chatList'] });
        },
    });
};


/**
 * Hook: Mark a message as read
 */
export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId) => messageService.markAsRead(messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatList'] });
        },
    });
};

/**
 * Hook: Delete a message
 */
export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId) => messageService.deleteMessage(messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatList'] });
        },
    });
};
