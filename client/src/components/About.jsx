// client/src/components/About.jsx
//
// CHANGES FROM ORIGINAL:
//   • Imports useProfile hook
//   • about_text from DB replaces the three hardcoded <p> blocks
//     (paragraphs are split on double-newline "\n\n")
//   • location and availability_status from DB replace hardcoded fact values
//   • INTERESTS chips and Projects Built / Primary Stack facts kept as-is
//     (these aren't in the profile table — still static)
//   • Loading shimmer shown while fetching

import useProfile from '../hooks/useProfile'
import './About.css'

export default function About() {
    const { profile, loading } = useProfile()

    // ── Derive display values ─────────────────────────────────────────────
    const aboutText = profile?.about_text || ''
    const location = profile?.location || ''
    const availabilityStatus = profile?.availability_status || ''
    const fullName = profile?.full_name || 'Dikshyant Lamsal'

    // Split the about_text on double newline to get separate paragraphs.
    // In the seed script the text is stored with \n\n between paragraphs.
    const paragraphs = aboutText
        ? aboutText.split('\n\n').filter(p => p.trim())
        : []

    // Build the dynamic quick-facts — location + availability come from DB,
    // the rest stay static.
    const facts = [
        { value: '2+', label: 'Projects Built' },
        { value: 'PERN', label: 'Primary Stack' },
        ...(location ? [{ value: location, label: 'Based in' }] : []),
        ...(availabilityStatus ? [{ value: availabilityStatus, label: 'Availability' }] : []),
    ]

    return (
        <section className="about" id="about">
            {/* ── Section header ── */}
            <div className="about-header">
                <span className="section-eyebrow">Get to know me</span>
                <h2 className="section-title">About Me</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            {/* ── Two-column layout: left = text, right = facts card ── */}
            <div className="about-grid">

                {/* ── Left: intro + interests ── */}
                <div className="about-left">
                    {loading ? (
                        // Shimmer blocks while fetching
                        <>
                            <div className="about-placeholder" />
                            <div className="about-placeholder about-placeholder--short" />
                        </>
                    ) : (
                        paragraphs.length > 0
                            ? paragraphs.map((para, i) => (
                                <p
                                    key={i}
                                    className={i === 0 ? 'about-intro' : 'about-body'}
                                >
                                    {/* Bold the name on the first paragraph only */}
                                    {i === 0
                                        ? highlightName(para, fullName)
                                        : para
                                    }
                                </p>
                            ))
                            : <p className="about-intro">No about text yet.</p>
                    )}

                    {/* ── Interests chips — static ── */}
                    <div className="about-interests">
                        <span className="interest-label">Interests</span>
                        <div className="interest-chips">
                            {INTERESTS.map(item => (
                                <span key={item} className="chip">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right: quick facts ── */}
                <div className="about-right">
                    <div className="quick-facts">
                        {facts.map(({ label, value }) => (
                            <div key={label} className="fact">
                                <span className="fact-value">{value}</span>
                                <span className="fact-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

// ── Highlight the admin's name in the first paragraph ─────────────────────
// Wraps the full_name in a <span className="about-name"> just like the
// original hardcoded version did.
function highlightName(text, name) {
    if (!name || !text.includes(name)) return text
    const parts = text.split(name)
    return parts.map((part, i) => (
        i < parts.length - 1
            ? <span key={i}>{part}<span className="about-name">{name}</span></span>
            : <span key={i}>{part}</span>
    ))
}

// ── Static data ────────────────────────────────────────────────────────────
const INTERESTS = [
    'Full-Stack Development',
    'AI / Machine Learning',
    'REST API Design',
    'Open Source',
    'Algorithm Design',
    'Developer Tooling',
]