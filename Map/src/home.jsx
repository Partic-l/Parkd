import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

import markerIconUrl from "../node_modules/leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "../node_modules/leaflet/dist/images/marker-shadow.png";


function MoveAttribution() {
    const map = useMap();
    useEffect(() => {
        map.attributionControl.setPosition('topright');
    }, [map]);
    return null;
}

function LocationMarker() {
    const [position, setPosition] = useState(null)
    let map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    useEffect(() => {
        map.locate()
    }, []);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}


export default function Home() {
    L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
    L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
    L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
    L.Icon.Default.imagePath = "";
    return (
        <MapContainer
            center={{ lat: 51.505, lng: -0.09 }}
            zoom={13}
            scrollWheelZoom={false}>
            attributionControl={true}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            <MoveAttribution />
        </MapContainer>
    )
}


// export default function Home() {
//     return (
//         <h1>
//             Home
//         </h1>
//     )
// }