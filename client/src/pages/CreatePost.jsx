import React, { useState } from "react";
import CoverImageUpload from "../components/CoverImageUpload";
import { useCreatePost } from "../hooks/useCreatePost";
import { useTags } from "../hooks/useTags";

const CreatePost = () => {
  const { submitPost, loading, error } = useCreatePost();
  const { data: tagsData, isLoading: isTagsLoading } = useTags();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const allTags = tagsData || [];

  // Filter tags for autocomplete
  const filteredSuggestions =
    inputValue.trim() === ""
      ? []
      : allTags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTags.includes(tag.name.toLowerCase())
        );

  const handleAddTag = (tagName) => {
    const cleanTag = tagName.replace(/^#/, "").trim().toLowerCase();
    if (!cleanTag || selectedTags.includes(cleanTag)) return;
    setSelectedTags([...selectedTags, cleanTag]);
    setInputValue("");
    setSuggestionsVisible(false);
    setActiveSuggestion(0);
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (["Enter", " ", ","].includes(e.key)) {
      e.preventDefault();
      if (inputValue.trim()) handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length) {
      setSelectedTags(selectedTags.slice(0, -1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter" && filteredSuggestions.length > 0) {
      e.preventDefault();
      handleAddTag(filteredSuggestions[activeSuggestion].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setUploadError("Title and content are required.");
      return;
    }

    try {
      const result = await submitPost({
        title,
        content,
        tags: selectedTags,
        coverImage,
      });

      if (result?.post) {
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setCoverImage("");
        setUploadError("");
        setSuccessMessage("Post submitted successfully!");

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setUploadError("Failed to create post.");
      }
    } catch (err) {
      setUploadError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create a Post</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm"
      >
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          rows={6}
          className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Cover Image */}
        <CoverImageUpload
          image={coverImage}
          setImage={setCoverImage}
          setError={setUploadError}
          setMessage={setSuccessMessage}
        />

        {/* Errors and Success */}
        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        {/* Tags */}
        <div className="relative">
          <div className="flex flex-wrap items-center border border-gray-300 rounded-md px-3 py-2 gap-2 focus-within:ring-1 focus-within:ring-blue-500">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSuggestionsVisible(true);
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setSuggestionsVisible(false), 100)}
              placeholder={selectedTags.length === 0 ? "Add #tags" : ""}
              className="flex-1 outline-none text-sm py-1"
            />
          </div>

          {/* Autocomplete */}
          {suggestionsVisible && filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
              {filteredSuggestions.map((tag, index) => {
                const inputLower = inputValue.toLowerCase();
                const tagLower = tag.name.toLowerCase();
                const startIndex = tagLower.indexOf(inputLower);
                const beforeMatch = tag.name.slice(0, startIndex);
                const matchText = tag.name.slice(
                  startIndex,
                  startIndex + inputValue.length
                );
                const afterMatch = tag.name.slice(
                  startIndex + inputValue.length
                );

                return (
                  <li
                    key={tag._id}
                    onMouseDown={() => handleAddTag(tag.name)}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                      index === activeSuggestion ? "bg-blue-200" : ""
                    }`}
                  >
                    #{beforeMatch}
                    <span className="font-semibold bg-yellow-100">
                      {matchText}
                    </span>
                    {afterMatch}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {isTagsLoading && (
          <p className="text-gray-500 text-sm">Loading tags...</p>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
            loading || !title.trim() || !content.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
