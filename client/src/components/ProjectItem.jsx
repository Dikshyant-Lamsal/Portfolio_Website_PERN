// client/src/components/ProjectItem.jsx
// Displays one project row in the admin list.
// CHANGE: DELETE fetch path now uses API_URL from config/api.js

import { useState } from 'react'
import API_URL from '../config/api'
import './ProjectItem.css'

export default function ProjectItem({ project, onEdit, onDeleted }) {
    const [deleteStatus, setDeleteStatus] = useState('idle')

    const handleDeleteClick = () => setDeleteStatus('confirm')
    const handleCancelDelete = () => setDeleteStatus('idle')

    const handleConfirmDelete = async () => {
        setDeleteStatus('deleting')
        const token = localStorage.getItem('adminToken')
        try {
            const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            })
            if (!res.ok) throw new Error()
            onDeleted()
        } catch {
            setDeleteStatus('idle')
            alert('Failed to delete project. Please try again.')
        }
    }

    return (
        <div className="pi-wrap">
            <div className="pi-info">
                <div className="pi-top">
                    <span className="pi-title">{project.title}</span>
                    {project.featured && (
                        <span className="pi-featured-badge">Featured</span>
                    )}
                </div>
                {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="pi-tech">
                        {project.tech_stack.map(t => (
                            <span key={t} className="pi-tech-badge">{t}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="pi-actions">
                {deleteStatus === 'confirm' ? (
                    <div className="pi-confirm">
                        <span className="pi-confirm-text">Delete?</span>
                        <button
                            className="pi-btn pi-btn--danger"
                            onClick={handleConfirmDelete}
                            disabled={deleteStatus === 'deleting'}
                        >
                            {deleteStatus === 'deleting' ? '…' : 'Yes'}
                        </button>
                        <button className="pi-btn pi-btn--ghost" onClick={handleCancelDelete}>
                            No
                        </button>
                    </div>
                ) : (
                    <>
                        <button className="pi-btn pi-btn--edit" onClick={() => onEdit(project)}>
                            Edit
                        </button>
                        <button className="pi-btn pi-btn--danger-outline" onClick={handleDeleteClick}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}