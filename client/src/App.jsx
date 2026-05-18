// client/src/App.jsx
// Root component — owns theme state and hash-based routing.
// No react-router needed: we check window.location.hash to decide which
// "page" to render.
//
// Auth additions vs original (marked ── NEW ──):
//   • isLoggedIn state — derived from localStorage on mount
//   • /#/login hash route → renders <Login>
//   • /#/admin is guarded — redirects to /#/login if no token
//   • handleLoginSuccess / handleLogout helpers
//   • Admin receives an onLogout prop (logout button lives there)

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'   // ── NEW ──

export default function App() {
  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  // ── Auth state ── NEW ───────────────────────────────────────────────────
  // Read the token from localStorage on first render.
  // If it's present we treat the user as logged in; if not they must log in.
  // Note: this is a frontend convenience check only — the token is not
  // validated here. API route protection (Step 4) will do the real check.
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('adminToken'))
  )

  // Called by <Login> after it successfully stores the token
  const handleLoginSuccess = () => setIsLoggedIn(true)    // ── NEW ──

  // Called by <Admin> when the logout button is clicked
  const handleLogout = () => {                             // ── NEW ──
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    window.location.hash = ''   // send back to portfolio home
  }

  // ── Hash-based routing ─────────────────────────────────────────────────
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goHome = () => { window.location.hash = '' }
  const goAdmin = () => { window.location.hash = '/admin' }

  // ── Login route ── NEW ─────────────────────────────────────────────────
  if (hash === '#/login') {
    // If somehow they navigate to /#/login while already logged in,
    // skip the form and go straight to the dashboard.
    if (isLoggedIn) {
      window.location.hash = '/admin'
      return null
    }
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // ── Admin route (protected) ── NEW ─────────────────────────────────────
  if (hash === '#/admin') {
    // No token → bounce to login page
    if (!isLoggedIn) {
      window.location.hash = '/login'
      return null
    }
    // Token present → render dashboard; pass logout handler down
    return <Admin onGoHome={goHome} onLogout={handleLogout} />
  }

  // ── Portfolio view (default) ────────────────────────────────────────────
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