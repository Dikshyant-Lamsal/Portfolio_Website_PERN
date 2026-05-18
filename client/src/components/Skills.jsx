// client/src/components/Skills.jsx

import './Skills.css'

export default function Skills() {
    return (
        <section className="skills" id="skills">

            {/* ── Section header ── */}
            <div className="skills-header">
                <span className="section-eyebrow">What I work with</span>
                <h2 className="section-title">Skills</h2>
                <span className="section-line" aria-hidden="true" />
            </div>

            {/* ── Skill category grid ── */}
            <div className="skills-grid">
                {SKILL_CATEGORIES.map((category, i) => (
                    <SkillCard key={category.title} category={category} index={i} />
                ))}
            </div>

        </section>
    )
}

// ── Individual category card ──────────────────────────────────────────────
function SkillCard({ category, index }) {
    return (
        <div
            className="skill-card"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            {/* Category icon + title */}
            <div className="skill-card-header">
                <span className="skill-icon" aria-hidden="true">{category.icon}</span>
                <h3 className="skill-category">{category.title}</h3>
            </div>

            {/* Skill badges */}
            <ul className="skill-list" aria-label={`${category.title} skills`}>
                {category.skills.map(skill => (
                    <li key={skill.name} className="skill-badge">
                        <span className="skill-dot" aria-hidden="true" />
                        <span className="skill-name">{skill.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ── Skill data ────────────────────────────────────────────────────────────
const SKILL_CATEGORIES = [
    {
        title: 'Frontend',
        icon: '🖥',
        skills: [
            { name: 'React' },
            { name: 'JavaScript' },
            { name: 'HTML5' },
            { name: 'CSS3' },
            { name: 'Vite' },
        ],
    },
    {
        title: 'Backend',
        icon: '⚙️',
        skills: [
            { name: 'Node.js' },
            { name: 'Express.js' },
            { name: 'REST APIs' },
            { name: 'CRUD Architecture' },
        ],
    },
    {
        title: 'Databases',
        icon: '🗄',
        skills: [
            { name: 'PostgreSQL' },
            { name: 'MongoDB' },
            { name: 'MySQL' },
        ],
    },
    {
        title: 'Languages',
        icon: '{ }',
        skills: [
            { name: 'JavaScript' },
            { name: 'Python' },
            { name: 'Java' },
            { name: 'C' },
        ],
    },
    {
        title: 'Tools',
        icon: '🔧',
        skills: [
            { name: 'Git' },
            { name: 'GitHub' },
            { name: 'VS Code' },
        ],
    },
    {
        title: 'Currently Learning',
        icon: '🚀',
        skills: [
            { name: 'Machine Learning' },
            { name: 'AI Fundamentals' },
            { name: 'Data Structures' },
            { name: 'System Design' },
        ],
    },
]