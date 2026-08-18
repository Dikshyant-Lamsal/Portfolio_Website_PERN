// client/src/components/ProjectForm.jsx
// Handles both CREATE (no project prop) and EDIT (project prop passed in).
// Calls onSuccess() after a successful submit so the parent can refresh.
// CHANGE: all fetch paths now use API_URL from config/api.js

import { useState, useEffect } from 'react'
import API_URL from '../config/api'
import './ProjectForm.css'

const EMPTY_FORM = {
    title: '',
    description: '',
    tech_stack: '',
    github_link: '',
    live_link: '',
    image_url: '',
    featured: false,
}

export default function ProjectForm({ project, onSuccess, onCancel }) {
    const isEditing = Boolean(project)

    const [form, setForm] = useState(EMPTY_FORM)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')
    const [apiError, setApiError] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [uploadStatus, setUploadStatus] = useState('idle')
    const [uploadError, setUploadError] = useState('')

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
            if (project.image_url) setImagePreview(project.image_url)
        }
    }, [project])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploadError('')
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowed.includes(file.type)) {
            setUploadError('Only jpg, png, webp, or gif files are allowed.')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File is too large. Maximum size is 5 MB.')
            return
        }
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleImageUpload = async () => {
        if (!imageFile) return
        setUploadStatus('uploading')
        setUploadError('')
        const token = localStorage.getItem('adminToken')
        const formData = new FormData()
        formData.append('image', imageFile)
        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            })
            const text = await res.text()
            const data = text ? JSON.parse(text) : {}
            if (!res.ok) {
                setUploadError(data.error || 'Upload failed.')
                setUploadStatus('error')
                return
            }
            setForm(prev => ({ ...prev, image_url: data.imageUrl }))
            setImagePreview(data.imageUrl)
            setImageFile(null)
            setUploadStatus('idle')
        } catch {
            setUploadError('Could not reach the server.')
            setUploadStatus('error')
        }
    }

    const validate = () => {
        const next = {}
        if (!form.title.trim()) next.title = 'Title is required'
        if (!form.description.trim()) next.description = 'Description is required'
        if (!form.tech_stack.trim()) next.tech_stack = 'At least one technology is required'
        return next
    }

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
            tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
        }
        const url = isEditing ? `${API_URL}/api/projects/${project.id}` : `${API_URL}/api/projects`
        const method = isEditing ? 'PUT' : 'POST'
        const token = localStorage.getItem('adminToken')
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })
            const text = await res.text()
            const data = text ? JSON.parse(text) : {}
            if (!res.ok) {
                setApiError(data.error || 'Something went wrong.')
                setStatus('error')
                return
            }
            setStatus('idle')
            onSuccess()
        } catch {
            setApiError('Could not reach the server.')
            setStatus('error')
        }
    }

    const loading = status === 'loading'
    const uploading = uploadStatus === 'uploading'

    return (
        <div className="pf-wrap">
            <div className="pf-header">
                <h3 className="pf-title">
                    {isEditing ? `Editing — ${project.title}` : 'Add New Project'}
                </h3>
                {onCancel && (
                    <button className="pf-close" onClick={onCancel} aria-label="Close">✕</button>
                )}
            </div>

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

                <FormField label="Project Image">
                    <div className="pf-image-section">
                        {imagePreview && (
                            <div className="pf-preview-wrap">
                                <img src={imagePreview} alt="Project preview" className="pf-preview-img" />
                                {form.image_url && form.image_url === imagePreview && (
                                    <span className="pf-preview-badge">✓ Uploaded</span>
                                )}
                            </div>
                        )}
                        <div className="pf-upload-row">
                            <label className="pf-file-label" aria-label="Choose image file">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="pf-file-input"
                                    onChange={handleImageChange}
                                    disabled={loading || uploading}
                                />
                                <span className="pf-file-btn">
                                    {imageFile ? imageFile.name : 'Choose image…'}
                                </span>
                            </label>
                            {imageFile && (
                                <button
                                    type="button"
                                    className="pf-upload-btn"
                                    onClick={handleImageUpload}
                                    disabled={uploading}
                                >
                                    {uploading
                                        ? <><span className="pf-spinner" aria-hidden="true" /> Uploading…</>
                                        : 'Upload'
                                    }
                                </button>
                            )}
                        </div>
                        {uploadError && (
                            <span className="pf-upload-error" role="alert">{uploadError}</span>
                        )}
                        <input
                            className="pf-input pf-image-url-input"
                            name="image_url" value={form.image_url}
                            onChange={handleChange}
                            placeholder="Or paste an image URL directly"
                            disabled={loading}
                        />
                    </div>
                </FormField>

                <label className="pf-checkbox">
                    <input
                        type="checkbox" name="featured" checked={form.featured}
                        onChange={handleChange} disabled={loading}
                    />
                    <span className="pf-checkbox-label">Mark as Featured</span>
                </label>

                {status === 'error' && apiError && (
                    <div className="pf-api-error" role="alert">{apiError}</div>
                )}

                <div className="pf-actions">
                    <button type="submit" className="pf-btn pf-btn--primary" disabled={loading || uploading}>
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

function FormField({ label, error, children }) {
    return (
        <div className={`pf-field ${error ? 'pf-field--err' : ''}`}>
            <label className="pf-label">{label}</label>
            {children}
            {error && <span className="pf-error" role="alert">{error}</span>}
        </div>
    )
}