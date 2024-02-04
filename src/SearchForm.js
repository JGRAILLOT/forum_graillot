// SearchForm.js

import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [criteria, setCriteria] = useState("author");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(criteria, query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select value={criteria} onChange={(e) => setCriteria(e.target.value)}>
        <option value="author">Author</option>
        <option value="content">Content</option>
        <option value="title">Title</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchForm;
