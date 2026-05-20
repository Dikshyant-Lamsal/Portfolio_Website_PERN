// client/src/App.jsx
// CHANGE FROM PREVIOUS: default theme is now 'light' instead of 'dark'.
// All other logic (auth, routing, hash handling) is identical.

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'

export default function App() {
  // ── Theme — default changed to 'light' ────────────────────────────────
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  // ── Auth state ─────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('adminToken'))
  )
  const handleLoginSuccess = () => setIsLoggedIn(true)
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    window.location.hash = ''
  }

  // ── Hash routing ───────────────────────────────────────────────────────
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goHome = () => { window.location.hash = '' }
  const goAdmin = () => { window.location.hash = '/admin' }

  if (hash === '#/login') {
    if (isLoggedIn) { window.location.hash = '/admin'; return null }
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  if (hash === '#/admin') {
    if (!isLoggedIn) { window.location.hash = '/login'; return null }
    return <Admin onGoHome={goHome} onLogout={handleLogout} />
  }

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Skills />
        <section id="projects" className="section-wrapper">
          <Projects />
        </section>
        <Contact />
      </main>
      <footer className="footer">
        <span>Dikshyant Lamsal</span>
        <span className="footer-dot">·</span>
        <span>Built with the PERN stack</span>
        <span className="footer-dot">·</span>
      </footer>
    </>
  )
}