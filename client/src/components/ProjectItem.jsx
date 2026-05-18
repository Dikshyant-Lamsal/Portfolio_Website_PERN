// client/src/components/ProjectItem.jsx
// Displays one project row in the admin list.
// Handles its own delete confirmation state.

import { useState } from 'react'
import './ProjectItem.css'

export default function ProjectItem({ project, onEdit, onDeleted }) {
    // 'idle' | 'confirm' | 'deleting'
    const [deleteStatus, setDeleteStatus] = useState('idle')

    const handleDeleteClick = () => setDeleteStatus('confirm')
    const handleCancelDelete = () => setDeleteStatus('idle')

    const handleConfirmDelete = async () => {
        setDeleteStatus('deleting')
        try {
            const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            onDeleted()  // tell parent to refresh list
        } catch {
            // On failure just reset — simple approach for a no-auth admin
            setDeleteStatus('idle')
            alert('Failed to delete project. Please try again.')
        }
    }

    return (
        <div className="pi-wrap">

            {/* ── Left: info ── */}
            <div className="pi-info">
                <div className="pi-top">
                    <span className="pi-title">{project.title}</span>
                    {project.featured && (
                        <span className="pi-featured-badge">Featured</span>
                    )}
                </div>

                {/* Tech badges */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="pi-tech">
                        {project.tech_stack.map(t => (
                            <span key={t} className="pi-tech-badge">{t}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Right: actions ── */}
            <div className="pi-actions">
                {deleteStatus === 'confirm' ? (
                    /* Inline confirmation — no modal needed */
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