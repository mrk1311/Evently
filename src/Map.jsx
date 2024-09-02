import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ position }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const circleRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            const mapInstance = L.map("map").setView([51.505, -0.09], 13);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapInstance);
            mapRef.current = mapInstance;
        }
    }, []);

    useEffect(() => {
        if (position && mapRef.current) {
            const { lat, lng, accuracy } = position;

            if (markerRef.current) {
                mapRef.current.removeLayer(markerRef.current);
                mapRef.current.removeLayer(circleRef.current);
            }

            markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
            circleRef.current = L.circle([lat, lng], { radius: accuracy }).addTo(mapRef.current);

            mapRef.current.setView([lat, lng]);
        }
    }, [position]);

    return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
};

export default MapComponent;
