import React, { useState, useEffect, useRef, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L, { map } from "leaflet";
import { Icon } from "leaflet";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css";
import "leaflet-easybutton/src/easy-button.css"; // Import EasyButton CSS
import "leaflet-easybutton"; // Import EasyButton JavaScript
import events from "./events.json";

var center = [51.505, -0.09]; // London, UK
var zoom = 14;
var initialRender = true;

// Custom icon for the cluster
const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();

    // Changing the color of the cluster icon based on the number of markers
    // let color = "blue";
    // if (count < 4) {
    //     color = "rgb(75, 197, 69)";
    // } else if (count < 10) {
    //     color = "rgb(232, 149, 88)";
    // } else {
    //     color = "rgb(223, 78, 78)";
    // }

    const iconHtml = `
            <div style="
              background-color: rgb(128, 128, 128);
              width: 30px;
              height: 30px;
              border: 1px solid black;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 15px;
              font-weight: bold;
            ">
              ${count}
            </div>
        `;

    return L.divIcon({
        html: iconHtml,
        popupAnchor: [-5, -15],
        className: "custom-cluster-icon",
        iconSize: L.point(40, 40, true),
    });
};

// Custom icon for the event markers
const createEventMarkerIcon = (eventType) => {
    let color;
    let symbol;

    switch (eventType) {
        case "music":
            color = "rgb(75, 197, 69)"; // green
            symbol = "🎵"; // Musical note
            break;
        case "sport":
            color = "rgb(232, 149, 88)"; // orange
            symbol = "⚽"; // Soccer ball
            break;
        case "conference":
            color = "rgb(102, 153, 255)"; // blue
            symbol = "🎤"; // Microphone
            break;
        case "festival":
            color = "rgb(223, 78, 78)"; // red
            symbol = "🎉"; // Party popper
            break;
        case "art":
            color = "rgb(153, 102, 255)"; // purple
            symbol = "🎨"; // Artist palette
            break;
        case "theatre":
            color = "rgb(255, 204, 102)"; // yellow
            symbol = "🎭"; // Performing arts
            break;
        default:
            color = "rgb(128, 128, 128)"; // grey for unknown types
            symbol = "❓"; // Question mark
            break;
    }

    const iconHtml = `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border: 1px solid black;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 15px;
            font-weight: bold;
          ">
            ${symbol}
          </div>
        `;

    return L.divIcon({
        html: iconHtml,
        className: "custom-event-icon", // You can add additional styles in CSS if needed
        iconSize: [40, 40],
        iconAnchor: [20, 20], // Center the icon correctly
        popupAnchor: [0, -20], // Popup opens above the icon
    });
};

const PopupContent = ({ marker }) => {
    return (
        <div style={{ textAlign: "center" }}>
            <h3>{marker.name}</h3>
            <p>
                <strong>Type:</strong>{" "}
                {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
            </p>
            <p>{marker.description}</p>
            <a
                href={marker.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "blue" }}
            >
                More Info
            </a>
            {marker.photo && (
                <div style={{ marginTop: "10px" }}>
                    <img
                        src={marker.photo}
                        alt={marker.name}
                        style={{ width: "100%", height: "auto" }}
                    />
                </div>
            )}
        </div>
    );
};

const userIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/11216/11216859.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

function LocationMarker({ userPosition }) {
    console.log("LocationMarker", userPosition);
    const map = useMap();

    const displayMarker = useMemo(() => {
        if (userPosition === null) {
            return null;
        } else {
            // Center the map on the user's position only on the initial render
            if (initialRender) {
                map.setView(userPosition, 14);
                initialRender = false;
            }
            return (
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>You are here</Popup>
                </Marker>
            );
        }
    }, [userPosition]);

    return <div>{displayMarker}</div>;
}

function HandleSearch({ position }) {
    const map = useMap();

    const centerMap = useMemo(() => {
        position === null ? null : map.setView(position, 14);
    }, [position]);
}

function MapComponent({ position, userPosition }) {
    const [map, setMap] = useState(null);

    const displayMap = useMemo(() => {
        return (
            <MapContainer
                zoomSnap={0}
                center={center}
                zoom={zoom}
                zoomControl={false}
                ref={setMap}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <HandleSearch position={position} />
                <MarkerClusterGroup
                    chunkedLoading
                    singleMarkerMode={false} // Keep singleMarkerMode as false to handle custom icons
                    showCoverageOnHover={false}
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {events.map((marker, index) => (
                        <Marker
                            key={index}
                            position={[marker.lat, marker.lng]}
                            icon={createEventMarkerIcon(marker.type)}
                        >
                            <Popup>
                                <PopupContent marker={marker} />
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
                <LocationMarker userPosition={userPosition} />
            </MapContainer>
        );
    }, [position, userPosition]);

    return <div>{displayMap}</div>;
}

export default MapComponent;
