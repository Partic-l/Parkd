import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from "react-router";
import './login.css'
import logo from './assets/spaced.svg'

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSignUp() {
        console.log('signing up with:', email, password)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            console.log(error)
        }
        else {
            navigate('/login')
        }
    }

    return (
        <div className="login-container">
            <div className="logo">
                <img src={logo} alt="Spaced" width="100" style={{ marginLeft: "10px" }} />
                <span style={{ fontSize: "50px", marginLeft: "5px" }}>Parkd</span>
            </div>
            <div className="login">
                <input type="text" className="text-input" placeholder="Email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="text-input" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn" onClick={handleSignUp}>Sign Up</button>
                <p>Already have an account? <a href="/login">Sign In!</a></p>
            </div>
        </div>
    )
}