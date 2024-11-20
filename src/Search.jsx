import React, { useState, useRef, useEffect, useMemo } from "react";
import "./Search.css";
import events from "./events.json";
import { parseISO, isValid, isWithinInterval } from "date-fns";

const SearchComponent = ({
    onSearch,
    onOpen,
    onClose,
    filteredEvents,
    setFilteredEvents,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Track search container visibility
    const [pickedFilter, setPickedFilter] = useState(null);
    const uniqueTypes = [...new Set(events.map((event) => event.type))];
    const [selectedTypes, setSelectedTypes] = useState(uniqueTypes);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handlePlaceSearch = () => {
        const query = document.getElementById("location-search").value;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSearchResults(data);
                console.log(searchResults);
            });
    };

    const handleTypeSearch = (e) => {
        handleCloseSearch();
        onClose();

        setFilteredEvents(
            events.filter((event) => selectedTypes.includes(event.type))
        );
    };

    const handleDateSearch = (e) => {
        e.preventDefault();
        handleCloseSearch();
        onClose();

        setFilteredEvents(
            events.filter((event) => {
                const eventDate = parseISO(event.date);
                return isWithinInterval(eventDate, {
                    start: parseISO(startDate),
                    end: parseISO(endDate),
                });
            })
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (pickedFilter === "Type") {
            handleTypeSearch(e);
        } else if (pickedFilter === "Place") {
            handlePlaceSearch(e);
        } else if (pickedFilter === "Date") {
            handleDateSearch(e);
        }
    };

    const openSearch = () => {
        setIsSearchOpen(true);
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
        setPickedFilter(null);
        setSearchQuery("");
    };

    const CloseButton = () => {
        return (
            <button
                id="close-search"
                onClick={() => {
                    handleCloseSearch();
                    onClose();
                    setSearchQuery(""); // Clear search query when closing search

                    // Reset picked filter when closing search
                    // TODO if you want to keep the filter selected, remove this line
                    setPickedFilter(null);

                    // Reset selected types when closing search
                    setSelectedTypes([
                        ...new Set(filteredEvents.map((event) => event.type)),
                    ]);
                }}
            >
                ✖
            </button>
        );
    };

    const Filters = () => {
        const handleClick = (type) => {
            console.log("filter clicked: ", type);
            setPickedFilter(type);

            // TODO make location results not disappear when switching filters. Maybe create Type, Place, and Date components
            setSearchResults([]);
        };

        const FilterButton = ({ type, picked }) => {
            return (
                <button
                    onClick={() => {
                        handleClick(type);
                        openSearch();
                        onOpen();
                    }}
                    className={
                        picked ? "search-filter picked" : "search-filter"
                    }
                >
                    {type}
                </button>
            );
        };

        return (
            <div id="search-filters">
                <FilterButton type={"Type"} picked={pickedFilter === "Type"} />
                <FilterButton
                    type={"Place"}
                    picked={pickedFilter === "Place"}
                />
                <FilterButton type={"Date"} picked={pickedFilter === "Date"} />
            </div>
        );
    };

    const SearchContainer = () => {
        const inputRef = useRef(null);

        // Ensure input stays focused when search is open
        useEffect(() => {
            if (isSearchOpen && inputRef.current) {
                inputRef.current.focus();
            }
        }, [isSearchOpen]);

        if (pickedFilter === "Type") {
            return (
                <>
                    {isSearchOpen && (
                        <div className="search-container">
                            {/* Conditionally render CloseButton */}
                            {isSearchOpen && <CloseButton />}
                            <form id="search-form" onSubmit={handleSearch}>
                                <input
                                    ref={inputRef}
                                    className="search-input"
                                    type="text"
                                    placeholder="Search for type of event"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </form>
                            <button type="submit" form="search-form">
                                Confirm
                            </button>
                        </div>
                    )}
                </>
            );
        } else if (pickedFilter === "Place") {
            return (
                <>
                    {isSearchOpen && (
                        <div className="search-container">
                            {/* Conditionally render CloseButton */}
                            {isSearchOpen && <CloseButton />}
                            <form id="search-form" onSubmit={handleSearch}>
                                <input
                                    ref={inputRef}
                                    className="search-input"
                                    id="location-search"
                                    type="text"
                                    placeholder="Search for location"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </form>
                            <button type="submit" form="search-form">
                                Search
                            </button>
                        </div>
                    )}
                </>
            );
        } else if (pickedFilter === "Date") {
            return (
                <>
                    {isSearchOpen && (
                        <div className="search-container">
                            {/* Conditionally render CloseButton */}
                            {isSearchOpen && <CloseButton />}
                            <form id="search-form" onSubmit={handleSearch}>
                                <label for="start-date">from:</label>
                                <input
                                    ref={inputRef}
                                    id="start-date"
                                    className="search-input"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                                <label for="end-date">to:</label>
                                <input
                                    ref={inputRef}
                                    id="end-date"
                                    className="search-input"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </form>
                            <button type="submit" form="search-form">
                                Search
                            </button>
                        </div>
                    )}
                </>
            );
        }
    };

    const SearchBar = () => {
        return (
            <>
                <div className="search-bar">
                    <SearchContainer />
                    <Filters />
                </div>
            </>
        );
    };

    const TypeComponent = () => {
        const filteredTypes = uniqueTypes.filter((type) =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handleTypeClick = (type) => {
            if (selectedTypes.includes(type)) {
                setSelectedTypes(selectedTypes.filter((t) => t !== type));
            } else {
                setSelectedTypes([...selectedTypes, type]);
            }
        };

        return (
            <>
                {isSearchOpen && (
                    <>
                        <div id="search-results">
                            <h3>Select Event Types</h3>
                            <div id="type-buttons">
                                <button
                                    onClick={() =>
                                        setSelectedTypes(uniqueTypes)
                                    }
                                >
                                    Select All
                                </button>

                                <button onClick={() => setSelectedTypes([])}>
                                    Clear All
                                </button>
                            </div>
                            {filteredTypes.map((type, index) => (
                                <div
                                    className={
                                        selectedTypes.includes(type)
                                            ? "selected search-result"
                                            : "search-result"
                                    }
                                    key={index}
                                    onClick={() => handleTypeClick(type)}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </>
        );
    };

    const DateComponent = () => {};

    const ResultsComponent = ({ searchResults, onSearch }) => {
        if (pickedFilter === "Type") {
            return TypeComponent();
        } else if (pickedFilter === "Place") {
            return (
                <>
                    {isSearchOpen && (
                        <>
                            <div id="search-results">
                                {searchResults.map((result) => (
                                    <div
                                        className="search-result"
                                        key={result.place_id}
                                        onClick={() => {
                                            onSearch(result.lat, result.lon);
                                            handleCloseSearch();
                                        }}
                                    >
                                        {result.display_name}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            );
        } else if (pickedFilter === "Date") {
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
        }
    };

    const handleResultClick = (lat, lon) => {
        onSearch(lat, lon);
        setIsSearchOpen(false); // Close the search after selecting a result
        onClose();
    };

    return (
        <>
            <div id="search-container">
                <SearchBar />
                <ResultsComponent
                    searchResults={searchResults}
                    onSearch={handleResultClick}
                />
            </div>
        </>
    );
};

export default SearchComponent;
