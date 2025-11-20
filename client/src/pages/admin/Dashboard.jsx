import React from "react";
import {
  useOverviewStats,
  useTopPosts,
  useTopAuthors,
  usePostsByDate,
} from "../../hooks/useAdmin";
import { FullScreenSpinner } from "../../components/ui/Loader";
import Avatar from "../../components/ui/Avatar";

/* Reusable stat card */
const StatCard = ({ value, label, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition">
    <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const Dashboard = () => {
  const {
    data: overview,
    isLoading: loadingOverview,
    isError: errorOverview,
  } = useOverviewStats();

  const {
    data: topPosts,
    isLoading: loadingTopPosts,
    isError: errorTopPosts,
  } = useTopPosts();

  const {
    data: topAuthors,
    isLoading: loadingTopAuthors,
    isError: errorTopAuthors,
  } = useTopAuthors();

  const {
    data: postsByDate,
    isLoading: loadingPostsByDate,
    isError: errorPostsByDate,
  } = usePostsByDate(7);

  // global loading
  if (loadingOverview) return <FullScreenSpinner />;

  // global errors
  if (errorOverview)
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load dashboard.
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Dashboard Overview
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={overview?.users ?? 0} label="Users" color="green" />
        <StatCard
          value={overview?.posts?.total ?? 0}
          label="Total Posts"
          color="green"
        />
        <StatCard
          value={overview?.posts?.pending ?? 0}
          label="Pending Posts"
          color="yellow"
        />
        <StatCard
          value={overview?.comments?.total ?? 0}
          label="Comments"
          color="blue"
        />
      </div>

      {/* Top Posts */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Top Liked Posts
        </h2>

        {loadingTopPosts ? (
          <p className="text-gray-500">Loading...</p>
        ) : errorTopPosts ? (
          <p className="text-red-500">Failed to load top posts.</p>
        ) : topPosts?.length === 0 ? (
          <p className="text-gray-400">No top posts found.</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <ul className="space-y-2">
              {topPosts?.map((post) => (
                <li
                  key={post._id}
                  className="flex justify-between items-center border-b last:border-b-0 pb-2 hover:bg-gray-50 rounded transition"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={post.author?.profileImageUrl}
                      size="sm"
                      username={post.author?.username}
                      userId={post.author?._id}
                    />
                    <span className="font-medium text-gray-800 line-clamp-1">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{post.likes} ❤️</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Top Authors */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Top Authors
        </h2>

        {loadingTopAuthors ? (
          <p className="text-gray-500">Loading...</p>
        ) : errorTopAuthors ? (
          <p className="text-red-500">Failed to load top authors.</p>
        ) : topAuthors?.length === 0 ? (
          <p className="text-gray-400">No authors found.</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <ul className="space-y-2">
              {topAuthors?.map((author) => (
                <li
                  key={author.authorId}
                  className="flex justify-between items-center border-b last:border-b-0 pb-2 hover:bg-gray-50 rounded transition"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={author.avatar}
                      size="sm"
                      username={author.username}
                      userId={author.authorId}
                    />
                    <span className="font-medium text-gray-800">
                      {author.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {author.postCount} posts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Posts By Date */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Posts in Last 7 Days
        </h2>

        {loadingPostsByDate ? (
          <p className="text-gray-500">Loading...</p>
        ) : errorPostsByDate ? (
          <p className="text-red-500">Failed to load chart data.</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border min-h-[150px] flex items-center justify-center text-gray-400">
            <p>Chart will go here</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
