import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'

export default function Settings() {
    const [radius, setRadius] = useState(500)
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [carMake, setCarMake] = useState('')
    const [carModel, setCarModel] = useState('')
    const [carColor, setCarColor] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const navigate = useNavigate();
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.log('Error signing out:', error)
        else {
            navigate('/login')
        }
    }
    const [points, setPoints] = useState(0)
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
        <div>
            <h1> Settings </h1>
            <p> Points {points} </p>
            <div className="settings-inputs-container">
                <input className="settings-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                <input className="settings-input" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}></input>
                <input className="settings-input" placeholder="Car Make" value={carMake} onChange={(e) => setCarMake(e.target.value)}></input>
                <input className="settings-input" placeholder="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)}></input>
                <input className="settings-input" placeholder="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)}></input>
                <input className="settings-input" placeholder="License Plate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)}></input>
            </div>
            <button onClick={handleSaveprofile}> Save Profile </button>
            <button onClick={handleSignOut}> Sign out </button>
            <input type="range" min="0" max="10000" value={radius} step="10" onChange={(e) => setRadius(e.target.value)}></input>
            <button onClick={handleSaveRadius}> Save Radius </button>
        </div>
    )
}