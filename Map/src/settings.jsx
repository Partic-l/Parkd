import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'

export default function Settings() {
    const [radius, setRadius] = useState(500)
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
                    .select('points, radius')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.log(error)
                }
                else {
                    setPoints(data.points)
                    setRadius(data.radius)
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
    return (
        <div>
            <h1> Settings </h1>
            <p> Points {points} </p>
            <button onClick={handleSignOut}> Sign out </button>
            <input type="range" min="0" max="10000" value={radius} step="10" onChange={(e) => setRadius(e.target.value)}></input>
            <button onClick={handleSaveRadius}> Save Radius </button>
        </div>
    )
}