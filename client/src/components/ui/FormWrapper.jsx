// components/ui/FormWrapper.jsx
const FormWrapper = ({ title, children, onSubmit }) => (
	<form onSubmit={onSubmit} className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4">
		<h2 className="text-xl font-semibold mb-4">{title}</h2>
		{children}
	</form>
);

export default FormWrapper;
