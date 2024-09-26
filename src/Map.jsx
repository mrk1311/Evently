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
    useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css";
import "leaflet-easybutton/src/easy-button.css"; // Import EasyButton CSS
import "leaflet-easybutton"; // Import EasyButton JavaScript

let mapCenter = [51.505, -0.09]; // London, UK

const MapComponent = ({ position, userPosition }) => {
    let zoom;

    // hard-coded data for the markers
    const markers = [
        {
            lat: 51.505,
            lng: -0.09,
            name: "London Music Festival",
            type: "music",
            description:
                "Join us for a thrilling music festival in the heart of London with top performers!",
            link: "https://londonmusicfestival.com",
            photo: "https://example.com/london-music-festival.jpg",
        },
        {
            lat: 52.486,
            lng: -1.89,
            name: "Birmingham Sports Meet",
            type: "sport",
            description:
                "A gathering of top athletes from across the UK to compete in various sports events.",
            link: "https://birminghamsportsmeet.com",
            photo: "https://example.com/birmingham-sports-meet.jpg",
        },
        {
            lat: 53.7784,
            lng: 20.4801,
            name: "Olsztyn Science Conference",
            type: "conference",
            description:
                "Attend the latest science and technology talks in Olsztyn.",
            link: "https://olsztynscienceconf.com",
            photo: "https://example.com/olsztyn-science-conference.jpg",
        },
        {
            lat: 50.0647,
            lng: 19.945,
            name: "Kraków Art Exhibition",
            type: "art",
            description:
                "Discover beautiful contemporary art pieces from across Europe.",
            link: "https://krakowartexhibition.com",
            photo: "https://example.com/krakow-art-exhibition.jpg",
        },
        {
            lat: 52.2297,
            lng: 21.0122,
            name: "Warsaw Music Festival",
            type: "music",
            description:
                "An unforgettable music experience with famous artists from around the world.",
            link: "https://warsawmusicfestival.com",
            photo: "https://example.com/warsaw-music-festival.jpg",
        },
        {
            lat: 54.352,
            lng: 18.6466,
            name: "Gdańsk Theatre Show",
            type: "theatre",
            description:
                "Watch a riveting theatre performance by local talents in Gdańsk.",
            link: "https://gdansk-theatre-show.com",
            photo: "https://example.com/gdansk-theatre-show.jpg",
        },
        {
            lat: 55.953,
            lng: -3.188,
            name: "Edinburgh Film Festival",
            type: "festival",
            description:
                "Celebrate international cinema with screenings and discussions in Edinburgh.",
            link: "https://edinburghfilmfestival.com",
            photo: "https://example.com/edinburgh-film-festival.jpg",
        },
        {
            lat: 50.341,
            lng: 18.93,
            name: "Bytom Music Show",
            type: "music",
            description: "Live performances by upcoming musicians in Bytom.",
            link: "https://bytommusicshow.com",
            photo: "https://example.com/bytom-music-show.jpg",
        },
        {
            lat: 53.799,
            lng: -1.549,
            name: "Leeds Theatre Performance",
            type: "theatre",
            description:
                "A captivating performance by renowned theatre artists in Leeds.",
            link: "https://leedstheatreperformance.com",
            photo: "https://example.com/leeds-theatre-performance.jpg",
        },
        {
            lat: 53.4285,
            lng: 14.5528,
            name: "Szczecin Festival",
            type: "festival",
            description:
                "A week-long cultural festival celebrating art, food, and music in Szczecin.",
            link: "https://szczecinfestival.com",
            photo: "https://example.com/szczecin-festival.jpg",
        },
        {
            lat: 50.8683,
            lng: 17.4829,
            name: "Nysa Theatre Night",
            type: "theatre",
            description:
                "A one-night-only theatre performance showcasing local talent in Nysa.",
            link: "https://nysatheatrenight.com",
            photo: "https://example.com/nysa-theatre-night.jpg",
        },
        {
            lat: 51.454,
            lng: -2.587,
            name: "Bristol Arts Fair",
            type: "art",
            description:
                "An exhibition of various art pieces by independent artists in the city of Bristol.",
            link: "https://bristolartsfair.com",
            photo: "https://example.com/bristol-arts-fair.jpg",
        },
        {
            lat: 51.759,
            lng: 19.456,
            name: "Łódź Sport Gala",
            type: "sport",
            description:
                "The biggest sports gala in Łódź featuring various games and competitions.",
            link: "https://lodzsportgala.com",
            photo: "https://example.com/lodz-sport-gala.jpg",
        },
        {
            lat: 50.3755,
            lng: -4.1427,
            name: "Plymouth Cultural Fair",
            type: "festival",
            description:
                "Explore the vibrant culture of Plymouth with local music, food, and art.",
            link: "https://plymouthculturalfair.com",
            photo: "https://example.com/plymouth-cultural-fair.jpg",
        },
        {
            lat: 53.1325,
            lng: 23.1688,
            name: "Białystok Science Summit",
            type: "conference",
            description:
                "A science summit bringing together experts from across Poland.",
            link: "https://bialystoksciencesummit.com",
            photo: "https://example.com/bialystok-science-summit.jpg",
        },
        {
            lat: 50.292,
            lng: 19.126,
            name: "Jaworzno Jazz Nights",
            type: "music",
            description:
                "Relax with smooth jazz performances by top artists at the Jaworzno Jazz Nights.",
            link: "https://jaworznojazznights.com",
            photo: "https://example.com/jaworzno-jazz-nights.jpg",
        },
        {
            lat: 51.75,
            lng: 19.45,
            name: "Pabianice Theatre Festival",
            type: "theatre",
            description:
                "A festival of drama and comedy showcasing talented theatre performers.",
            link: "https://pabianicetheatrefestival.com",
            photo: "https://example.com/pabianice-theatre-festival.jpg",
        },
        {
            lat: 54.0935,
            lng: 22.9297,
            name: "Suwałki Sports Marathon",
            type: "sport",
            description:
                "Compete or cheer in the annual Suwałki marathon with runners from all over Europe.",
            link: "https://suwalkisportsmarathon.com",
            photo: "https://example.com/suwalki-sports-marathon.jpg",
        },
        {
            lat: 50.0167,
            lng: 20.983,
            name: "Bochnia Arts Expo",
            type: "art",
            description:
                "View and purchase contemporary art pieces at the Bochnia Arts Expo.",
            link: "https://bochniaartsexpo.com",
            photo: "https://example.com/bochnia-arts-expo.jpg",
        },
        {
            lat: 51.822,
            lng: 14.7035,
            name: "Żary Summer Music Fest",
            type: "music",
            description:
                "Enjoy live performances by upcoming bands at the Żary Summer Music Fest.",
            link: "https://zarymusicfest.com",
            photo: "https://example.com/zary-music-fest.jpg",
        },
        {
            lat: 51.9397,
            lng: 15.5059,
            name: "Zielona Góra Science Expo",
            type: "conference",
            description:
                "A gathering of tech enthusiasts and scientists in Zielona Góra.",
            link: "https://zielonagorascienceexpo.com",
            photo: "https://example.com/zielona-gora-science-expo.jpg",
        },
        {
            lat: 52.4064,
            lng: 16.9252,
            name: "Poznań Art and Wine",
            type: "art",
            description:
                "A mix of art exhibitions and wine tasting in Poznań's historical center.",
            link: "https://poznanartandwine.com",
            photo: "https://example.com/poznan-art-and-wine.jpg",
        },
        {
            lat: 50.0669,
            lng: 19.9456,
            name: "Kraków International Conference",
            type: "conference",
            description:
                "Meet and discuss various international topics in this global conference.",
            link: "https://krakowinternationalconf.com",
            photo: "https://example.com/krakow-international-conf.jpg",
        },
        {
            lat: 52.618,
            lng: 19.279,
            name: "Włocławek Open Air Festival",
            type: "festival",
            description:
                "Celebrate local culture with music, food, and performances in the heart of Włocławek.",
            link: "https://wloclawekopenairfestival.com",
            photo: "https://example.com/wloclawek-open-air-festival.jpg",
        },
        {
            lat: 52.2296,
            lng: 21.0122,
            name: "Warsaw Summer Jazz Nights",
            type: "music",
            description:
                "Relax with smooth jazz under the stars in Warsaw's summer night festival.",
            link: "https://warsawsummerjazznights.com",
            photo: "https://example.com/warsaw-summer-jazz-nights.jpg",
        },
        {
            lat: 51.1079,
            lng: 17.0385,
            name: "Wrocław Science Symposium",
            type: "conference",
            description:
                "A series of scientific talks and discussions on technological advancements.",
            link: "https://wroclawsciencesymposium.com",
            photo: "https://example.com/wroclaw-science-symposium.jpg",
        },
        {
            lat: 51.5074,
            lng: -0.1278,
            name: "London Theatre Week",
            type: "theatre",
            description:
                "A week of captivating performances from London's top theatre companies.",
            link: "https://londontheatreweek.com",
            photo: "https://example.com/london-theatre-week.jpg",
        },
        {
            lat: 53.1235,
            lng: 18.0084,
            name: "Bydgoszcz Science Expo",
            type: "conference",
            description:
                "An exhibition showcasing the latest developments in science and technology.",
            link: "https://bydgoszczscienceexpo.com",
            photo: "https://example.com/bydgoszcz-science-expo.jpg",
        },
        {
            lat: 52.2296,
            lng: 21.0122,
            name: "Warsaw Tech Meetup",
            type: "conference",
            description: "A tech networking event for professionals in Warsaw.",
            link: "https://warsawtechmeetup.com",
            photo: "https://example.com/warsaw-tech-meetup.jpg",
        },
        {
            lat: 51.676,
            lng: 19.379,
            name: "Łódź Theatre Night",
            type: "theatre",
            description:
                "A night of captivating performances by top theatre groups in Łódź.",
            link: "https://lodztheatrenight.com",
            photo: "https://example.com/lodz-theatre-night.jpg",
        },
        {
            lat: 51.1077,
            lng: 13.0384,
            name: "Dresden Art Expo",
            type: "art",
            description:
                "Explore contemporary and classical art from renowned European artists.",
            link: "https://dresdenartexpo.com",
            photo: "https://example.com/dresden-art-expo.jpg",
        },
        {
            lat: 55.6761,
            lng: 12.5683,
            name: "Copenhagen Jazz Festival",
            type: "music",
            description:
                "An internationally acclaimed jazz festival featuring world-class performers.",
            link: "https://copenhagenjazzfestival.com",
            photo: "https://example.com/copenhagen-jazz-festival.jpg",
        },
        {
            lat: 48.2082,
            lng: 16.3738,
            name: "Vienna International Film Festival",
            type: "festival",
            description:
                "Showcasing the best films from around the world in Vienna's historic venues.",
            link: "https://viennafilmfestival.com",
            photo: "https://example.com/vienna-film-festival.jpg",
        },
        {
            lat: 50.9375,
            lng: 6.9603,
            name: "Cologne Carnival",
            type: "festival",
            description:
                "Join the colorful and vibrant street carnival in Cologne with parades and events.",
            link: "https://colognecarnival.com",
            photo: "https://example.com/cologne-carnival.jpg",
        },
        {
            lat: 59.9139,
            lng: 10.7522,
            name: "Oslo Science Fair",
            type: "conference",
            description:
                "A science fair bringing together the brightest minds from around Scandinavia.",
            link: "https://oslosciencefair.com",
            photo: "https://example.com/oslo-science-fair.jpg",
        },
        {
            lat: 41.9028,
            lng: 12.4964,
            name: "Rome Music Fest",
            type: "music",
            description:
                "Experience the soul of Italy through live music in the streets of Rome.",
            link: "https://romemusicfest.com",
            photo: "https://example.com/rome-music-fest.jpg",
        },
        {
            lat: 52.3702,
            lng: 4.8952,
            name: "Amsterdam Art Walk",
            type: "art",
            description:
                "A city-wide art exhibition featuring galleries and street art in Amsterdam.",
            link: "https://amsterdamartwalk.com",
            photo: "https://example.com/amsterdam-art-walk.jpg",
        },
        {
            lat: 60.1695,
            lng: 24.9354,
            name: "Helsinki Theatre Festival",
            type: "theatre",
            description:
                "A week of avant-garde and classic theatre performances in Finland’s capital.",
            link: "https://helsinkitheatrefestival.com",
            photo: "https://example.com/helsinki-theatre-festival.jpg",
        },
        {
            lat: 38.7223,
            lng: -9.1393,
            name: "Lisbon Music in the Park",
            type: "music",
            description:
                "Enjoy live music in Lisbon’s lush parks with local and international bands.",
            link: "https://lisbonmusicinthepark.com",
            photo: "https://example.com/lisbon-music-in-the-park.jpg",
        },
        {
            lat: 37.9838,
            lng: 23.7275,
            name: "Athens History Conference",
            type: "conference",
            description:
                "A conference discussing historical events and archaeology in Athens.",
            link: "https://athenshistoryconference.com",
            photo: "https://example.com/athens-history-conference.jpg",
        },
        {
            lat: 40.4168,
            lng: -3.7038,
            name: "Madrid Open-Air Theatre",
            type: "theatre",
            description:
                "Catch live open-air theatre performances across Madrid's iconic plazas.",
            link: "https://madridopenairtheatre.com",
            photo: "https://example.com/madrid-open-air-theatre.jpg",
        },
        {
            lat: 53.3498,
            lng: -6.2603,
            name: "Dublin Writers' Festival",
            type: "festival",
            description:
                "A celebration of literary works by writers from around the globe in Dublin.",
            link: "https://dublinwritersfestival.com",
            photo: "https://example.com/dublin-writers-festival.jpg",
        },
        {
            lat: 47.4979,
            lng: 19.0402,
            name: "Budapest Science Symposium",
            type: "conference",
            description:
                "Join a discussion on the latest developments in technology and science in Budapest.",
            link: "https://budapestsciencesymposium.com",
            photo: "https://example.com/budapest-science-symposium.jpg",
        },
        {
            lat: 50.0755,
            lng: 14.4378,
            name: "Prague International Art Fair",
            type: "art",
            description:
                "An exhibition of international art in the historical city of Prague.",
            link: "https://pragueartfair.com",
            photo: "https://example.com/prague-international-art-fair.jpg",
        },
        {
            lat: 50.1109,
            lng: 8.6821,
            name: "Frankfurt Music Showcase",
            type: "music",
            description:
                "Discover up-and-coming music artists in Frankfurt’s vibrant music scene.",
            link: "https://frankfurtmusicshowcase.com",
            photo: "https://example.com/frankfurt-music-showcase.jpg",
        },
        {
            lat: 59.437,
            lng: 24.7536,
            name: "Tallinn Design Week",
            type: "festival",
            description:
                "Celebrating creativity in design with exhibitions and workshops in Tallinn.",
            link: "https://tallinndesignweek.com",
            photo: "https://example.com/tallinn-design-week.jpg",
        },
        {
            lat: 45.4642,
            lng: 9.19,
            name: "Milan Fashion Conference",
            type: "conference",
            description:
                "A gathering of the fashion industry’s top minds to discuss trends and innovations.",
            link: "https://milanfashionconference.com",
            photo: "https://example.com/milan-fashion-conference.jpg",
        },
        {
            lat: 50.8467,
            lng: 4.3499,
            name: "Brussels Theatre Nights",
            type: "theatre",
            description:
                "An event showcasing a variety of theatrical performances from across Europe.",
            link: "https://brusselstheatrenights.com",
            photo: "https://example.com/brussels-theatre-nights.jpg",
        },
        {
            lat: 48.8566,
            lng: 2.3522,
            name: "Paris Arts and Culture Fest",
            type: "festival",
            description:
                "A festival celebrating French and global art, culture, and performances.",
            link: "https://parisartsfest.com",
            photo: "https://example.com/paris-arts-fest.jpg",
        },
        {
            lat: 41.3851,
            lng: 2.1734,
            name: "Barcelona Film Showcase",
            type: "festival",
            description:
                "Enjoy an exclusive showcase of Spanish and international films in Barcelona.",
            link: "https://barcelonafilmshowcase.com",
            photo: "https://example.com/barcelona-film-showcase.jpg",
        },
    ];

    const userIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/11216/11216859.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });

    const initialRender = useRef(true);

    function LocateUser() {
        const map = useMap();

        useEffect(() => {
            if (userPosition !== null && initialRender.current) {
                mapCenter = userPosition;
                map.setView(mapCenter, map.getZoom());
                initialRender.current = false;
            }
        }, []);
    }

    function LocationMarker() {
        return userPosition === null ? null : (
            <Marker position={userPosition} icon={userIcon}>
                <Popup>You are here</Popup>
            </Marker>
        );
    }

    const lastSearch = useRef(position);

    function HandeSearch() {
        const map = useMap();

        if (lastSearch.current === position) {
            console.log("Subsequent search");
        } else {
            console.log("Initial search");
            mapCenter = position;
            map.setView(mapCenter, 14);
            lastSearch.current = position;
        }
    }

    // Function to keep the map centered after re-rendering
    function CenterMap() {
        const map = useMapEvents({
            zoomend: () => {
                zoom = map.getZoom();
                console.log("Zoom level: ", zoom);
            },
            drag: () => {
                mapCenter = map.getCenter();
                console.log("Center changed to: ", mapCenter);
            },
        });

        map.setView(mapCenter, zoom);
        console.log("Center set to: ", mapCenter);
    }

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

    const isSearchButtonRendered = useRef(false);

    const SearchButton = () => {
        const map = useMap();

        if (isSearchButtonRendered.current === false) {
            useEffect(() => {
                L.easyButton(
                    '<span class="search-icon">&telrec;</span>',
                    function () {
                        const searchContainer =
                            document.getElementById("search");
                        searchContainer.classList.add("hidden");
                    }
                ).addTo(map);
                isSearchButtonRendered.current = true;
            }, []);
        }
    };

    return (
        <MapContainer center={mapCenter} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <HandeSearch />
            <MarkerClusterGroup
                chunkedLoading
                singleMarkerMode={false} // Keep singleMarkerMode as false to handle custom icons
                showCoverageOnHover={false}
                iconCreateFunction={createClusterCustomIcon}
            >
                {markers.map((marker, index) => (
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
            <LocationMarker />
            <LocateUser />
            <CenterMap />
            <SearchButton />
        </MapContainer>
    );
};

export default MapComponent;
