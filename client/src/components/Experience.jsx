// client/src/components/Experience.jsx
// Static work experience section — two internship entries.

import './Experience.css'

const EXPERIENCE = [
    {
        role: 'IT Support Intern',
        company: 'U-GO Nepal (NGO)',
        period: 'January 2026 – February 2026',
        bullets: [
            'Reviewed and improved the scholarship database system using Excel-based data restructuring and standardisation.',
            'Identified data gaps and inconsistencies, contributing to improved data accuracy and usability.',
            'Assessed cloud-based data management options and developed a database application to enhance scholarship record management.',
            'Handled organisational data responsibly under the supervision of the Executive Director.',
        ],
    },
    {
        role: 'Intern — WISE Digitalization Project',
        company: 'Educational Resource and Development Center Nepal (ERDCN)',
        period: 'July – August 2023',
        bullets: [
            'Assisted in preparation of documents for the WISE Digitalization project.',
            'Supported admin and finance-related tasks as assigned by the Executive Director.',
            'Worked on day-to-day management of digitalization tasks within a time-bound contract.',
        ],
    },
]

export default function Experience() {
    return (
        <section className="experience" id="experience">

            <div className="experience-header">
                <span className="section-eyebrow">Work history</span>
                <h2 className="section-title">Experience</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            <div className="exp-list">
                {EXPERIENCE.map((item, i) => (
                    <div className="exp-card" key={i}>
                        <div className="exp-card-header">
                            <div className="exp-card-left">
                                <h3 className="exp-role">{item.role}</h3>
                                <p className="exp-company">{item.company}</p>
                            </div>
                            <span className="exp-period">{item.period}</span>
                        </div>
                        <ul className="exp-bullets">
                            {item.bullets.map((b, j) => (
                                <li key={j} className="exp-bullet">{b}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

        </section>
    )
}