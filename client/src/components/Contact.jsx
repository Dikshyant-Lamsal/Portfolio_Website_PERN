// client/src/components/Contact.jsx
// CHANGE: fetch path now uses API_URL from config/api.js

import { useState } from 'react'
import API_URL from '../config/api'
import useProfile from '../hooks/useProfile'
import './Contact.css'

const INITIAL_FORM = { name: '', email: '', message: '' }

export default function Contact() {
    const { profile } = useProfile()

    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')
    const [apiError, setApiError] = useState('')

    const email = profile?.email || ''
    const githubUrl = profile?.github_url || ''
    const linkedinUrl = profile?.linkedin_url || ''
    const fullName = profile?.full_name || 'Dikshyant'

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const next = {}
        if (!form.name.trim() || form.name.trim().length < 2)
            next.name = 'Name must be at least 2 characters'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!form.email.trim() || !emailRegex.test(form.email))
            next.email = 'Please enter a valid email address'
        if (!form.message.trim() || form.message.trim().length < 10)
            next.message = 'Message must be at least 10 characters'
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
        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) {
                setApiError(data.error || 'Something went wrong. Please try again.')
                setStatus('error')
                return
            }
            setStatus('success')
            setForm(INITIAL_FORM)
        } catch {
            setApiError('Could not reach the server. Please check your connection.')
            setStatus('error')
        }
    }

    const handleReset = () => { setStatus('idle'); setApiError('') }

    return (
        <section className="contact" id="contact">

            <div className="contact-header">
                <span className="section-eyebrow">Get in touch</span>
                <h2 className="section-title">Contact Me</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            <div className="contact-grid">

                <div className="contact-intro">
                    <p className="contact-intro-text">
                        Have a project in mind, a question, or just want to say hi?
                        Fill out the form and I'll get back to you as soon as possible.
                    </p>
                    <div className="contact-details">
                        {email && (
                            <a href={`mailto:${email}`} className="contact-detail-link">
                                <span className="contact-detail-icon" aria-hidden="true">✉</span>
                                {email}
                            </a>
                        )}
                        {githubUrl && (
                            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="contact-detail-link">
                                <span className="contact-detail-icon" aria-hidden="true">⌥</span>
                                {githubUrl.replace('https://', '')}
                            </a>
                        )}
                        {linkedinUrl && (
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-detail-link">
                                <span className="contact-detail-icon" aria-hidden="true">in</span>
                                LinkedIn Profile
                            </a>
                        )}
                    </div>
                </div>

                <div className="contact-form-wrap">
                    {status === 'success' ? (
                        <div className="contact-success">
                            <span className="success-icon" aria-hidden="true">✓</span>
                            <h3 className="success-title">Message sent!</h3>
                            <p className="success-body">
                                Thanks for reaching out, {fullName} will get back to you soon.
                            </p>
                            <button className="btn-send-another" onClick={handleReset}>
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit} noValidate>

                            <div className={`form-group ${errors.name ? 'form-group--error' : ''}`}>
                                <label className="form-label" htmlFor="contact-name">Name</label>
                                <input
                                    id="contact-name" className="form-input" type="text"
                                    name="name" value={form.name} onChange={handleChange}
                                    placeholder="Your name" autoComplete="name"
                                    disabled={status === 'loading'}
                                />
                                {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
                            </div>

                            <div className={`form-group ${errors.email ? 'form-group--error' : ''}`}>
                                <label className="form-label" htmlFor="contact-email">Email</label>
                                <input
                                    id="contact-email" className="form-input" type="email"
                                    name="email" value={form.email} onChange={handleChange}
                                    placeholder="you@example.com" autoComplete="email"
                                    disabled={status === 'loading'}
                                />
                                {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                            </div>

                            <div className={`form-group ${errors.message ? 'form-group--error' : ''}`}>
                                <label className="form-label" htmlFor="contact-message">Message</label>
                                <textarea
                                    id="contact-message" className="form-input form-textarea"
                                    name="message" value={form.message} onChange={handleChange}
                                    placeholder="Hi, I'd love to work with you on..."
                                    rows={5} disabled={status === 'loading'}
                                />
                                {errors.message && <span className="form-error" role="alert">{errors.message}</span>}
                            </div>

                            {status === 'error' && apiError && (
                                <div className="form-api-error" role="alert">{apiError}</div>
                            )}

                            <button
                                type="submit"
                                className={`form-submit ${status === 'loading' ? 'form-submit--loading' : ''}`}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <><span className="btn-spinner" aria-hidden="true" />Sending…</>
                                ) : (
                                    <>Send Message<span className="btn-arrow" aria-hidden="true">→</span></>
                                )}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}