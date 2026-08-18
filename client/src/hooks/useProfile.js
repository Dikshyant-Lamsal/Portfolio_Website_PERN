// client/src/hooks/useProfile.js
// Custom hook — fetches the profile from GET /api/profile once on mount.
// Used by Hero, About, and Contact so they all share the same data.
//
// CHANGE: fetch path now uses API_URL from config/api.js

import { useState, useEffect } from 'react'
import API_URL from '../config/api'

export default function useProfile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`${API_URL}/api/profile`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => {
                setProfile(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('useProfile fetch error:', err.message)
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return { profile, loading, error }
}