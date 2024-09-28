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

    const hideMap = () => {
        document.getElementById("map").style.display = "none";
    };

    const SearchBar = ({ onSearch }) => {
        const [searchQuery, setSearchQuery] = useState("");
        // const [searchResults, setSearchResults] = useState([]);

        const handleSearch = () => {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data); // Save search results to the state
                    if (data.length > 0) {
                        const { lat, lon } = data[0]; // Use the first result
                        onSearch(lat, lon); // Center the map on the first result
                    }
                })
                .catch((err) =>
                    console.error("Error fetching search results:", err)
                );
        };

        return (
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search location or events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={hideMap}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
        );
    };

    const handleResultClick = (lat, lon) => {
        onSearch(lat, lon);
        setIsSearchOpen(false); // Close the search after selecting a result
    };

    return (
        <>
            {/* Search icon button on the map */}
            <SearchBar />

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
