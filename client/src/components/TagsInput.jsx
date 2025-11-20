const TagsInput = ({ tags, setTags }) => {
	return (
		<input
			type="text"
			placeholder="Enter tags, separated by commas"
			className="w-full border-b py-2 outline-none placeholder:text-gray-400"
			value={tags}
			onChange={(e) => setTags(e.target.value)}
		/>
	);
};

export default TagsInput;
