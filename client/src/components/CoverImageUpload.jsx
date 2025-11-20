import { useState } from 'react';
import { uploadMedia } from '../service/mediaService';

const CoverImageUpload = ({ image, setImage, setError, setMessage }) => {
	const [uploading, setUploading] = useState(false);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setUploading(true);
		setError('');
		setMessage('');

		try {
			const formData = new FormData();
			formData.append('file', file);

			const data = await uploadMedia(formData);

			setImage(data.media?.url);
			console.log("Cover Image URL:", data.media?.url);
			setMessage('Cover image uploaded!');
		} catch (err) {
			setError(err.message || 'Image upload failed');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="w-full">
			{!image ? (
				<label className="block h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
					<input type="file" className="hidden" onChange={handleImageUpload} />
					{uploading ? 'Uploading...' : 'Click to upload cover image'}
				</label>
			) : (
				<div className="relative">
					<img src={image} alt="Cover" className="w-full h-56 object-cover rounded-md" />
					<button
						className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full"
						onClick={() => setImage(null)}
					>
						❌
					</button>
				</div>
			)}
		</div>
	);
};

export default CoverImageUpload;
