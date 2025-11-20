// utils/formatDate.js

export default function formatDate(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diff = (now - date) / 1000; // in seconds

	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

	// Else, return formatted date
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}
