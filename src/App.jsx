import React, { useState, useEffect } from "react";
import MapComponent from "./Map.jsx";
import SearchComponent from "./Search.jsx";

const App = () => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        const watchId = navigator.geolocation.watchPosition(success, error, options);

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const success = (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPosition({ lat: latitude, lng: longitude, accuracy });
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
        <div style={{display: 'flex', width: '100vw', height: '100vh'}}>
            {/* SearchComponent allows the user to search for a location */}
            <SearchComponent onSearch={handleSearch} />
            
            {/* MapComponent displays the map centered on the user's position */}
            <MapComponent position={position} />
        </div>
    );
};

export default App;
