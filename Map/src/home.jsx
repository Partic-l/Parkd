import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router'

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

function VerifyUser() {
    const navigate = useNavigate()
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
            }
        }
        checkUser()
    }, []);
    return null
}

function LocationMarker({ position, setPosition }) {
    // const [position, setPosition] = useState(null)
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
    const [position, setPosition] = useState(null)
    async function handleLeaving() {

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error)
        }
        else {
            const { error } = await supabase.from('spots').insert({
                user_id: user.id,
                latitude: position.lat,
                longitude: position.lng
            })
            if (error) {
                console.log(error)
            }
        }
    }
    L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
    L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
    L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
    L.Icon.Default.imagePath = "";
    return (
        <>
            <VerifyUser />
            <button onClick={handleLeaving}>I'm leaving!</button>
            <MapContainer
                attributionControl={true}
                center={{ lat: 51.505, lng: -0.09 }}
                zoom={13}
                scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
                <MoveAttribution />
            </MapContainer>
        </>
    )
}