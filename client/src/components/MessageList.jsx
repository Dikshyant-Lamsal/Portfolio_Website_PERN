// client/src/components/MessageList.jsx
// Admin dashboard section — fetches and displays all contact form submissions.
// Allows the admin to delete individual messages.
// Uses the same auth pattern as ProjectForm and ProfileForm.

import { useState, useEffect, useCallback } from 'react'
import API_URL from '../config/api'
import './MessageList.css'

export default function MessageList() {
    const [messages, setMessages] = useState([])
    const [status, setStatus] = useState('loading') // loading | ready | error
    const [errorMsg, setErrorMsg] = useState('')

    // ── Fetch all messages ────────────────────────────────────────────────
    const fetchMessages = useCallback(async () => {
        setStatus('loading')
        setErrorMsg('')
        const token = localStorage.getItem('adminToken')
        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) {
                setErrorMsg(data.error || 'Failed to load messages.')
                setStatus('error')
                return
            }
            setMessages(data)
            setStatus('ready')
        } catch {
            setErrorMsg('Could not reach the server.')
            setStatus('error')
        }
    }, [])

    useEffect(() => { fetchMessages() }, [fetchMessages])

    // ── Delete a message ─────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const token = localStorage.getItem('adminToken')
        try {
            const res = await fetch(`${API_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error()
            // Remove from local state — no need to re-fetch
            setMessages(prev => prev.filter(m => m.id !== id))
        } catch {
            alert('Failed to delete message. Please try again.')
        }
    }

    // ── Render states ────────────────────────────────────────────────────
    if (status === 'loading') {
        return (
            <div className="ml-status">
                <span className="spinner" aria-hidden="true" />
                Loading messages…
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="ml-status ml-status--error">
                ✗ {errorMsg}
                <button className="ml-retry" onClick={fetchMessages}>Retry</button>
            </div>
        )
    }

    return (
        <div className="ml-wrap">
            <div className="ml-header">
                <h2 className="ml-title">Messages</h2>
                <span className="ml-count">
                    {messages.length === 0
                        ? 'No messages'
                        : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
                </span>
            </div>

            {messages.length === 0 ? (
                <div className="ml-empty">
                    <span className="ml-empty-icon" aria-hidden="true">✉</span>
                    <p className="ml-empty-text">No contact messages yet.</p>
                    <p className="ml-empty-sub">Messages submitted via the contact form will appear here.</p>
                </div>
            ) : (
                <div className="ml-list">
                    {messages.map(msg => (
                        <MessageCard key={msg.id} msg={msg} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Individual message card ─────────────────────────────────────────────────
function MessageCard({ msg, onDelete }) {
    const [confirming, setConfirming] = useState(false)

    const formattedDate = new Date(msg.created_at).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className="ml-card">
            {/* ── Sender info row ── */}
            <div className="ml-card-meta">
                <div className="ml-sender">
                    <span className="ml-name">{msg.name}</span>
                    <a
                        href={`mailto:${msg.email}`}
                        className="ml-email"
                        title={`Email ${msg.name}`}
                    >
                        {msg.email}
                    </a>
                </div>
                <span className="ml-date">{formattedDate}</span>
            </div>

            {/* ── Message body ── */}
            <p className="ml-message">{msg.message}</p>

            {/* ── Actions ── */}
            <div className="ml-actions">
                {confirming ? (
                    <>
                        <span className="ml-confirm-text">Delete this message?</span>
                        <button
                            className="ml-btn ml-btn--danger"
                            onClick={() => onDelete(msg.id)}
                        >
                            Yes, delete
                        </button>
                        <button
                            className="ml-btn ml-btn--ghost"
                            onClick={() => setConfirming(false)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="ml-btn ml-btn--danger-outline"
                        onClick={() => setConfirming(true)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    )
}