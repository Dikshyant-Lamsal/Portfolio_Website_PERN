// client/src/components/ProjectList.jsx
// Fetches all projects from GET /api/projects and renders them as ProjectItems.
// CHANGE: fetch paths now use API_URL from config/api.js

import { useState, useEffect } from 'react'
import API_URL from '../config/api'
import ProjectItem from './ProjectItem'
import './ProjectList.css'

export default function ProjectList({ refreshKey, onEdit }) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        fetch(`${API_URL}/api/projects`)
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
    }, [refreshKey])

    const handleDeleted = () => {
        setLoading(true)
        fetch(`${API_URL}/api/projects`)
            .then(res => res.json())
            .then(data => { setProjects(data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    if (loading) return (
        <div className="pl-state">
            <span className="pl-spinner" aria-hidden="true" />
            Loading projects…
        </div>
    )

    if (error) return (
        <div className="pl-state pl-state--error">
            ✗ Could not load projects — {error}
        </div>
    )

    if (projects.length === 0) return (
        <div className="pl-state pl-state--empty">
            No projects yet — add your first one above.
        </div>
    )

    return (
        <div className="pl-list">
            {projects.map(project => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    onEdit={onEdit}
                    onDeleted={handleDeleted}
                />
            ))}
        </div>
    )
}