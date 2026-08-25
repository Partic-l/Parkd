import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'
import './shared.css'




export default function Personal() {
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate();
    useEffect(() => {
        async function getInfo() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error)
            }
            else {
                const { data, error } = await supabase.from('profiles')
                    .select('name, phone_number')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.log(error)
                }
                else {
                    setName(data.name)
                    setPhoneNumber(data.phone_number)
                    setEmail(user.email)
                }
            }
        }
        getInfo()
    }, [])

    async function handleSaveprofile() {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('profiles')
            .update({
                name: name,
                phone_number: phoneNumber,
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
                        <h2 style={{ margin: 0, fontSize: '20px' }}>Personal Info</h2>
                    </div>
                    <input className="text-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input className="text-input" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}></input>
                </div>
                <button className="btn" onClick={handleSaveprofile}> Save Profile </button>
            </div>
        </div>
    )
}
