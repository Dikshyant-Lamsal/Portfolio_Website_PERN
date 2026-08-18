// client/src/components/Skills.jsx
// Static skill categories — updated to reflect current full skill set.
// No architecture changes; only SKILL_CATEGORIES data updated.

import './Skills.css'

export default function Skills() {
    return (
        <section className="skills" id="skills">
            <div className="skills-header">
                <span className="section-eyebrow">What I work with</span>
                <h2 className="section-title">Skills</h2>
                <span className="section-line" aria-hidden="true" />
            </div>
            <div className="skills-grid">
                {SKILL_CATEGORIES.map((category, i) => (
                    <SkillCard key={category.title} category={category} index={i} />
                ))}
            </div>
        </section>
    )
}

function SkillCard({ category, index }) {
    return (
        <div className="skill-card" style={{ animationDelay: `${index * 0.08}s` }}>
            <div className="skill-card-header">
                <span className="skill-icon" aria-hidden="true">{category.icon}</span>
                <h3 className="skill-category">{category.title}</h3>
            </div>
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

const SKILL_CATEGORIES = [
    {
        title: 'Languages',
        icon: '{ }',
        skills: [
            { name: 'JavaScript' },
            { name: 'Python' },
            { name: 'Java' },
            { name: 'C' },
            { name: 'Motoko' },
        ],
    },
    {
        title: 'Frontend',
        icon: '🖥',
        skills: [
            { name: 'React' },
            { name: 'HTML5' },
            { name: 'CSS3' },
            { name: 'Vite' },
            { name: 'Electron' },
            { name: 'EJS' },
        ],
    },
    {
        title: 'Backend',
        icon: '⚙️',
        skills: [
            { name: 'Node.js' },
            { name: 'Express.js' },
            { name: 'REST APIs' },
        ],
    },
    {
        title: 'Databases',
        icon: '🗄',
        skills: [
            { name: 'PostgreSQL' },
            { name: 'MySQL' },
            { name: 'MongoDB' },
            { name: 'Snowflake' },
        ],
    },
    {
        title: 'Cloud & Deployment',
        icon: '☁️',
        skills: [
            { name: 'Vercel' },
            { name: 'Render' },
            { name: 'Microsoft Azure' },
        ],
    },
    {
        title: 'Tools & Platforms',
        icon: '🔧',
        skills: [
            { name: 'Git & GitHub' },
            { name: 'VS Code' },
            { name: 'DFINITY SDK' },
            { name: 'Cloudinary' },
        ],
    },
    {
        title: 'Domains',
        icon: '🚀',
        skills: [
            { name: 'Full Stack Development' },
            { name: 'Machine Learning' },
            { name: 'Data Engineering' },
            { name: 'Blockchain (ICP)' },
        ],
    },
]