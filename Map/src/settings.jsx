import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';

export default function Settings() {
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
        <h1>
            <h1> Settings </h1>
            <p> Points {points} </p>
        </h1>
    )
}