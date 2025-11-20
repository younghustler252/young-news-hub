// components/ui/UserStats.jsx
const UserStats = ({ postsCount, followersCount, followingCount }) => {
	return (
		<section className="flex space-x-10 border rounded-lg bg-gray-50 p-6 justify-center sm:justify-start text-center sm:text-left text-gray-700 font-semibold">
			<div>
				<span className="block text-2xl text-green-600">{postsCount}</span>
				<span className="text-sm">Posts</span>
			</div>
			<div>
				<span className="block text-2xl text-green-600">{followersCount}</span>
				<span className="text-sm">Followers</span>
			</div>
			<div>
				<span className="block text-2xl text-green-600">{followingCount}</span>
				<span className="text-sm">Following</span>
			</div>
		</section>
	);
};

export default UserStats;
