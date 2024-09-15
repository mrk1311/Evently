import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Icon } from "leaflet";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "../node_modules/react-leaflet/lib/index.js";
// import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css";

const MapComponent = ({ position, userPosition }) => {
    // hard coded data for the markers
    const markers = [
        { lat: 51.505, lng: -0.09, name: "Marker 1" }, // London, UK
        { lat: 51.51, lng: -0.1, name: "Marker 2" }, // London, UK
        { lat: 51.515, lng: -0.095, name: "Marker 3" }, // London, UK
        { lat: 53.483959, lng: -2.244644, name: "Marker 4" }, // Manchester, UK
        { lat: 52.486244, lng: -1.890401, name: "Marker 5" }, // Birmingham, UK
        { lat: 55.953251, lng: -3.188267, name: "Marker 6" }, // Edinburgh, UK
        { lat: 54.978252, lng: -1.617439, name: "Marker 7" }, // Newcastle, UK
        { lat: 51.454514, lng: -2.58791, name: "Marker 8" }, // Bristol, UK
        { lat: 52.205338, lng: 0.121817, name: "Marker 9" }, // Cambridge, UK
        { lat: 50.718412, lng: -3.533899, name: "Marker 10" }, // Exeter, UK
        { lat: 53.800755, lng: -1.549077, name: "Marker 11" }, // Leeds, UK
        { lat: 57.149651, lng: -2.099075, name: "Marker 12" }, // Aberdeen, UK
        { lat: 51.5074, lng: -0.1278, name: "Marker 13" }, // Central London, UK
        { lat: 52.629729, lng: 1.297355, name: "Marker 14" }, // Norwich, UK
        { lat: 51.752022, lng: -1.257677, name: "Marker 15" }, // Oxford, UK
        { lat: 53.408371, lng: -2.991573, name: "Marker 16" }, // Liverpool, UK
        { lat: 51.4542645, lng: -0.9781303, name: "Marker 17" }, // Reading, UK
        { lat: 55.864237, lng: -4.251806, name: "Marker 18" }, // Glasgow, UK
        { lat: 50.375456, lng: -4.142656, name: "Marker 19" }, // Plymouth, UK
        { lat: 51.609154, lng: -3.778144, name: "Marker 20" }, // Swansea, UK

        // Poland
        { lat: 52.229676, lng: 21.012229, name: "Marker 21" }, // Warsaw, Poland
        { lat: 50.064651, lng: 19.944981, name: "Marker 22" }, // Kraków, Poland
        { lat: 51.107883, lng: 17.038538, name: "Marker 23" }, // Wrocław, Poland
        { lat: 53.428544, lng: 14.552812, name: "Marker 24" }, // Szczecin, Poland
        { lat: 54.352025, lng: 18.646638, name: "Marker 25" }, // Gdańsk, Poland
        { lat: 50.264892, lng: 19.023781, name: "Marker 26" }, // Katowice, Poland
        { lat: 51.759248, lng: 19.455983, name: "Marker 27" }, // Łódź, Poland
        { lat: 53.01379, lng: 18.598444, name: "Marker 28" }, // Toruń, Poland
        { lat: 50.670017, lng: 17.921297, name: "Marker 29" }, // Opole, Poland
        { lat: 54.518889, lng: 18.530541, name: "Marker 30" }, // Sopot, Poland
        { lat: 52.406374, lng: 16.925168, name: "Marker 31" }, // Poznań, Poland
        { lat: 51.935621, lng: 15.506186, name: "Marker 32" }, // Zielona Góra, Poland
        { lat: 49.969887, lng: 19.828617, name: "Marker 33" }, // Bielsko-Biała, Poland
    ];

    const initialRender = useRef(true);

    const userIcon = new Icon({
        iconUrl: "src/assets/map-pin.png",
        iconSize: [35, 35], // size of the icon
        // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        // popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    function LocateUser() {
        const map = useMap();

        useEffect(() => {
            if (userPosition !== null && initialRender.current) {
                map.setView(userPosition, map.getZoom());
                initialRender.current = false;
                console.log("Initial render");
            }
        }, []);
    }

    // LocationMarker component that displays a marker at the user's position
    function LocationMarker() {
        return userPosition === null ? null : (
            <Marker position={userPosition} icon={userIcon}>
                <Popup>You are here</Popup>
            </Marker>
        );
    }

    // Map component that re-centers the map when the position changes
    function CenterMap() {
        const map = useMap();
        map.setView(position, 13);
    }

    return (
        <MapContainer center={position} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {/* <MarkerClusterGroup chunkedLoading singleMarkerMode>
                {markers.map((marker, index) => (
                    <Marker key={index} position={[marker.lat, marker.lng]}>
                        <Popup>{marker.name}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup> */}
            <LocateUser />
            <CenterMap />
            <LocationMarker />
        </MapContainer>
    );
};

export default MapComponent;
