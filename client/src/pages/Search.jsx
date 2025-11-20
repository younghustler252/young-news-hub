import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchAll } from "../hooks/useSearch";
import AuthorCard from "../components/ui/AuthorCard";
import PostCard from "../components/ui/PostCard";
import { FullScreenSpinner, Spinner } from "../components/ui/Loader";

const Search = ({ currentUser }) => {
  const [searchParams] = useSearchParams();

  // ✅ Read both query and tab from URL
  const query = searchParams.get("q") || "";
  const tabParam = searchParams.get("tab") || "posts";

  // ✅ Initialize activeTab using tabParam
  const [activeTab, setActiveTab] = useState(tabParam);

  const { data, isLoading, isError } = useSearchAll(query);

  const posts = data?.posts?.data || [];
  const authors = data?.authors?.data || [];
  const tags = data?.tags?.data || [];

  // ✅ Update activeTab if URL param changes
  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  // ✅ Scroll to top when query changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  if (!query) {
    return (
      <div className="container mx-auto py-10 text-center text-gray-500">
        Please enter a search term.
      </div>
    );
  }

  if (isLoading) return <FullScreenSpinner />;

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-md shadow text-center">
          Something went wrong while searching.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-6 pb-10">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 px-3 md:px-6 lg:px-0">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block md:w-[250px] bg-white border border-gray-200 rounded-lg shadow-sm h-fit p-6 sticky top-20">
          <div className="flex flex-col items-center text-center">
            <img
              src={data?.user?.profileImageUrl || "/default-avatar.png"}
              alt="User"
              className="w-20 h-20 rounded-full mb-4 object-cover"
            />
            <h2 className="font-semibold text-gray-800">
              {data?.user?.name || "Guest User"}
            </h2>
            <p className="text-sm text-gray-500 mb-6 line-clamp-3">
              {data?.user?.bio || "Welcome to the community!"}
            </p>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              View Profile
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="w-full max-w-2xl mx-auto space-y-6 flex-shrink-0">
          {/* ✅ Tab Navigation */}
          <div className="flex gap-3 mb-6">
            {["posts", "authors", "tags"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-green-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ✅ Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {posts.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
                    No posts found for "{query}".
                  </div>
                ) : (
                  posts.map((post) => (
                    <motion.div
                      key={post._id}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0px 5px 15px rgba(0,0,0,0.08)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <PostCard post={post} currentUser={currentUser} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "authors" && (
              <motion.div
                key="authors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {authors.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
                    No authors found for "{query}".
                  </div>
                ) : (
                  authors.map((author) => (
                    <AuthorCard key={author._id} author={author} />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "tags" && (
              <motion.div
                key="tags"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {tags.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
                    No tags found for "{query}".
                  </div>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        #{tag.name}
                      </span>
                      <p className="text-xs text-gray-500">
                        {tag.postCount} posts
                      </p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && <Spinner />}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block lg:w-[300px] space-y-4 sticky top-20 self-start">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Trending Tags</h3>
            <ul className="text-sm text-green-600 space-y-2">
              {tags.map((tag) => (
                <li key={tag._id} className="cursor-pointer hover:underline">
                  #{tag.name} ({tag.totalPosts})
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Search;
