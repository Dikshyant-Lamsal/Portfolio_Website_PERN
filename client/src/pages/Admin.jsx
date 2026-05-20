// client/src/pages/Admin.jsx
//
// CHANGES FROM PREVIOUS VERSION:
//   • Imports MessageList
//   • Adds a second admin-section-divider + MessageList below ProjectList
//   • Everything else — state, topbar, ProfileForm, ProjectForm, ProjectList — unchanged

import { useState } from 'react'
import ProjectForm from '../components/ProjectForm'
import ProjectList from '../components/ProjectList'
import ProfileForm from '../components/ProfileForm'
import MessageList from '../components/MessageList'   // ── NEW ──
import './Admin.css'

export default function Admin({ onGoHome, onLogout }) {
    const [editingProject, setEditingProject] = useState(null)
    const [formOpen, setFormOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const openCreate = () => { setEditingProject(null); setFormOpen(true) }
    const openEdit = (project) => { setEditingProject(project); setFormOpen(true) }
    const closeForm = () => { setFormOpen(false); setEditingProject(null) }

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
                <div className="admin-topbar-right">
                    <button className="admin-add-btn" onClick={openCreate} aria-label="Add new project">
                        + Add Project
                    </button>
                    <button className="admin-logout-btn" onClick={onLogout} aria-label="Log out">
                        Log out
                    </button>
                </div>
            </header>

            <main className="admin-main">

                {/* ── Profile Settings ── */}
                <ProfileForm />

                <div className="admin-section-divider" aria-hidden="true" />

                {/* ── Project form (shown when open) ── */}
                {formOpen && (
                    <div className="admin-form-panel">
                        <ProjectForm
                            project={editingProject}
                            onSuccess={handleFormSuccess}
                            onCancel={closeForm}
                        />
                    </div>
                )}

                {/* ── All Projects ── */}
                <section className="admin-list-section">
                    <div className="admin-list-header">
                        <h2 className="admin-list-title">All Projects</h2>
                        <span className="admin-list-hint">
                            Click Edit to modify · Delete requires confirmation
                        </span>
                    </div>
                    <ProjectList refreshKey={refreshKey} onEdit={openEdit} />
                </section>

                <div className="admin-section-divider" aria-hidden="true" />  {/* ── NEW ── */}

                {/* ── Contact Messages ── NEW ── */}
                <section className="admin-list-section">
                    <MessageList />
                </section>

            </main>
        </div>
    )
}