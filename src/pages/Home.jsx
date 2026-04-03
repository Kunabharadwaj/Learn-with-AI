import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import '../App.css'

function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
  }, [])

  return (
    <section className="premium-hero">
      <div className="premium-hero-bg" />
      <div className="premium-hero-glow" />
      <div className="premium-hero-content" ref={heroRef}>
        <span className="premium-badge">✨ Interactive Learning Platform</span>
        <h1>
          Learn by <span className="premium-gradient-text">doing</span>, not reading
        </h1>
        <p className="premium-tagline">
          Hands-on lessons for GSAP animations and LLM internals. Every concept has live demos you can play with.
        </p>
        <div className="premium-ctas">
          <Link to="/gsap" className="premium-btn premium-btn-primary">Start GSAP →</Link>
          <Link to="/llm" className="premium-btn premium-btn-ghost">Explore LLMs</Link>
        </div>
        <div className="premium-stats">
          {[
            ['13', 'Live Demos'],
            ['5', 'LLM Lessons'],
            ['0$', 'Always Free'],
          ].map(([val, label], i) => (
            <div className="premium-stat" key={i}>
              <span className="premium-stat-value">{val}</span>
              <span className="premium-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoCards() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.3 })
  }, [])

  const cards = [
    {
      icon: '🎯',
      title: 'GSAP Animations',
      desc: 'Tweens, timelines, easing, ScrollTrigger — all animated live.',
      path: '/gsap',
      gradient: 'linear-gradient(135deg, #e94560 0%, #c2255c 100%)',
      span: 'wide',
    },
    {
      icon: '🧠',
      title: 'LLM Internals',
      desc: 'Tokenisation, embeddings, attention, temperature — demystified.',
      path: '/llm',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      span: 'wide',
    },
    {
      icon: '⚡',
      title: 'Draggable',
      desc: 'Drag, throw, snap.',
      path: '/gsap',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      span: null,
    },
    {
      icon: '🔮',
      title: 'Observer',
      desc: 'Swipe & gesture detection.',
      path: '/gsap',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      span: null,
    },
  ]

  return (
    <section className="premium-section">
      <div className="premium-section-header">
        <h2>What you'll explore</h2>
        <p>Pick a topic. Every card opens a lesson with real code and interactive demos.</p>
      </div>
      <div className="premium-bento" ref={ref}>
        {cards.map((c, i) => (
          <Link
            key={i}
            to={c.path}
            className={`premium-card ${c.span ? `premium-card-${c.span}` : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="premium-card-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <div className="premium-card-arrow" style={{ background: c.gradient }}>→</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function PremiumFooter() {
  return (
    <footer className="premium-footer">
      <p>Built with React + GSAP + Vite. Source on <a href="https://github.com/Kunabharadwaj/Learn-with-AI" target="_blank" rel="noreferrer">GitHub</a>.</p>
    </footer>
  )
}

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <BentoCards />
      <PremiumFooter />
    </div>
  )
}

export default Home
