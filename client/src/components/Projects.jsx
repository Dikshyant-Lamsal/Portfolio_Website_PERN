// client/src/components/Projects.jsx
// Renders the projects grid fetched from /api/projects.
// Each card shows title, description, tech stack badges, and links.

import { useProjects } from '../hooks/useProjects'

export default function Projects() {
  // featuredOnly: false → show all projects on the portfolio page
  const { projects, loading, error } = useProjects({ featuredOnly: false })

  // ── Loading state ──
  if (loading) {
    return (
      <section className="projects-section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-status">
          <span className="spinner" aria-hidden="true" />
          Loading projects…
        </div>
      </section>
    )
  }

  // ── Error state ──
  if (error) {
    return (
      <section className="projects-section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-status projects-status--error">
          ✗ Could not load projects — {error}
        </div>
      </section>
    )
  }

  // ── Empty state ──
  if (projects.length === 0) {
    return (
      <section className="projects-section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-status">
          No projects yet — add one via <code>POST /api/projects</code>
        </div>
      </section>
    )
  }

  // ── Projects grid ──
  return (
    <section className="projects-section">
      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

// ── Individual card ────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const {
    title,
    description,
    tech_stack,   // TEXT[] from PostgreSQL comes back as a JS array
    github_link,
    live_link,
    featured,
  } = project

  return (
    <article className={`project-card${featured ? ' project-card--featured' : ''}`}>

      {/* Featured badge */}
      {featured && <span className="featured-badge">Featured</span>}

      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{description}</p>

      {/* Tech stack badges */}
      {tech_stack && tech_stack.length > 0 && (
        <ul className="tech-list" aria-label="Tech stack">
          {tech_stack.map(tech => (
            <li key={tech} className="tech-badge">{tech}</li>
          ))}
        </ul>
      )}

      {/* Links */}
      <div className="project-links">
        {github_link && (
          <a
            href={github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            GitHub ↗
          </a>
        )}
        {live_link && (
          <a
            href={live_link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link project-link--live"
          >
            Live ↗
          </a>
        )}
      </div>
    </article>
  )
}