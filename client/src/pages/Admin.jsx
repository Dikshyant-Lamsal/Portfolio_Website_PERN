// client/src/pages/Admin.jsx
// ─────────────────────────────────────────────────────────────────────────────
// CHANGE FROM ORIGINAL: one prop added (onLogout) + one logout button in the
// topbar. Everything else — state, form, list — is completely unchanged.
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard page — accessible at /#/admin (hash routing, no react-router).
// Orchestrates ProjectForm and ProjectList.
// Owns: editingProject state, refreshKey counter, form visibility.

import { useState } from 'react'
import ProjectForm from '../components/ProjectForm'
import ProjectList from '../components/ProjectList'
import './Admin.css'

// ── NEW: accepts onLogout in addition to the existing onGoHome ──
export default function Admin({ onGoHome, onLogout }) {
    // null = create mode, project object = edit mode
    const [editingProject, setEditingProject] = useState(null)
    // true = form panel is open
    const [formOpen, setFormOpen] = useState(false)
    // Incrementing this number re-triggers ProjectList's useEffect fetch
    const [refreshKey, setRefreshKey] = useState(0)

    const openCreate = () => {
        setEditingProject(null)
        setFormOpen(true)
    }
    const openEdit = (project) => {
        setEditingProject(project)
        setFormOpen(true)
    }
    const closeForm = () => {
        setFormOpen(false)
        setEditingProject(null)
    }
    const handleFormSuccess = () => {
        closeForm()
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="admin-shell">
            {/* ── Top bar ── */}
            <header className="admin-topbar">
                <div className="admin-topbar-left">
                    <button className="admin-back" onClick={onGoHome} aria-label="Back to portfolio">
                        ← Portfolio
                    </button>
                    <h1 className="admin-heading">
                        <span className="admin-heading-bracket">&lt;</span>
                        Admin
                        <span className="admin-heading-bracket">/&gt;</span>
                    </h1>
                </div>

                {/* ── NEW: right side now has both buttons ── */}
                <div className="admin-topbar-right">
                    <button
                        className="admin-add-btn"
                        onClick={openCreate}
                        aria-label="Add new project"
                    >
                        + Add Project
                    </button>
                    {/* Logout button — calls App.jsx handler which clears localStorage */}
                    <button
                        className="admin-logout-btn"
                        onClick={onLogout}
                        aria-label="Log out"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="admin-main">
                {/* ── Form panel (shown when open) ── */}
                {formOpen && (
                    <div className="admin-form-panel">
                        <ProjectForm
                            project={editingProject}
                            onSuccess={handleFormSuccess}
                            onCancel={closeForm}
                        />
                    </div>
                )}

                {/* ── Project list ── */}
                <section className="admin-list-section">
                    <div className="admin-list-header">
                        <h2 className="admin-list-title">All Projects</h2>
                        <span className="admin-list-hint">
                            Click Edit to modify · Delete requires confirmation
                        </span>
                    </div>
                    <ProjectList
                        refreshKey={refreshKey}
                        onEdit={openEdit}
                    />
                </section>
            </main>
        </div>
    )
}