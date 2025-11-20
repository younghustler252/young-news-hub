// components/ui/Input.jsx
const Input = ({ label, ...props }) => (
	<div className="mb-4">
		{label && <label className="block text-sm mb-1 font-medium">{label}</label>}
		<input
			className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
			{...props}
		/>
	</div>
);

export default Input;
