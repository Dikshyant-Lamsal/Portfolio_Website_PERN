// client/src/hooks/useProjects.js
// Custom hook that fetches the projects list from the backend.
// Returns { projects, loading, error } — consumed by any component that needs it.

import { useState, useEffect } from 'react'

// Pass featured=true to only load featured projects, or false for all.
export function useProjects({ featuredOnly = false } = {}) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const url = featuredOnly
            ? '/api/projects?featured=true'
            : '/api/projects'

        setLoading(true)
        setError(null)

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => {
                setProjects(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [featuredOnly])

    return { projects, loading, error }
}