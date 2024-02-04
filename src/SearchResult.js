import React from "react";
import { Link } from "react-router-dom";

const SearchResults = ({ results }) => {
  // Check if results is undefined or not an array
  if (!results || !Array.isArray(results)) {
    return <p>No search results available</p>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((post) => (
          <li key={post.postId}>
            <Link to={`/post/${post.postId}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
