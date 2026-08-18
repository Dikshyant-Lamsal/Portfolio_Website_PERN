// client/src/components/Projects.jsx
// CHANGE: added client-side filter chips above the projects grid.
// Filtering is done on the already-fetched projects array — no extra API calls.

import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import './Projects.css'

// ── Filter chip labels — add/remove as your tech stack evolves ────────────
const FILTERS = ['All', 'React', 'Node.js', 'PostgreSQL', 'Python', 'Electron', 'Machine Learning']

export default function Projects() {
  const { projects, loading, error } = useProjects({ featuredOnly: false })
  const [activeFilter, setActiveFilter] = useState('All')

  // ── Loading ──
  if (loading) {
    return (
      <section className="projects-section" id="projects">
        <div className="projects-header">
          <span className="section-eyebrow">What I've built</span>
          <h2 className="section-title">Projects</h2>
          <span className="section-line" aria-hidden="true" />
        </div>
        <div className="projects-status">
          <span className="spinner" aria-hidden="true" /> Loading projects…
        </div>
      </section>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <section className="projects-section" id="projects">
        <div className="projects-header">
          <span className="section-eyebrow">What I've built</span>
          <h2 className="section-title">Projects</h2>
          <span className="section-line" aria-hidden="true" />
        </div>
        <div className="projects-status projects-status--error">
          ✗ Could not load projects — {error}
        </div>
      </section>
    )
  }

  // ── Filter chips — only show filters that have at least one matching project ──
  // Always keep "All" visible.
  const availableFilters = FILTERS.filter(f =>
    f === 'All' ||
    projects.some(p =>
      p.tech_stack?.some(t => t.toLowerCase().includes(f.toLowerCase()))
    )
  )

  // ── Apply filter ──
  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p =>
      p.tech_stack?.some(t =>
        t.toLowerCase().includes(activeFilter.toLowerCase())
      )
    )

  return (
    <section className="projects-section" id="projects">

      <div className="projects-header">
        <span className="section-eyebrow">What I've built</span>
        <h2 className="section-title">Projects</h2>
        <span className="section-line" aria-hidden="true" />
      </div>

      {/* ── Filter chips ── */}
      {availableFilters.length > 1 && (
        <div className="projects-filters" role="group" aria-label="Filter projects by technology">
          {availableFilters.map(filter => (
            <button
              key={filter}
              className={`filter-chip ${activeFilter === filter ? 'filter-chip--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* ── Empty filter result ── */}
      {filtered.length === 0 ? (
        <div className="projects-status">
          No projects match "{activeFilter}" yet.
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </section>
  )
}

// ── Individual card ────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const { title, description, tech_stack, github_link, live_link, image_url, featured } = project

  return (
    <article className={`project-card ${featured ? 'project-card--featured' : ''}`}>
      {featured && <span className="featured-badge">Featured</span>}

      {image_url && (
        <div className="project-img-wrap">
          <img src={image_url} alt={title} className="project-img" loading="lazy" />
        </div>
      )}

      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{description}</p>

      {tech_stack && tech_stack.length > 0 && (
        <ul className="tech-list" aria-label="Tech stack">
          {tech_stack.map(tech => (
            <li key={tech} className="tech-badge">{tech}</li>
          ))}
        </ul>
      )}

      <div className="project-links">
        {github_link && (
          <a href={github_link} target="_blank" rel="noopener noreferrer"
            className="project-link">GitHub ↗</a>
        )}
        {live_link && (
          <a href={live_link} target="_blank" rel="noopener noreferrer"
            className="project-link project-link--live">Live ↗</a>
        )}
      </div>
    </article>
  )
}