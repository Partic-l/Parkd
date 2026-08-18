import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'

export default function Settings() {
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
        async function getPoints() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error)
            }
            else {
                const { data, error } = await supabase.from('profiles')
                    .select('points')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.log(error)
                }
                else {
                    setPoints(data.points)
                }
            }
        }
        getPoints()
    }, [])
    return (
        <div>
            <h1> Settings </h1>
            <p> Points {points} </p>
            <button onClick={handleSignOut}> Sign out </button>
        </div>
    )
}