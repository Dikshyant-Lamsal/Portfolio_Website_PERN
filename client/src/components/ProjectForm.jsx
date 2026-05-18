// client/src/components/ProjectForm.jsx
// Handles both CREATE (no project prop) and EDIT (project prop passed in).
// Calls onSuccess() after a successful submit so the parent can refresh.

import { useState, useEffect } from 'react'
import './ProjectForm.css'

const EMPTY_FORM = {
    title: '',
    description: '',
    tech_stack: '',   // user types comma-separated; converted to array on submit
    github_link: '',
    live_link: '',
    image_url: '',
    featured: false,
}

export default function ProjectForm({ project, onSuccess, onCancel }) {
    const isEditing = Boolean(project)

    const [form, setForm] = useState(EMPTY_FORM)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')  // idle | loading | error
    const [apiError, setApiError] = useState('')

    // Pre-fill form when editing; convert tech_stack array → comma string
    useEffect(() => {
        if (project) {
            setForm({
                title: project.title || '',
                description: project.description || '',
                tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
                github_link: project.github_link || '',
                live_link: project.live_link || '',
                image_url: project.image_url || '',
                featured: project.featured || false,
            })
        }
    }, [project])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // ── Client-side validation ───────────────────────────────────────────────
    const validate = () => {
        const next = {}
        if (!form.title.trim()) next.title = 'Title is required'
        if (!form.description.trim()) next.description = 'Description is required'
        if (!form.tech_stack.trim()) next.tech_stack = 'At least one technology is required'
        return next
    }

    // ── Submit → POST (create) or PUT (edit) ────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setStatus('loading')
        setApiError('')

        const payload = {
            ...form,
            // Convert "React, Node.js" → ["React", "Node.js"]
            tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
        }

        const url = isEditing ? `/api/projects/${project.id}` : '/api/projects'
        const method = isEditing ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json()

            if (!res.ok) {
                setApiError(data.error || 'Something went wrong.')
                setStatus('error')
                return
            }

            setStatus('idle')
            onSuccess()  // tell parent to refresh list + close form

        } catch {
            setApiError('Could not reach the server.')
            setStatus('error')
        }
    }

    const loading = status === 'loading'

    return (
        <div className="pf-wrap">

            {/* ── Header ── */}
            <div className="pf-header">
                <h3 className="pf-title">
                    {isEditing ? `Editing — ${project.title}` : 'Add New Project'}
                </h3>
                {onCancel && (
                    <button className="pf-close" onClick={onCancel} aria-label="Close">✕</button>
                )}
            </div>

            {/* ── Form ── */}
            <form className="pf-form" onSubmit={handleSubmit} noValidate>

                <FormField label="Title *" error={errors.title}>
                    <input
                        className={`pf-input ${errors.title ? 'pf-input--err' : ''}`}
                        name="title" value={form.title} onChange={handleChange}
                        placeholder="My Project" disabled={loading}
                    />
                </FormField>

                <FormField label="Description *" error={errors.description}>
                    <textarea
                        className={`pf-input pf-textarea ${errors.description ? 'pf-input--err' : ''}`}
                        name="description" value={form.description} onChange={handleChange}
                        placeholder="What does this project do?" rows={4} disabled={loading}
                    />
                </FormField>

                <FormField label="Tech Stack * — comma separated" error={errors.tech_stack}>
                    <input
                        className={`pf-input ${errors.tech_stack ? 'pf-input--err' : ''}`}
                        name="tech_stack" value={form.tech_stack} onChange={handleChange}
                        placeholder="React, Node.js, PostgreSQL" disabled={loading}
                    />
                </FormField>

                {/* GitHub + Live on one row */}
                <div className="pf-row">
                    <FormField label="GitHub Link">
                        <input
                            className="pf-input" name="github_link" value={form.github_link}
                            onChange={handleChange} placeholder="https://github.com/..."
                            disabled={loading}
                        />
                    </FormField>
                    <FormField label="Live Link">
                        <input
                            className="pf-input" name="live_link" value={form.live_link}
                            onChange={handleChange} placeholder="https://yoursite.com"
                            disabled={loading}
                        />
                    </FormField>
                </div>

                <FormField label="Image URL">
                    <input
                        className="pf-input" name="image_url" value={form.image_url}
                        onChange={handleChange} placeholder="https://..." disabled={loading}
                    />
                </FormField>

                {/* Featured checkbox */}
                <label className="pf-checkbox">
                    <input
                        type="checkbox" name="featured" checked={form.featured}
                        onChange={handleChange} disabled={loading}
                    />
                    <span className="pf-checkbox-label">Mark as Featured</span>
                </label>

                {/* API error banner */}
                {status === 'error' && apiError && (
                    <div className="pf-api-error" role="alert">{apiError}</div>
                )}

                {/* Action buttons */}
                <div className="pf-actions">
                    <button type="submit" className="pf-btn pf-btn--primary" disabled={loading}>
                        {loading
                            ? <><span className="pf-spinner" aria-hidden="true" /> Saving…</>
                            : isEditing ? 'Save Changes' : 'Add Project'
                        }
                    </button>
                    {onCancel && (
                        <button type="button" className="pf-btn pf-btn--ghost"
                            onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>

            </form>
        </div>
    )
}

// Small reusable label + error wrapper
function FormField({ label, error, children }) {
    return (
        <div className={`pf-field ${error ? 'pf-field--err' : ''}`}>
            <label className="pf-label">{label}</label>
            {children}
            {error && <span className="pf-error" role="alert">{error}</span>}
        </div>
    )
}