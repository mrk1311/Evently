import React, { useState } from "react";
import "./Search.css";

const SearchComponent = ({ onSearch }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Track search container visibility

    const handleSearch = () => {
        const query = document.getElementById("search-input").value;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSearchResults(data);
            });
        console.log("search successful");
    };

    const handleResultClick = (lat, lon) => {
        onSearch(lat, lon);
        setIsSearchOpen(false); // Close the search after selecting a result
    };

    const handleOpenSearch = () => {
        setIsSearchOpen(true); // Open full-screen search container
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false); // Close full-screen search container
    };

    return (
        <>
            {/* Search icon button on the map */}
            <button id="search-icon" onClick={handleOpenSearch}>
                🔍
            </button>

            {/* Full-screen search container */}
            {isSearchOpen && (
                <div id="search-container">
                    <div id="search-header">
                        <button id="close-search" onClick={handleCloseSearch}>
                            ✖ Close
                        </button>
                    </div>
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
            )}
        </>
    );
};

export default SearchComponent;
