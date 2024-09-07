import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const MapComponent = () => {
    const center = [48.8566, 2.3522];

    // hard coded markers
    const markers = [
        {
            geocode: [48.86, 2.3522],
            popUp: "Hello, I am pop up 1",
        },
        {
            geocode: [48.85, 2.3522],
            popUp: "Hello, I am pop up 2",
        },
        {
            geocode: [48.855, 2.34],
            popUp: "Hello, I am pop up 3",
        },
    ];

    // // custom Icon
    //   const customIcon = new Icon({
    //     iconUrl: ""
    //     iconSize: [25, 41] // 38, 38 ?
    //   });

    function LocationMarker() {
        const [position, setPosition] = useState(null);
        const map = useMap();

        useEffect(() => {
            map.locate().on("locationfound", function (e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
                const radius = e.accuracy;
                const circle = L.circle(e.latlng, radius);
                circle.addTo(map);
            });
        }, [map]);

        return position === null ? null : (
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        );
    }

    return (
        <MapContainer center={center} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            <LocationMarker />
            <MarkerClusterGroup
                chunkedLoading
                // singleMarkerMode
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.geocode} /* icon={customIcon} */
                    >
                        <Popup>
                            <h2> Event </h2>
                            {marker.popUp}
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default MapComponent;
