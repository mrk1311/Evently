import React, { useState } from "react";
import "./Search.css";

const SearchComponent = ({ onSearch }) => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        const query = document.getElementById("search-input").value;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSearchResults(data);
            });
    };

    const handleResultClick = (lat, lon) => {
        onSearch(lat, lon);
    };

    return (
        <div id="search-container">
            <input
                type="text"
                id="search-input"
                placeholder="Search location"
            />
            <button id="search-button" onClick={handleSearch}>
                Search
            </button>
            <ul id="search-results">
                {searchResults.map((result) => (
                    <li
                        id="search-result"
                        key={result.place_id}
                        onClick={() =>
                            handleResultClick(result.lat, result.lon)
                        }
                    >
                        {result.display_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
