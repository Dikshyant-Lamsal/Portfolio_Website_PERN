import { useState, useEffect } from 'react'
import API_URL from '../config/api'

// Pass featured=true to only load featured projects, or false for all.
export function useProjects({ featuredOnly = false } = {}) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const url = featuredOnly
            ? `${API_URL}/api/projects?featured=true`
            : `${API_URL}/api/projects`

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