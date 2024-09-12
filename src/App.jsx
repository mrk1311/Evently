import React, { useState, useEffect } from "react";
import MapComponent from "./Map.jsx";
import SearchComponent from "./Search.jsx";
import "./App.css";

const App = () => {
    // const position = { lat: 51.505, lng: -0.09, accuracy: 0 };

    const [position, setPosition] = useState({
        lat: 0,
        lng: 0,
        accuracy: 0,
    });

    const [userPosition, setUserPosition] = useState(null);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        const watchId = navigator.geolocation.watchPosition(
            success,
            error,
            options
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const success = (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("User position: ", latitude, longitude, accuracy);
        setUserPosition({ lat: latitude, lng: longitude, accuracy });
    };

    const error = (err) => {
        if (err.code === 1) {
            alert("Please allow geolocation access");
        } else {
            console.error("Error retrieving location: ", err);
            alert("Cannot get current location");
        }
    };

    // The onSearch function that gets called when a user selects a search result
    const handleSearch = (lat, lon) => {
        setPosition({ lat, lng: lon, accuracy: 0 });
    };

    return (
        <div id="container">
            {/* SearchComponent allows the user to search for a location */}
            <SearchComponent id="search" onSearch={handleSearch} />

            {/* MapComponent displays the map centered on the user's position */}
            <MapComponent
                id="map"
                position={position}
                userPosition={userPosition}
            />
        </div>
    );
};

export default App;
