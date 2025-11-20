import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tagService from '../service/tagService';

/*-------------------------------------------------------
🟢 Fetch all tags
-------------------------------------------------------*/
export const useTags = (sortBy) => {
    return useQuery({
        queryKey: ['tags', sortBy],
        queryFn: () => tagService.getAllTags(sortBy),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000,
    });
};

/*-------------------------------------------------------
🟢 Fetch a single tag by slug
-------------------------------------------------------*/
export const useTag = (slug) => {
    return useQuery({
        queryKey: ['tag', slug],
        queryFn: () => tagService.getTagBySlug(slug),
        enabled: !!slug, // only fetch if slug exists
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

/*-------------------------------------------------------
🟢 Fetch popular tags
-------------------------------------------------------*/
export const usePopularTags = (limit = 10) => {
  return useQuery({
    queryKey: ['popularTags', limit],
    queryFn: () => tagService.getPopularTags(limit),
    staleTime: 5 * 60 * 1000, // cache 5 minutes
    refetchOnWindowFocus: false,
  });
}; 

/*-------------------------------------------------------
🟢 Create a new tag
-------------------------------------------------------*/
export const useCreateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tagService.createTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['popularTags'] });
        },
    });
};

/*-------------------------------------------------------
🟢 Update a tag
-------------------------------------------------------*/
export const useUpdateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => tagService.updateTag(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['tag', data.slug] });
            queryClient.invalidateQueries({ queryKey: ['popularTags'] });
        },
    });
};

/*-------------------------------------------------------
🟢 Delete a tag
-------------------------------------------------------*/
export const useDeleteTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tagService.deleteTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['popularTags'] });
        },
    });
};
