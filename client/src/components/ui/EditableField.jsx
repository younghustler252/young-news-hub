import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { Pencil, X, Check } from 'lucide-react'

const EditableField = ({ label, value, onSave, textarea = false }) => {
	const [editing, setEditing] = useState(false)
	const [inputValue, setInputValue] = useState(value || '')

	const handleSave = () => {
		if (inputValue.trim() !== value?.trim()) {
			onSave(inputValue.trim())
		}
		setEditing(false)
	}

	return (
		<div className="w-full space-y-1">
			<label className="block text-sm font-medium text-gray-700">{label}</label>

			{editing ? (
				<div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
					{textarea ? (
						<textarea
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							className="w-full border border-gray-300 rounded px-3 py-2 resize-none text-sm"
							rows={3}
						/>
					) : (
						<Input
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							className="w-full sm:flex-1"
						/>
					)}

					<div className="flex gap-2 sm:mt-0 w-full sm:w-auto">
						<Button
							onClick={handleSave}
							size="sm"
							className="w-full sm:w-auto flex items-center justify-center gap-1"
						>
							<Check size={16} /> Save
						</Button>
						<Button
							onClick={() => setEditing(false)}
							variant="secondary"
							size="sm"
							className="w-full sm:w-auto flex items-center justify-center gap-1"
						>
							<X size={16} /> Cancel
						</Button>
					</div>
				</div>
			) : (
				<div className="flex justify-between items-center border border-gray-200 rounded px-3 py-2 hover:shadow-sm transition">
					<span className="text-gray-800 text-sm truncate w-full pr-3">
						{value || <span className="text-gray-400 italic">Not set</span>}
					</span>
					<button
						onClick={() => setEditing(true)}
						className="p-1 rounded-full hover:bg-gray-100 transition"
						aria-label={`Edit ${label}`}
					>
						<Pencil size={16} className="text-gray-500 hover:text-blue-500" />
					</button>
				</div>
			)}
		</div>
	)
}

export default EditableField
