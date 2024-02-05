import React from "react";
import { Link } from "react-router-dom";

const SearchResults = ({ results }) => {
  if (!results || !Array.isArray(results)) {
    return <p>No search results available</p>;
  }
  console.log(results);

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((post) => (
          <li key={post.postId}>
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
