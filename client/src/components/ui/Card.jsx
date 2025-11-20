// components/ui/Card.jsx
const Card = ({ children, className = '' }) => (
	<div className={`bg-white shadow rounded p-4 ${className}`}>
		{children}
	</div>
);

export default Card;
