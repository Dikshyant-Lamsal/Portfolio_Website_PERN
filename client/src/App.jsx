// client/src/App.jsx
// Root component — owns theme state and composes all sections.
// Theme toggle is passed as a prop to Navbar so it lives in one place.

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

export default function App() {
  // ── Theme State ──────────────────────────────────────────────────────────
  // 'dark' by default. Passed down to Navbar which renders the toggle button.
  const [theme, setTheme] = useState('dark')

  // Write the theme to <html data-theme="..."> so CSS variables respond
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Fixed navbar — receives theme state and toggle handler */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Page sections — each has an id for smooth-scroll nav links */}
      <main>
        <Hero />

        <About />

        <Skills />

        {/* Projects section — id used by navbar scroll link */}
        <section id="projects" className="section-wrapper">
          <Projects />
        </section>

        {/* Placeholder — filled in next sprint */}
        <Contact />
      </main>

      <footer className="footer">
        <span>Dikshyant Lamsal</span>
        <span className="footer-dot">·</span>
        <span>Built with the PERN stack</span>
      </footer>
    </>
  )
}