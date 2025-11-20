import React from 'react';

// ✅ Fullscreen Loading Spinner
export const FullScreenSpinner = () => (
	<div className="min-h-screen flex items-center justify-center bg-white">
		<div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
	</div>
);

// ✅ Inline Spinner with size and color
export const Spinner = ({ size = 6, color = 'green-600' }) => {
	const pixelSize = `${size * 4}px`; // size * 4 for Tailwind-like scale

	return (
		<div
			className="border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"
			style={{
				width: pixelSize,
				height: pixelSize,
				borderTopColor: `var(--tw-${color})`,
			}}
		/>
	);
};

// ✅ Text-based loader
export const TextLoader = ({ text = 'Loading...' }) => (
	<p className="text-center text-gray-600 text-sm italic">{text}</p>
);

// ✅ Skeleton for a single post item
export const PostSkeleton = () => (
	<div className="animate-pulse space-y-4 border-b pb-4 mb-4">
		<div className="h-4 w-1/4 bg-gray-300 rounded" />
		<div className="h-6 w-3/4 bg-gray-200 rounded" />
		<div className="h-4 w-full bg-gray-200 rounded" />
	</div>
);

// ✅ Skeleton for list of posts
export const PostListSkeleton = ({ count = 5 }) => (
	<div className="px-4">
		{Array.from({ length: count }).map((_, idx) => (
			<PostSkeleton key={idx} />
		))}
	</div>
);

// ✅ Skeleton for detailed post view
export const PostDetailSkeleton = () => (
	<div className="animate-pulse space-y-4 px-4 py-8">
		<div className="h-6 w-1/2 bg-gray-300 rounded" />
		<div className="h-4 w-1/3 bg-gray-200 rounded" />
		<div className="h-64 w-full bg-gray-100 rounded" />
		<div className="space-y-3">
			<div className="h-4 bg-gray-200 rounded w-full" />
			<div className="h-4 bg-gray-200 rounded w-5/6" />
			<div className="h-4 bg-gray-200 rounded w-2/3" />
		</div>
	</div>
);
