// src/components/tag/TagCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const TagCard = ({ tag }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to search page with the tag as query
    navigate(`/search?q=${encodeURIComponent(tag.name)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="inline-block cursor-pointer bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
    >
      #{tag.name}
    </div>
  );
};

export default TagCard;
