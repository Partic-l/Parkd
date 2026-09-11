import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from "react-router";
import './login.css'
import logo from './assets/spaced.svg'

export default function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newUser, setNewUser] = useState(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [carMake, setCarMake] = useState('')
    const [carModel, setCarModel] = useState('')
    const [carColor, setCarColor] = useState('')
    const [licensePlate, setLicensePlate] = useState('')

    async function handleProfileUpdate() {
        const { error } = await supabase
            .from('profiles')
            .update({
                name: name,
                phone_number: phone,
                car_make: carMake,
                car_model: carModel,
                car_color: carColor,
                license_plate: licensePlate,
            })
            .eq('id', newUser.id)

        if (error) {
            console.error('Error updating profile:', error.message)
        } else {
            navigate('/login')
        }
    }

    async function handleSignUp() {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            console.log(error)
        }
        else {
            setNewUser(data.user)
            setStep(2)
        }
    }

    return (
        <div className="login-container">
            <div className="logo">
                <img src={logo} alt="Spaced" width="100" style={{ marginLeft: "10px" }} />
                <span style={{ fontSize: "50px", marginLeft: "5px" }}>Parkd</span>
            </div>
            <div className="login">
                {step == 1 &&
                    <>
                        <input type="text" className="text-input" placeholder="Email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" className="text-input" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="btn" onClick={handleSignUp}>Sign Up</button>
                    </>
                }
                {step == 2 &&
                    <>
                        <input type="text" className="text-input" placeholder="Name" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" className="text-input" placeholder="Phone Number" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type="text" className="text-input" placeholder="Car Make" id="carMake" name="carMake" value={carMake} onChange={(e) => setCarMake(e.target.value)} />
                        <input type="text" className="text-input" placeholder="Car Model" id="carModel" name="carModel" value={carModel} onChange={(e) => setCarModel(e.target.value)} />
                        <input type="text" className="text-input" placeholder="Car Color" id="carColor" name="carColor" value={carColor} onChange={(e) => setCarColor(e.target.value)} />
                        <input type="text" className="text-input" placeholder="License Plate" id="licensePlate" name="licensePlate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                        <button className="btn" onClick={handleProfileUpdate}>Sign Up</button>
                    </>
                }
                <p>Already have an account? <a href="/login">Sign In!</a></p>
            </div>
        </div>

    )
}