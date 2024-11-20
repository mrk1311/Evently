import React, { useState } from "react";
import "./BottomSwipeContainer.css"; // Create this file for styling

const BottomSwipeContainer = ({ events, handleSearch }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleContainer = () => {
        setIsOpen((prevState) => !prevState);
    };

    const handleEventClick = (event) => {
        handleSearch(event.lat, event.lng);
    };

    return (
        <div className={`swipeable-container ${isOpen ? "open" : ""}`}>
            <div className="header" onClick={toggleContainer}>
                <h3>{isOpen ? "Hide Events" : "Show Events"}</h3>
            </div>
            {isOpen && (
                <div className="events-list">
                    {events.map((event, index) => (
                        <div
                            className="event"
                            key={index}
                            onClick={() => handleEventClick(event)}
                        >
                            <h4>{event.name}</h4>
                            <p>{event.description}</p>
                            <p>{event.date}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BottomSwipeContainer;
