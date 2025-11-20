// components/ui/Alert.jsx
const Alert = ({ type = 'info', message }) => {
	const styles = {
		success: 'bg-green-100 text-green-800',
		error: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-blue-800',
	};

	return (
		<div className={`p-3 rounded mb-4 ${styles[type]}`}>
			<p>{message}</p>
		</div>
	);
};

export default Alert;
