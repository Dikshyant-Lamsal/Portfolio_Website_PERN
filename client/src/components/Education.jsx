// client/src/components/Education.jsx
// Static education timeline — three qualification cards in reverse-chron order.

import './Education.css'

const EDUCATION = [
    {
        degree: 'Bachelor of Engineering — AI & Machine Learning',
        institution: 'CMR Institute of Technology, Bengaluru',
        score: 'CGPA 9.00',
        period: '2023 – 2027',
        current: true,
    },
    {
        degree: 'Higher Secondary (Grade 12)',
        institution: "St. Xavier's College, Maitighar, Nepal",
        score: '95.5%',
        period: '2023',
        current: false,
    },
    {
        degree: 'Secondary Education (Grade 10)',
        institution: "St. Xavier's School, Jawalakhel, Nepal",
        score: '92.5%',
        period: '2020',
        current: false,
    },
]

export default function Education() {
    return (
        <section className="education" id="education">

            <div className="education-header">
                <span className="section-eyebrow">Academic background</span>
                <h2 className="section-title">Education</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            <div className="edu-timeline">
                {EDUCATION.map((item, i) => (
                    <div className="edu-item" key={i}>
                        {/* ── Timeline spine ── */}
                        <div className="edu-spine" aria-hidden="true">
                            <span className={`edu-dot ${item.current ? 'edu-dot--active' : ''}`} />
                            {i < EDUCATION.length - 1 && <span className="edu-line" />}
                        </div>

                        {/* ── Card ── */}
                        <div className="edu-card">
                            <div className="edu-card-top">
                                <div className="edu-card-left">
                                    <h3 className="edu-degree">{item.degree}</h3>
                                    <p className="edu-institution">{item.institution}</p>
                                </div>
                                <div className="edu-card-right">
                                    <span className="edu-period">{item.period}</span>
                                    <span className="edu-score">{item.score}</span>
                                    {item.current && (
                                        <span className="edu-badge">Pursuing</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}