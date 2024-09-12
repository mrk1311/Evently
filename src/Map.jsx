import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css";

const MapComponent = ({ position, userPosition }) => {
    // hard coded data for the markers
    const markers = [
        { lat: 51.505, lng: -0.09, name: "Marker 1" },
        { lat: 51.51, lng: -0.1, name: "Marker 2" },
        { lat: 51.515, lng: -0.095, name: "Marker 3" },
    ];

    const initialRender = useRef(true);

    function LocateUser() {
        const map = useMap();

        useEffect(() => {
            if (userPosition !== null && initialRender.current) {
                map.flyTo(userPosition, map.getZoom());
                initialRender.current = false;
                console.log("Initial render");
            }
        }, []);
    }

    // LocationMarker component that displays a marker at the user's position
    function LocationMarker() {
        return userPosition === null ? null : (
            <Marker position={userPosition}>
                <Popup>You are here</Popup>
            </Marker>
        );
    }

    // Map component that re-centers the map when the position changes
    function CenterMap() {
        const map = useMap();
        map.flyTo(position, map.getZoom());
    }

    return (
        <MapContainer center={position} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <LocateUser />
            <CenterMap />
            <LocationMarker />
            <MarkerClusterGroup chunkedLoading singleMarkerMode>
                {markers.map((marker, index) => (
                    <Marker key={index} position={[marker.lat, marker.lng]}>
                        <Popup>{marker.name}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default MapComponent;
