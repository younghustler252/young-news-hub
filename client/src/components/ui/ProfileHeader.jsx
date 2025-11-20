// components/ui/ProfileHeader.jsx
import Avatar from './Avatar';

const ProfileHeader = ({
	name,
	username,
	bio,
	avatar,
	isEditable,
	onAvatarClick,
	fileInputRef,
	onAvatarChange,
	disabled
}) => {
	return (
		<header className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
			<div className="relative">
				<Avatar src={avatar} alt={name} className="md:w-32 md:h-32 w-20 h-20" />
				{isEditable && (
					<>
						<button
							type="button"
							onClick={onAvatarClick}
							className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
							disabled={disabled}
							aria-label="Change avatar"
						>
							✏️
						</button>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							onChange={onAvatarChange}
							className="hidden"
							disabled={disabled}
						/>
					</>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<h1 className="text-4xl font-extrabold truncate">{name}</h1>
				<p className="text-green-700 font-medium">@{username}</p>
				{bio && <p className="mt-3 text-gray-700 leading-relaxed">{bio}</p>}
			</div>
		</header>
	);
};

export default ProfileHeader;
