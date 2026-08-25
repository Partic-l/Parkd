import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet'
import { useState, useEffect, useRef, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import './shared.css'
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

function SonarRipple({ position, radius }) {
    const map = useMap()
    const [diameterPx, setDiameterPx] = useState(0)

    function calcDiameter() {
        const centerPt = map.latLngToContainerPoint(L.latLng(position))
        const edgePt = map.latLngToContainerPoint(
            L.latLng(position.lat + radius / 111320, position.lng)
        )
        return Math.round(centerPt.distanceTo(edgePt) * 2)
    }

    useMapEvents({
        zoomend() { setDiameterPx(calcDiameter()) },
    })

    useEffect(() => {
        setDiameterPx(calcDiameter())
    }, [position, radius])

    const icon = useMemo(() => L.divIcon({
        className: '',
        html: `<div class="ripple-wrapper">
            <div class="ripple-ring" style="width:${diameterPx}px;height:${diameterPx}px"></div>
            <div class="ripple-ring ripple-ring--2" style="width:${diameterPx}px;height:${diameterPx}px"></div>
            <div class="ripple-ring ripple-ring--3" style="width:${diameterPx}px;height:${diameterPx}px"></div>
            <div class="ripple-dot"></div>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    }), [diameterPx])

    if (!position || diameterPx === 0) return null
    return <Marker position={position} icon={icon} interactive={false} />
}

function LocationMarker({ position, setPosition }) {
    let map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng)
            console.log('Location found:', e.latlng)
            map.setView(e.latlng, map.getZoom())
        },
    })

    useEffect(() => {
        console.log('Locating...')
        map.locate()
    }, []);

    return null
}

export default function Home() {
    const [radius, setRadius] = useState(500)
    const [position, setPosition] = useState(null)
    const [spots, setSpots] = useState([])
    const [activeSpotId, setActiveSpotId] = useState(null)
    const [pendingRequest, setPendingRequest] = useState(null)
    const [acceptedRequest, setAcceptedRequest] = useState(null)
    const activeSpotIdRef = useRef(null)
    useEffect(() => {
        const channelA = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'spots',
                },
                (payload) => setSpots((current) => [...current, payload.new])
            )
            .subscribe((status) => console.log('Subscription status:', status))
        const channelB = supabase
            .channel('requests-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'requests',
                },
                (payload) => {
                    console.log('Request received:', payload.new)
                    console.log('Active spot ID:', activeSpotIdRef.current)
                    if (payload.new.spot_id == activeSpotIdRef.current) {
                        setPendingRequest(payload.new)
                    }
                }
            )
            .subscribe((status) => console.log('Subscription status:', status))
        const channelC = supabase
            .channel('requests-updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'requests',
                },
                (payload) => {
                    console.log('Request updated:', payload.new)
                    console.log('channelC fired')
                    console.log('Status value:', payload.new.status)
                    console.log('Type:', typeof payload.new.status)
                    console.log('Equals accepted:', payload.new.status === 'accepted')
                    if (payload.new.status === 'accepted') {
                        console.log('Setting accepted request')
                        setAcceptedRequest(payload.new)
                    }
                }
            )
            .subscribe((status) => console.log('Subscription status:', status))
        return () => {
            supabase.removeChannel(channelA)
            supabase.removeChannel(channelB)
            supabase.removeChannel(channelC)
        }
    }, [])

    useEffect(() => {
        async function getRadius() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error)
            }
            else {
                const { data, error } = await supabase.from('profiles')
                    .select('radius')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.log(error)
                }
                else {
                    setRadius(data.radius)
                }
            }
        }
        getRadius()
    }, [])

    async function handleLeaving() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error)
        }
        else {
            const { data, error } = await supabase.from('spots').insert({
                user_id: user.id,
                latitude: position.lat,
                longitude: position.lng
            }).select()
            if (error) {
                console.log(error)
            }
            setActiveSpotId(data[0].id)
            activeSpotIdRef.current = data[0].id
        }
    }

    async function handleRequest(spot_id) {
        console.log('Requesting spot:', spot_id)
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error)
        }
        else {
            const { error } = await supabase.from('requests').insert({
                requester_id: user.id,
                spot_id: spot_id,
            })
            if (error) {
                console.log(error)
            }
        }
    }

    async function handleAccept(request_id) {
        const { error } = await supabase.from('requests').update({
            status: 'accepted'
        }).eq('id', request_id)
        if (error) {
            console.log(error)
        }
        setPendingRequest(null)
    }

    async function handleDecline(request_id) {
        const { error } = await supabase.from('requests').
            update({ status: 'declined' }).
            eq('id', request_id)
        if (error) {
            console.log(error)
        }
        setPendingRequest(null)
    }

    async function handleConfirmHandoff() {
        const { error } = await supabase.from('requests').
            update({ status: 'completed' }).
            eq('id', acceptedRequest.id)

        const { data: spotData } = await supabase
            .from('spots')
            .select('user_id')
            .eq('id', acceptedRequest.spot_id)
            .single()

        const { data: profile } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', spotData.user_id)
            .single()

        const { error2 } = await supabase
            .from('profiles')
            .update({ points: profile.points + 10 })
            .eq('id', spotData.user_id)

        if (error || error2) {
            console.log(error)
            console.log(error2)
        }
        setAcceptedRequest(null)

    }

    L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
    L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
    L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
    L.Icon.Default.imagePath = "";
    return (
        <>
            <VerifyUser />
            <button className="leaving-btn" onClick={handleLeaving}>
                <span>🅿️</span>
                {/* <span className="leaving-label"></span> */}
            </button>
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
                {spots.map((spot) => (
                    <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
                        <Popup>
                            <button className="btn" id="request-btn" onClick={(e) => {
                                e.stopPropagation()
                                handleRequest(spot.id)
                            }}>Request Parking Spot</button>
                        </Popup>
                    </Marker>
                ))}
                {position && <Circle center={position} radius={radius} pathOptions={{ stroke: false, fillColor: '#63b3ed', fillOpacity: 0.1 }} />}
                {position && <SonarRipple position={position} radius={radius} />}
                <MoveAttribution />
            </MapContainer>

            {pendingRequest && (
                <div className="notification">
                    <h2>Parking Spot Requested</h2>
                    <p>Someone is requesting your parking spot.</p>
                    <button className="btn" onClick={() => handleAccept(pendingRequest.id)}>Accept</button>
                    <button className="btn" onClick={() => handleDecline(pendingRequest.id)}>Decline</button>
                </div>
            )}

            {acceptedRequest && (
                <div className="notification">
                    <h2>Parking Spot Accepted</h2>
                    <p>Someone has accepted your request for the parking spot.</p>
                    <button className="btn" onClick={handleConfirmHandoff}>Confirm handoff</button>
                </div>
            )}
        </>
    )
}