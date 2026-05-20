// client/src/components/Certifications.jsx
// Static certifications grid — all current credentials and achievements.

import './Certifications.css'

const CERTIFICATIONS = [
    {
        title: '100 Days of Python Bootcamp',
        issuer: 'Udemy — Angela Yu',
        year: '2025',
        icon: '🐍',
    },
    {
        title: '100 Days of Web Development',
        issuer: 'Udemy — Angela Yu',
        year: '2025',
        icon: '🌐',
    },
    {
        title: 'Snowflake Platform On-Demand Training',
        issuer: 'Snowflake',
        year: '2026',
        icon: '❄️',
    },
    {
        title: 'MERN Stack React Node JS',
        issuer: 'MindLuster',
        year: '2025',
        icon: '⚛️',
    },
    {
        title: 'JavaScript: Beginner to Professional',
        issuer: 'MindLuster',
        year: '2024',
        icon: '{ }',
    },
    {
        title: 'Python Programming Language',
        issuer: 'MindLuster',
        year: '2024',
        icon: '🐍',
    },
    {
        title: 'Java for Beginners',
        issuer: 'MindLuster',
        year: '2023',
        icon: '☕',
    },
    {
        title: 'Smart India Hackathon',
        issuer: 'Government of India',
        year: '2024',
        icon: '🏆',
        achievement: 'Participant',
    },
]

export default function Certifications() {
    return (
        <section className="certifications" id="certifications">

            <div className="cert-header">
                <span className="section-eyebrow">Credentials & achievements</span>
                <h2 className="section-title">Certifications</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            <div className="cert-grid">
                {CERTIFICATIONS.map((cert, i) => (
                    <div className="cert-card" key={i}>
                        <span className="cert-icon" aria-hidden="true">{cert.icon}</span>
                        <div className="cert-info">
                            <h3 className="cert-title">{cert.title}</h3>
                            <p className="cert-issuer">{cert.issuer}</p>
                        </div>
                        <div className="cert-meta">
                            {cert.achievement && (
                                <span className="cert-achievement">{cert.achievement}</span>
                            )}
                            <span className="cert-year">{cert.year}</span>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}