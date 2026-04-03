import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import gsap from 'gsap'
import Home from './pages/Home.jsx'
import GsapLessons from './pages/GsapLessons.jsx'
import LlmLessons from './pages/LlmLessons.jsx'
import './App.css'

const sidebarItems = [
  { path: '/', label: '🏠 Home' },
  { path: '/gsap', label: '🎬 GSAP Animations' },
  { path: '/llm', label: '🧠 LLM Concepts' },
]

const small = typeof window !== 'undefined' && window.innerWidth < 768
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(!small)

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>📚 Learn Hub</h3>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '❮' : '❯'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {!sidebarOpen && (
          <button className="sidebar-expand" onClick={() => setSidebarOpen(true)}>☰</button>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gsap" element={<GsapLessons />} />
          <Route path="/llm" element={<LlmLessons />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
