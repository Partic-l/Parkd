import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'
import './shared.css'

export default function Settings() {
    const [radius, setRadius] = useState(500)
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [carMake, setCarMake] = useState('')
    const [carModel, setCarModel] = useState('')
    const [carColor, setCarColor] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const [points, setPoints] = useState(0)
    const [email, setEmail] = useState('')
    const navigate = useNavigate();
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.log('Error signing out:', error)
        else {
            navigate('/login')
        }
    }
    useEffect(() => {
        async function getInfo() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error)
            }
            else {
                const { data, error } = await supabase.from('profiles')
                    .select('points, radius, name, phone_number, car_make, car_model, car_color, license_plate')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.log(error)
                }
                else {
                    setPoints(data.points)
                    setRadius(data.radius)
                    setName(data.name)
                    setPhoneNumber(data.phone_number)
                    setCarMake(data.car_make)
                    setCarModel(data.car_model)
                    setCarColor(data.car_color)
                    setLicensePlate(data.license_plate)
                    setEmail(user.email)
                }
            }
        }
        getInfo()
    }, [])
    async function handleSaveRadius() {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('profiles')
            .update({ radius: radius })
            .eq('id', user.id)
        if (error) console.log(error)
    }

    async function handleSaveprofile() {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('profiles')
            .update({
                name: name,
                phone_number: phoneNumber,
                car_make: carMake,
                car_model: carModel,
                car_color: carColor,
                license_plate: licensePlate
            })
            .eq('id', user.id)
        if (error) console.log(error)
    }

    return (
        <div className="settings-container">

            <div className="settings-card">
                <div className="profile-header">
                    <div className="avatar">
                        <span>{name ? name[0].toUpperCase() : '?'}</span>
                    </div>
                    <div className="profile-info">
                        <h2>{name || 'Your Name'}</h2>
                        <p>{email}</p>
                    </div>
                    <p className="points" style={{ margin: "5px" }}> Points: {points} </p>
                </div>
                <div className="more-settings">
                    <button className="btn" onClick={() => navigate("/settings/personal")}>Personal Info</button>
                    <button className="btn" onClick={() => navigate("/settings/car")}>Car Info</button>
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: "5px", alignItems: "center" }}>
                    <input className="text-input" type="range" min="0" max="1000" value={radius} step="10" onChange={(e) => setRadius(e.target.value)}></input>
                    <p style={{ margin: 0 }}> {radius} meters </p>
                </div>
                <button className="btn" onClick={handleSaveRadius}> Save Radius </button>
                <button className="btn" onClick={handleSignOut} style={{ backgroundColor: "maroon", marginTop: "10px" }}> Sign out </button>
            </div>
        </div>
    )
}