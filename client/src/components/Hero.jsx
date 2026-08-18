// client/src/components/Hero.jsx
// FIX: Resume button now forces a proper download with correct filename.
// Appends fl_attachment to the Cloudinary URL so the browser downloads
// it as "Dikshyant_Lamsal_Resume.pdf" instead of a random extensionless file.

import useProfile from '../hooks/useProfile'
import './Hero.css'

// ── Append Cloudinary's fl_attachment flag to force a named download ──────
// Works for both Cloudinary raw URLs and plain Google Drive / other URLs.
function toDownloadUrl(url) {
    if (!url) return url
    try {
        // Cloudinary raw URLs: insert fl_attachment in the transformation segment
        if (url.includes('res.cloudinary.com') && url.includes('/raw/upload/')) {
            return url.replace('/raw/upload/', '/raw/upload/fl_attachment/')
        }
        // For any other URL just return as-is (Drive links open in browser anyway)
        return url
    } catch {
        return url
    }
}

export default function Hero() {
    const { profile, loading } = useProfile()

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const fullName = profile?.full_name || ''
    const roleTitle = profile?.role_title || ''
    const heroBio = profile?.hero_subtitle || ''
    const githubUrl = profile?.github_url || '#'
    const linkedinUrl = profile?.linkedin_url || '#'
    const email = profile?.email || '#'
    const resumeUrl = profile?.resume_url || ''

    // Convert to a download-friendly URL
    const resumeDownloadUrl = toDownloadUrl(resumeUrl)

    return (
        <section className="hero" id="hero" aria-label="Introduction">

            <div className="hero-blob hero-blob--1" aria-hidden="true" />
            <div className="hero-blob hero-blob--2" aria-hidden="true" />

            <div className="hero-content">

                <p className="hero-eyebrow">
                    <span className="eyebrow-line" aria-hidden="true" />
                    Hello, I'm
                </p>

                <h1 className="hero-name">
                    {loading ? <span className="hero-placeholder" aria-hidden="true" /> : fullName}
                </h1>

                <h2 className="hero-role">
                    {loading
                        ? <span className="hero-placeholder hero-placeholder--sm" aria-hidden="true" />
                        : roleTitle}
                </h2>

                <p className="hero-bio">
                    {loading
                        ? <span className="hero-placeholder hero-placeholder--bio" aria-hidden="true" />
                        : heroBio}
                </p>

                <div className="hero-cta">
                    <button className="cta-btn cta-btn--primary" onClick={() => scrollTo('projects')}>
                        View Projects
                        <span className="cta-arrow" aria-hidden="true">→</span>
                    </button>

                    <button className="cta-btn cta-btn--secondary" onClick={() => scrollTo('contact')}>
                        Contact Me
                    </button>

                    {/* Resume button — only shown when URL is set */}
                    {resumeUrl && (
                        <a
                            href={resumeDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download="Dikshyant_Lamsal_Resume.pdf"
                            className="cta-btn cta-btn--resume"
                            aria-label="Download resume"
                        >
                            Resume
                            <span className="cta-arrow" aria-hidden="true">↓</span>
                        </a>
                    )}
                </div>

                <div className="hero-socials">
                    {githubUrl && githubUrl !== '#' && (
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                            className="social-link" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755
                -1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
                1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466
                -1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176
                0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405
                2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23
                1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
                0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295
                24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                        </a>
                    )}

                    {linkedinUrl && linkedinUrl !== '#' && (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                            className="social-link" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
                0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
                1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
                7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782
                13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0
                1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227
                24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                        </a>
                    )}

                    {email && email !== '#' && (
                        <a href={`mailto:${email}`} className="social-link" aria-label="Email">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                aria-hidden="true">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            Email
                        </a>
                    )}
                </div>

            </div>

            <div className="scroll-indicator" aria-hidden="true">
                <span className="scroll-dot" />
            </div>

        </section>
    )
}