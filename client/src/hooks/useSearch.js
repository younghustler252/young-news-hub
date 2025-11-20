import { useQuery } from '@tanstack/react-query';
import { searchAll, searchSuggest } from '../service/searchService';

/**
 * Hook for full search results
 * @param {string} query - search term
 * @param {number} page - current page number
 * @param {number} limit - results per page
 */
export const useSearchAll = (query, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['searchAll', query, page, limit],
    queryFn: async () => {
      // Log the request parameters for debugging
      console.log('Searching for:', { query, page, limit });

      // Fetch the data
      const data = await searchAll(query, page, limit);
      
      // Log the API response
      console.log('Search API Response:', data);
      
      return data;
    },
    enabled: !!query, // only run if query exists
    keepPreviousData: true, // keeps previous data while fetching new page
    staleTime: 1000 * 60 * 5, // 5 minutes caching
    onError: (error) => {
      console.error('Search error:', error);
    },
    retry: 1, // retry on failure (optional)
  });
};


/**
 * Hook for search suggestions / autocomplete
 * @param {string} query - search term
 * @param {number} limit - number of suggestions
 */
export const useSearchSuggest = (query) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchSuggest(query),
    enabled: !!query, // only fetch if query is not empty
    staleTime: 1000 * 60 * 5, // optional: 5 min caching
  });
};