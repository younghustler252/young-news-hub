// components/profile/PostsTab.jsx
import PostCard from "../ui/PostCard";

const PostsTab = ({ posts, currentUser, onDelete }) => {
  if (!posts?.length) {
    return (
      <p className="text-gray-500 text-center py-10">
        No posts yet. Start sharing your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          onDeleteSuccess={onDelete} // callback to update parent state
        />
      ))}
    </div>
  );
};

export default PostsTab;
