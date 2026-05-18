// client/src/components/About.jsx

import './About.css'

export default function About() {
    return (
        <section className="about" id="about">

            {/* ── Section header ── */}
            <div className="about-header">
                <span className="section-eyebrow">Get to know me</span>
                <h2 className="section-title">About Me</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            {/* ── Two-column layout: left = text, right = education card ── */}
            <div className="about-grid">

                {/* ── Left: intro + interests ── */}
                <div className="about-left">
                    <p className="about-intro">
                        Hi, I'm <span className="about-name">Dikshyant Lamsal</span> — a
                        Full Stack Developer and AI/ML student based in India. I'm passionate
                        about building scalable, clean web applications and exploring the
                        intersection of modern web systems and artificial intelligence.
                    </p>

                    <p className="about-body">
                        My primary focus is full-stack development using the PERN and MERN
                        stacks, while simultaneously deepening my understanding of machine
                        learning concepts through my engineering degree. I enjoy writing
                        readable, maintainable code and designing user experiences that feel
                        effortless.
                    </p>

                    <p className="about-body">
                        When I'm not coding, I'm exploring new tools, contributing to projects,
                        or working through algorithmic challenges. I believe in learning by
                        building — every project is a chance to grow.
                    </p>

                    {/* ── Interests chips ── */}
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
                        {FACTS.map(({ label, value }) => (
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

const INTERESTS = [
    'Full-Stack Development',
    'AI / Machine Learning',
    'REST API Design',
    'Open Source',
    'Algorithm Design',
    'Developer Tooling',
]

const FACTS = [
    { value: '2+', label: 'Projects Built' },
    { value: 'PERN', label: 'Primary Stack' },
]