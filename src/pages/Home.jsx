import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import '../App.css'

// ── Animated background shapes ──
function FloatingShapes() {
  return (
    <div className="hero-bg-shapes" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`floating-shape shape-${i % 3}`} style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 13.7) % 100}%`, animationDelay: `${i * 0.5}s` }} />
      ))}
    </div>
  )
}

// ── Typing hero text ──
function HeroType({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setDone(false)
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, 60)
    return () => clearInterval(timer)
  }, [text])

  return (
    <span className="hero-title">{displayed}<span className={`hero-cursor ${done ? 'cursor-done' : ''}`}>|</span></span>
  )
}

// ── Stats row ──
function StatsRow({ ref }) {
  const stats = [
    { label: 'Lessons', value: '13' },
    { label: 'GSAP Plugins', value: '4' },
    { label: 'Live Demos', value: '13' },
    { label: 'Zero Bullshit', value: '💯' },
  ]
  return (
    <div className="hero-stats" ref={ref}>
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Lesson preview cards ──
function TopicCards({ ref }) {
  const topics = [
    { icon: '🎯', title: 'GSAP Tweens', desc: 'Tweens, timelines, ScrollTrigger', path: '/gsap' },
    { icon: '🌊', title: 'Easing', desc: 'Make animations feel natural', path: '/gsap' },
    { icon: '📜', title: 'ScrollTrigger', desc: 'Scroll-driven animations', path: '/gsap' },
    { icon: '👆', title: 'Draggable', desc: 'Drag, throw, and snap', path: '/gsap' },
    { icon: '👁️', title: 'Observer', desc: 'Swipe & gesture detection', path: '/gsap' },
    { icon: '🧠', title: 'LLM Concepts', desc: 'Tokenization, attention, RAG', path: '/llm' },
  ]

  return (
    <section className="features" ref={ref}>
      <h2>What You'll Learn</h2>
      <div className="cards">
        {topics.map((t, i) => (
          <Link key={i} to={t.path} className="card" style={{ textDecoration: 'none' }}>
            <span className="card-icon">{t.icon}</span>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── Main page ──
function Home() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(heroRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    if (statsRef.current) {
      gsap.fromTo(statsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 })
    }
    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.8 })
    }

    // Animate floating shapes
    gsap.utils.toArray('.floating-shape').forEach((shape, i) => {
      gsap.to(shape, {
        y: `random(-30, 30)`,
        x: `random(-15, 15)`,
        rotation: `random(-10, 10)`,
        duration: 3 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }, [])

  return (
    <div className="home-page">
      <section className="hero-section">
        <FloatingShapes />
        <div className="hero-inner" ref={heroRef}>
          <HeroType text="Learn GSAP with animated demos" />
          <p className="tagline">No fluff. No theory-only lectures. Every topic has live, interactive examples you can play with.</p>
          <StatsRow statsRef={statsRef} />
          <Link to="/gsap" className="hero-cta">Start Learning →</Link>
        </div>
      </section>
      <TopicCards ref={cardsRef} />
      <footer className="home-footer">
        <p>Built for the GSAP-obsessed community.</p>
      </footer>
    </div>
  )
}

export default Home
