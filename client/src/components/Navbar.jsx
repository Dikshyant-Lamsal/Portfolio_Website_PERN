// client/src/components/Navbar.jsx
// CHANGE: NAV_LINKS updated to include Education, Experience, Certifications.
// All component logic unchanged.

import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({ theme, toggleTheme }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = () => setMenuOpen(false)

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        handleNavClick()
    }

    return (
        <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar-inner">

                <button
                    className="navbar-logo"
                    onClick={() => scrollTo('hero')}
                    aria-label="Scroll to top"
                >
                    <span className="logo-bracket">&lt;</span>
                    Dikshyant Lamsal
                    <span className="logo-bracket">/&gt;</span>
                </button>

                <nav className="navbar-links" aria-label="Primary navigation">
                    {NAV_LINKS.map(({ label, id }) => (
                        <button
                            key={id}
                            className="nav-link"
                            onClick={() => scrollTo(id)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="navbar-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle colour theme"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <span className="toggle-track">
                            <span className="toggle-thumb" />
                        </span>
                        <span className="toggle-label">
                            {theme === 'dark' ? '☀' : '☽'}
                        </span>
                    </button>

                    <button
                        className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Toggle mobile menu"
                        aria-expanded={menuOpen}
                    >
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </button>
                </div>
            </div>

            <nav
                className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
                aria-label="Mobile navigation"
            >
                {NAV_LINKS.map(({ label, id }) => (
                    <button
                        key={id}
                        className="mobile-link"
                        onClick={() => scrollTo(id)}
                    >
                        {label}
                    </button>
                ))}
            </nav>
        </header>
    )
}

// ── Nav links — matches homepage section order in App.jsx ──────────────────
const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Education', id: 'education' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
]