const ToggleSwitch = ({ checked, onChange }) => (
	<label className="inline-flex items-center cursor-pointer">
		<input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
		<div className="w-11 h-6 bg-gray-300 rounded-full shadow-inner dark:bg-gray-600 relative transition">
			<div
				className={`dot absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
					checked ? 'translate-x-full bg-green-500' : ''
				}`}
			/>
		</div>
	</label>
)

export default ToggleSwitch
