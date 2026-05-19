// client/src/hooks/useProfile.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom hook — fetches the profile from GET /api/profile once on mount.
// Used by Hero, About, and Contact so they all share the same data
// without prop-drilling or Context API.
//
// Returns: { profile, loading, error }
//
//   profile — the profile object from the database, or null while loading
//   loading — true until the first fetch completes
//   error   — error message string if fetch failed, otherwise null
//
// Usage:
//   const { profile, loading, error } = useProfile()
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

export default function useProfile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Only runs once — on component mount
        fetch('/api/profile')
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
    }, []) // empty array = run once on mount only

    return { profile, loading, error }
}