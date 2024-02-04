// SearchPage.js

import React, { useState } from "react";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResult";
import makeRequest from "./Api";

const SearchPage = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (criteria, query) => {
    makeRequest("POST", `search/${criteria}`, { query })
      .then((response) => {
        setResults(response.posts);
      })
      .catch((error) => {
        console.error("Search error:", error);
      });
  };

  return (
    <div>
      <h1>Search Page</h1>
      <SearchForm onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
};

export default SearchPage;
