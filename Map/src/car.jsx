import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'
import './shared.css'



export default function Car() {
    const [carMake, setCarMake] = useState('')
    const [carModel, setCarModel] = useState('')
    const [carColor, setCarColor] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const navigate = useNavigate();
    useEffect(() => {
        async function getInfo() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error)
            }
            else {
                const { data, error } = await supabase.from('profiles')
                    .select('car_make, car_model, car_color, license_plate')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.log(error)
                }
                else {
                    setCarMake(data.car_make)
                    setCarModel(data.car_model)
                    setCarColor(data.car_color)
                    setLicensePlate(data.license_plate)
                }
            }
        }
        getInfo()
    }, [])

    async function handleSaveprofile() {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('profiles')
            .update({
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
                <div className="settings-inputs-container">
                    <div className="flex-header">
                        <button className="btn" id="back-btn" onClick={() => navigate("/settings")} style={{ alignSelf: "flex-start" }}>{'<'}</button>
                        <h2 style={{ margin: 0, fontSize: '20px' }}>Vehicle Info</h2>
                    </div>
                    <input className="text-input" placeholder="Car Make" value={carMake} onChange={(e) => setCarMake(e.target.value)}></input>
                    <input className="text-input" placeholder="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)}></input>
                    <input className="text-input" placeholder="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)}></input>
                    <input className="text-input" placeholder="License Plate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)}></input>
                </div>
                <button className="btn" onClick={handleSaveprofile}> Save Vehicle Info </button>
            </div>
        </div>
    )
}