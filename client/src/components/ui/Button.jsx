// components/ui/Button.jsx
const Button = ({ children, variant = 'primary', full = false, ...props }) => {
	const base = `px-4 py-2 rounded font-medium focus:outline-none transition ${
		full ? 'w-full' : ''
	}`;
	const variants = {
		primary: 'bg-green-600 text-white hover:bg-green-700',
		secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
		outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
		danger: 'bg-red-600 text-white hover:bg-red-700',
	};

	return (
		<button className={`${base} ${variants[variant]}`} {...props}>
			{children}
		</button>
	);
};

export default Button;
