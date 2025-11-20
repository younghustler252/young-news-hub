import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/ui/PostCard";
import { FullScreenSpinner, Spinner } from "../components/ui/Loader";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useInfiniteApprovedPosts } from "../hooks/usePosts";
import { usePopularTags } from "../hooks/useTags";
import { Link } from "react-router-dom"; // Import Link for navigation
import Logo from "../assets/logo.jpg";

const Home = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const queryClient = useQueryClient();

  const [selectedTag, setSelectedTag] = useState("All");

  // Fetch posts (infinite scroll)
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useInfiniteApprovedPosts({
    tag: selectedTag === "All" ? undefined : selectedTag,
  });

  const posts = postsData?.pages.flatMap((page) => page.posts ?? []) || [];

  // Fetch popular tags (limit applied)
  const { data: popularTagsData, isLoading: isTagsLoading } = usePopularTags(5);
  const popularTags = Array.isArray(popularTagsData)
    ? popularTagsData.slice(0, 5)
    : [];

  const handleDeleteSuccess = (postId) => {
    toast.success("Post deleted!");
    queryClient.invalidateQueries([
      "approvedPosts",
      selectedTag === "All" ? undefined : selectedTag,
    ]);
  };

  // Infinite scroll observer
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isPostsLoading) return <FullScreenSpinner />;

  if (isPostsError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-md shadow text-center">
          Unable to load posts. Please try again later.
          <p className="text-sm mt-2 text-gray-600">{postsError?.message}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-6 pb-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-5 px-3 md:px-6 lg:px-0">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block md:w-[250px] bg-white border border-gray-200 rounded-lg shadow-sm h-fit p-4 sticky top-20 self-start">
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User"
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
            <h2 className="font-semibold text-gray-800">
              {user?.name || "Guest User"}
            </h2>
            <p className="text-sm text-gray-500 mb-4 text-center line-clamp-3">
              {user?.bio || "Welcome to the community!"}
            </p>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              View Profile
            </button>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="w-full max-w-2xl mx-auto space-y-5 flex-shrink-0">
          {!user ? (
            // If user is not logged in, show the intro with some preview content
            <>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
                <img
                  src={Logo} // Your logo image
                  alt="EveryVoice Logo"
                  className="mx-auto mb-4 h-20 md:h-28"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to EveryVoice
                </h2>
                <p className="text-gray-600 mb-4">
                  Share your voice, connect with brands, and discover exciting
                  content.
                </p>
                <Link
                  to="/about" // Link to About or Full Landing page
                  className="text-blue-600 font-medium hover:underline"
                >
                  Learn More
                </Link>
              </div>

              {/* Show a preview of posts (limited content) */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Preview Posts
                </h3>
                <div className="space-y-4 mt-4">
                  {posts.slice(0, 3).map((post) => (
                    <PostCard key={post._id} post={post} currentUser={null} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            // If user is logged in, show the full content (posts feed)
            <>
              {posts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
                  No posts found for{" "}
                  <span className="font-semibold text-gray-700">
                    {selectedTag === "All" ? "any tag" : `#${selectedTag}`}
                  </span>
                  .
                </div>
              ) : (
                <AnimatePresence>
                  {posts.map((post, index) => {
                    const isLast = index === posts.length - 1;
                    return (
                      <motion.div
                        key={post._id}
                        ref={isLast ? lastPostRef : null}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PostCard
                          post={post}
                          currentUser={user}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              {isFetchingNextPage && (
                <div className="flex justify-center mt-4">
                  <Spinner />
                </div>
              )}
              {!hasNextPage && posts.length > 0 && (
                <p className="text-center text-gray-400 text-sm mt-4">
                  You’ve reached the end 🎉
                </p>
              )}
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block lg:w-[280px] space-y-4 sticky top-20 self-start">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Trending Tags</h3>

            {isTagsLoading ? (
              <Spinner />
            ) : (
              <ul className="text-sm text-blue-600 space-y-2">
                <li
                  onClick={() => handleTagClick("All")}
                  className={`cursor-pointer hover:underline ${
                    selectedTag === "All" ? "font-semibold text-blue-800" : ""
                  }`}
                >
                  All
                </li>

                {(Array.isArray(popularTagsData)
                  ? popularTagsData.slice(0, 5)
                  : []
                ).map((tag) => (
                  <li
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className={`cursor-pointer hover:underline ${
                      selectedTag === tag.name
                        ? "font-semibold text-blue-800"
                        : ""
                    }`}
                  >
                    #{tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
