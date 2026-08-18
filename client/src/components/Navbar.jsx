// client/src/components/Navbar.jsx
// CHANGE: added IntersectionObserver scroll spy — activeSection state
// highlights the current nav link as the user scrolls.
// All existing scroll, hamburger, and theme toggle logic unchanged.

import { useState, useEffect, useRef } from 'react'
import './Navbar.css'

export default function Navbar({ theme, toggleTheme }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')  // ── NEW ──
    const observerRef = useRef(null)                        // ── NEW ──

    // ── Scroll — navbar background ───────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // ── IntersectionObserver — scroll spy ────────────────────────────────
    // Watches all section elements. When a section is ≥30% visible,
    // it becomes the active one. Uses rootMargin to trigger slightly
    // before the section reaches the top of the viewport.
    useEffect(() => {
        const sectionIds = NAV_LINKS.map(l => l.id)

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the entry that is intersecting and has the highest
                // intersection ratio — this handles fast scrolling correctly.
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id)
                }
            },
            {
                // Top offset matches navbar height (62px) so the section
                // is considered "active" once it clears the navbar.
                rootMargin: '-62px 0px -40% 0px',
                threshold: [0.1, 0.3, 0.5],
            }
        )

        sectionIds.forEach(id => {
            const el = document.getElementById(id)
            if (el) observerRef.current.observe(el)
        })

        return () => observerRef.current?.disconnect()
    }, [])

    const handleNavClick = () => setMenuOpen(false)

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(id)   // immediately highlight on click
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
                            className={`nav-link ${activeSection === id ? 'nav-link--active' : ''}`}
                            onClick={() => scrollTo(id)}
                            aria-current={activeSection === id ? 'true' : undefined}
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
                        className={`mobile-link ${activeSection === id ? 'mobile-link--active' : ''}`}
                        onClick={() => scrollTo(id)}
                    >
                        {label}
                    </button>
                ))}
            </nav>
        </header>
    )
}

const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Education', id: 'education' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
]