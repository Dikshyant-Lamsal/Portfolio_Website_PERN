// client/src/App.jsx
// Root component — handles theme state, API test fetch, and layout
import { useState, useEffect } from 'react'
import Projects from './components/Projects'

export default function App() {
  // ── Theme State ──────────────────────────────────────────────────────────
  // Default is dark mode. Toggle flips between 'dark' and 'light'.
  const [theme, setTheme] = useState('dark')

  // Apply the theme as a data-attribute on <html> so CSS variables respond
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  // ── API Test State ────────────────────────────────────────────────────────
  const [apiMessage, setApiMessage] = useState('')
  const [apiStatus, setApiStatus] = useState('idle') // idle | loading | ok | error

  // Fetch the backend health-check on mount
  useEffect(() => {
    setApiStatus('loading')
    fetch('/api/test')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setApiMessage(data.message)
        setApiStatus('ok')
      })
      .catch(() => {
        setApiMessage('Could not reach backend.')
        setApiStatus('error')
      })
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">

      {/* ── Top Bar ── */}
      <header className="topbar">
        <span className="logo">
          <span className="logo-bracket">&lt;</span>
          portfolio
          <span className="logo-bracket">/&gt;</span>
        </span>

        {/* Theme toggle button */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle colour theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">
            {theme === 'dark' ? '☀ Light' : '☽ Dark'}
          </span>
        </button>
      </header>

      {/* ── Hero ── */}
      <main className="hero">
        <p className="hero-eyebrow">Hello, world —</p>
        <h1 className="hero-title">
          Dikshyant Lamsal<br />
        </h1>
        <p className="hero-sub">
          PERN stack · React · Node · PostgreSQL 
        </p>

        {/* ── Backend Status Card ── */}
        <div className={`status-card status-${apiStatus}`}>
          <span className="status-dot" aria-hidden="true" />
          <span className="status-text">
            {apiStatus === 'loading' && 'Connecting to backend…'}
            {apiStatus === 'ok'      && `✓ ${apiMessage}`}
            {apiStatus === 'error'   && `✗ ${apiMessage}`}
            {apiStatus === 'idle'    && '—'}
          </span>
        </div>
      </main>

      {/* ── Projects Section ── */}
      <Projects />

      {/* ── Footer ── */}
      <footer className="footer">
        <span>Built with the PERN stack</span>
        <span className="footer-dot">·</span>
        <span>Ready to customise</span>
      </footer>
    </div>
  )
}