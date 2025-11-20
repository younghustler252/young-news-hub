import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCreatePost as useCreatePostMutation } from './usePosts'; // reuse base hook

export const useCreatePost = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending, error } = useCreatePostMutation();

  const submitPost = async ({ title, content, tags, coverImage }) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      return false;
    }

    try {
      // Normalize tags: lowercase, trim, remove empty
      const tagsArray = Array.isArray(tags)
        ? tags.map((tag) => tag.replace(/^#/, '').trim().toLowerCase()).filter(Boolean)
        : tags
            ?.split(',')
            .map((tag) => tag.replace(/^#/, '').trim().toLowerCase())
            .filter(Boolean);

      const postData = {
        title,
        content,
        tags: tagsArray,
        coverImageUrl: coverImage, // match backend field
      };

      const data = await createPost(postData);

      toast.success(data?.message || 'Post created successfully!');
      navigate('/'); // redirect after successful post

      return data; // return created post if needed
    } catch (err) {
      toast.error(err.message || 'Failed to create post.');
      return false;
    }
  };

  return {
    submitPost,
    loading: isPending,
    error: error ? error.message : '',
  };
};
