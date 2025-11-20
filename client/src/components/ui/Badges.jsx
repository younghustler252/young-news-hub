// components/ui/Badge.jsx
const Badge = ({ text, color = 'blue' }) => {
	const colors = {
		blue: 'bg-blue-100 text-blue-800',
		green: 'bg-green-100 text-green-800',
		red: 'bg-red-100 text-red-800',
		gray: 'bg-gray-100 text-gray-800',
	};

	return (
		<span className={`text-xs px-2 py-1 rounded-full ${colors[color]}`}>
			{text}
		</span>
	);
};

export default Badge;
