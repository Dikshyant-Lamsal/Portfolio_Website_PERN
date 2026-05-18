// client/src/components/Navbar.jsx
// Fixed navbar with glassmorphism on scroll, hamburger menu, and theme toggle.
// Theme toggle is lifted here from App.jsx — receives `theme` and `toggleTheme` as props.

import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({ theme, toggleTheme }) {
    // ── Scroll state: adds blur/glass effect once user scrolls down ──
    const [scrolled, setScrolled] = useState(false)

    // ── Mobile menu open/closed ──
    const [menuOpen, setMenuOpen] = useState(false)

    // Listen for scroll to toggle the `scrolled` class on the navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu whenever a nav link is clicked
    const handleNavClick = () => setMenuOpen(false)

    // Smooth scroll to a section by its id
    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        handleNavClick()
    }

    return (
        <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar-inner">

                {/* ── Logo ── */}
                <button
                    className="navbar-logo"
                    onClick={() => scrollTo('hero')}
                    aria-label="Scroll to top"
                >
                    <span className="logo-bracket">&lt;</span>
                    Dikshyant Lamsal
                    <span className="logo-bracket">/&gt;</span>
                </button>

                {/* ── Desktop nav links ── */}
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

                {/* ── Right side: theme toggle + hamburger ── */}
                <div className="navbar-actions">

                    {/* Theme toggle pill */}
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

                    {/* Hamburger — visible on mobile only */}
                    <button
                        className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Toggle mobile menu"
                        aria-expanded={menuOpen}
                    >
                        {/* Three bars that animate into an X */}
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </button>
                </div>
            </div>

            {/* ── Mobile dropdown menu ── */}
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

// ── Nav link definitions — add/remove sections here as the project grows ──
const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
]