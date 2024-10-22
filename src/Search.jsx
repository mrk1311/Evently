import React, { useState, useRef, useEffect } from "react";
import "./Search.css";

const SearchComponent = ({ onSearch, onOpen, onClose }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Track search container visibility

    const handleSearch = (e) => {
        e.preventDefault();
        const query = document.getElementById("search-input").value;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSearchResults(data);
                console.log(searchResults);
            });
    };

    const openSearch = () => {
        setIsSearchOpen(true);
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };

    const CloseButton = () => {
        return (
            <button
                id="close-search"
                onClick={() => {
                    handleCloseSearch();
                    onClose();
                }}
            >
                ✖
            </button>
        );
    };

    const SearchBar = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const inputRef = useRef(null);

        // Ensure input stays focused when search is open
        useEffect(() => {
            if (isSearchOpen && inputRef.current) {
                inputRef.current.focus();
            }
        }, [isSearchOpen]);

        return (
            <>
                <div className="search-bar">
                    <div className="search-container">
                        {/* Conditionally render CloseButton */}
                        {isSearchOpen && <CloseButton />}{" "}
                        <form id="search-form" onSubmit={handleSearch}>
                            <input
                                ref={inputRef}
                                id="search-input"
                                type="text"
                                placeholder="Search for location or events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={() => {
                                    openSearch(); // Opens the search (if it has logic in parent component)
                                    onOpen(); // Triggers any additional logic passed as onOpen prop
                                }}
                            />
                        </form>
                        <button type="submit" form="search-form">
                            Search
                        </button>
                    </div>
                    <div id="search-filters">
                        <button>Type</button>
                        <button>Place</button>
                        <button>Time</button>
                    </div>
                </div>
            </>
        );
    };

    const ResultsComponent = ({ searchResults, onSearch }) => {
        return (
            <>
                {isSearchOpen && (
                    <>
                        <div id="search-results">
                            {searchResults.map((result) => (
                                <div
                                    className="search-result"
                                    key={result.place_id}
                                    onClick={() =>
                                        onSearch(result.lat, result.lon)
                                    }
                                >
                                    {result.display_name}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </>
        );
    };

    const handleResultClick = (lat, lon) => {
        onSearch(lat, lon);
        setIsSearchOpen(false); // Close the search after selecting a result
        onClose();
    };

    return (
        <>
            <div id="search-container">
                {/* Search icon button on the map */}
                <SearchBar />
                <ResultsComponent
                    searchResults={searchResults}
                    onSearch={handleResultClick}
                />
                {/* Full-screen search container */}
                {/* {isSearchOpen && (
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
                )} */}
            </div>
        </>
    );
};

export default SearchComponent;
