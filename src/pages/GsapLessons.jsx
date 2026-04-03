import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import '../App.css'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Observer, Draggable)

// ──────────────────────────────────────────────
//  UI helpers
// ──────────────────────────────────────────────

function CodeBlock({ code, highlight }) {
  return (
    <div className="code-panel">
      <pre className="code-block">
        {code}
      </pre>
      {highlight && (
        <span className="code-highlight-label">{highlight}</span>
      )}
    </div>
  )
}

function Breakdown({ items }) {
  return (
    <ul className="breakdown">
      {items.map((item, i) => (
        <li key={i}>
          <span className="breakdown-key">{item.key}</span> → {item.desc}
        </li>
      ))}
    </ul>
  )
}

function LessonCard({ number, title, description, code, html, breakdown, children, replay }) {
  return (
    <article className="lesson">
      <header className="lesson-header">
        <span className="lesson-number">{number}</span>
        <div>
          <h3>{title}</h3>
          <p className="lesson-desc">{description}</p>
        </div>
      </header>

      <div className="lesson-body">
        <div className="lesson-code-area">
          {html && (
            <>
              <div className="lesson-code-label">🧱 HTML</div>
              <CodeBlock code={html} />
            </>
          )}

          <div className="lesson-code-label" style={{ marginTop: '1rem' }}>📝 GSAP Code</div>
          {Array.isArray(code) ? code.map((c, i) => (
            <CodeBlock key={i} code={c.lines} highlight={c.highlightLabel} />
          )) : <CodeBlock code={code.lines} />}

          {breakdown && <Breakdown items={breakdown} />}
        </div>

        <div className="lesson-demo-area">
          <div className="lesson-demo-header">
            <div className="lesson-demo-label">🎬 Live Demo</div>
            {replay && <button className="replay-btn" onClick={replay}>↻ Replay</button>}
          </div>
          {children}
        </div>
      </div>
    </article>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 1 — .to()
// ═══════════════════════════════════════════════

function TweenToDemo() {
  const boxRef = useRef(null)
  const run = () => {
    if (!boxRef.current) return
    gsap.set(boxRef.current, { x: 0, rotation: 0, backgroundColor: '#e94560' })
    gsap.to(boxRef.current, { x: 280, rotation: 360, backgroundColor: '#0ea5e9', duration: 2, ease: 'back.out(1.7)' })
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="1"
      title='.to()'
      description="Animate from the element's current state to new values you define."
      code={{
        lines: `gsap.to(element, {
  x: 280,
  rotation: 360,
  duration: 2,
  ease: "back.out(1.7)"
})`,
      }}
      html={`<div class="box"></div>`}
      breakdown={[
        { key: 'x: 280', desc: 'Move right by 280px' },
        { key: 'rotation: 360', desc: 'Spin one full turn' },
        { key: 'duration: 2', desc: 'Animation lasts 2 seconds' },
        { key: 'ease: "back.out"', desc: 'Overshoot slightly, then settle' },
      ]}
      replay={run}
    >
      <div className="demo-stage">
        <div className="demo-box" ref={boxRef}></div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 2 — .from()
// ═══════════════════════════════════════════════

function TweenFromDemo() {
  const boxRef = useRef(null)
  const run = () => {
    if (!boxRef.current) return
    gsap.set(boxRef.current, { opacity: 1 })
    gsap.from(boxRef.current, { y: -100, opacity: 0, scale: 0.3, duration: 1.5, ease: 'elastic.out(1, 0.5)' })
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="2"
      title='.from()'
      description="Define where the element should start — GSAP animates it from those values back to its CSS state."
      code={{
        lines: `gsap.from(element, {
  y: -100,       // starts 100px above
  opacity: 0,    // starts invisible
  scale: 0.3,    // starts tiny
  duration: 1.5,
  ease: "elastic.out(1, 0.5)"
})`,
      }}
      html={`<div class="box">  <!-- styled via CSS already -->  </div>`}
      breakdown={[
        { key: 'y: -100', desc: 'Starts from above its normal position' },
        { key: 'opacity: 0', desc: 'Fades in from invisible' },
        { key: 'scale: 0.3', desc: 'Grows from 30% size' },
        { key: 'ease: "elastic"', desc: 'Bouncy overshoot ending' },
      ]}
      replay={run}
    >
      <div className="demo-stage">
        <div className="demo-box" ref={boxRef}></div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 3 — .fromTo()
// ═══════════════════════════════════════════════

function TweenFromToDemo() {
  const boxRef = useRef(null)
  const run = () => {
    if (!boxRef.current) return
    gsap.set(boxRef.current, { x: 0, scale: 1, backgroundColor: '#e94560' })
    gsap.fromTo(boxRef.current,
      { x: 0, scale: 1, backgroundColor: '#e94560' },
      { x: 250, scale: 1.5, backgroundColor: '#8b5cf6', duration: 2, ease: 'power4.inOut', yoyo: true, repeat: 1 }
    )
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="3"
      title='.fromTo()'
      description="Explicitly set both the start and end values. Maximum control."
      code={{
        lines: `gsap.fromTo(element,
  { x: 0, scale: 1, backgroundColor: "red" },
  {
    x: 250,
    scale: 1.5,
    backgroundColor: "purple",
    duration: 2,
    ease: "power4.inOut",
    yoyo: true,
    repeat: 1
  }
)`,
      }}
      html={`<div class="box"></div>`}
      breakdown={[
        { key: 'from {}', desc: 'The FROM state — exactly where it starts' },
        { key: 'to {}', desc: 'The TO state — exactly where it ends' },
        { key: 'yoyo: true', desc: 'Play forward, then reverse' },
        { key: 'repeat: 1', desc: 'Do the full cycle twice' },
      ]}
      replay={run}
    >
      <div className="demo-stage">
        <div className="demo-box" ref={boxRef}></div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 4 — EASES
// ═══════════════════════════════════════════════

function EasesDemo() {
  const barsRef = useRef(null)
  const easeLabels = ['power1.in', 'power2.out', 'bounce.out', 'elastic.out', 'circ.inOut']
  const run = () => {
    if (!barsRef.current) return
    const bars = Array.from(barsRef.current.children)
    bars.forEach((bar, i) => {
      gsap.fromTo(bar, { x: 0 }, { x: 250, duration: 1.8, ease: easeLabels[i], delay: i * 0.2, repeat: 1, yoyo: true })
    })
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="4"
      title='Eases'
      description="Controls the rate of change. Linear is robotic; eases make it feel natural."
      code={{
        lines: `// HTML:
<div class="row">
  <span>ease label</span>
  <div class="box"></div>
</div>

// GSAP — one per row:
gsap.fromTo(row.querySelector(".box"),
  { x: 0 },
  { x: 250, ease: "bounce.out", repeat: 1, yoyo: true }
)`,
      }}
      html={`<div class="row" id="row-1">
  <span>power1.in</span>
  <div class="box"></div>
</div>
<div class="row" id="row-2">
  <span>bounce.out</span>
  <div class="box"></div>
</div>
<!-- one row per ease -->`}
      breakdown={[
        { key: 'power2.out', desc: 'Fast start, smooth landing' },
        { key: 'bounce.out', desc: 'Bounces at the end' },
        { key: 'elastic.out', desc: 'Rubber band snap' },
        { key: 'circ.inOut', desc: 'Circular — slow in, slow out' },
      ]}
      replay={run}
    >
      <div className="demo-stage demo-stack" ref={barsRef}>
        {easeLabels.map((e) => (
          <div key={e} className="eased-row">
            <span className="ease-label">{e}</span>
            <div className="demo-box demo-box-sm"></div>
          </div>
        ))}
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 5 — TIMELINES
// ═══════════════════════════════════════════════

function TimelineDemo() {
  const tlRef = useRef(null)
  const run = () => {
    if (tlRef.current) tlRef.current.kill()
    const tl = gsap.timeline()
    tl.to('.tl-box-1', { x: 200, duration: 0.8, ease: 'power2.out' })
      .to('.tl-box-2', { x: 200, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('.tl-box-3', { x: 200, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('.tl-box-1,.tl-box-2,.tl-box-3', { rotation: 360, y: -30, duration: 0.6, stagger: 0.1 })
      .to('.tl-box-1,.tl-box-2,.tl-box-3', { x: 0, y: 0, rotation: 0, duration: 1, stagger: 0.15, ease: 'back.out' })
    tlRef.current = tl
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="5"
      title='Timelines'
      description="Chain animations in sequence. Control when each one starts."
      code={{
        lines: `const tl = gsap.timeline();

tl.to(box1, { x: 200, duration: 0.8 })
  .to(box2, { x: 200 }, "-=0.4")   // overlap
  .to(box3, { x: 200 }, "-=0.4")   // overlap
  .to([box1,box2,box3], {
    rotation: 360,
    y: -30,
    stagger: 0.1
  });`,
      }}
      html={`<div class="box tl-box-1"></div>
<div class="box tl-box-2"></div>
<div class="box tl-box-3"></div>`}
      breakdown={[
        { key: 'gsap.timeline()', desc: 'Create a timeline to chain tweens' },
        { key: '">-0.4"', desc: 'Start 0.4s before the previous tween ends' },
        { key: '"+=0.5"', desc: 'Start 0.5s after the previous tween ends' },
        { key: 'stagger: 0.1', desc: 'Each element delays 0.1s after the last' },
      ]}
      replay={run}
    >
      <div className="demo-stage demo-stack">
        <div className="demo-box tl-box-1"></div>
        <div className="demo-box tl-box-2" style={{ backgroundColor: '#0ea5e9' }}></div>
        <div className="demo-box tl-box-3" style={{ backgroundColor: '#8b5cf6' }}></div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 6 — STAGGER
// ═══════════════════════════════════════════════

function StaggerDemo() {
  const gridRef = useRef(null)
  const run = () => {
    if (!gridRef.current) return
    const items = Array.from(gridRef.current.children)
    gsap.set(items, { opacity: 1, scale: 1, rotation: 0 })
    gsap.to(items, {
      opacity: 0, scale: 0, rotation: 180,
      duration: 0.5,
      stagger: { each: 0.05, from: 'center', grid: [3, 4] },
      onComplete: () => {
        gsap.fromTo(items,
          { opacity: 0, scale: 0, rotation: 180 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.6, stagger: { each: 0.05, from: 'edges', grid: [3, 4] } }
        )
      }
    })
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="6"
      title='Stagger'
      description="Apply the same animation to many elements with a timed delay between each."
      code={{
        lines: `gsap.to(items, {
  scale: 0,
  stagger: {
    each: 0.05,       // 50ms between each
    from: "center",   // start from the middle
    grid: [3, 4]      // layout dimensions
  }
})`,
      }}
      html={`<div class="grid">
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <!-- ...12 items total -->
</div>`}
      breakdown={[
        { key: 'each: 0.05', desc: '50ms delay between items' },
        { key: 'from: "center"', desc: 'Wave starts from the middle' },
        { key: 'from: "edges"', desc: 'Wave starts from outside, closes in' },
        { key: 'from: "random"', desc: 'Random order (also supported!)' },
      ]}
      replay={run}
    >
      <div className="demo-stage" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="stagger-grid" ref={gridRef}>
          {Array.from({ length: 12 }).map((_, i) => {
            const hue = (i * 30) % 360
            return <div key={i} className="stagger-item" style={{ background: `hsl(${hue}, 70%, 55%)` }}></div>
          })}
        </div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 7 — CALLBACKS
// ═══════════════════════════════════════════════

function CallbacksDemo() {
  const boxRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const run = () => {
    if (!boxRef.current) return
    setStatus('▶️ onStart fired!')
    gsap.to(boxRef.current, {
      x: 260, scale: 0.5, rotation: 360,
      duration: 1.5, ease: 'power3.inOut',
      onStart: () => setStatus('▶️ onStart fired!'),
      onUpdate: function () {
        const progress = Math.round(this.progress() * 100)
        setStatus(`⏳ onUpdate → ${progress}%`)
      },
      onComplete: () => {
        setStatus('✅ onComplete fired! Resetting...')
        gsap.to(boxRef.current, { x: 0, scale: 1, rotation: 0, delay: 0.5, ease: 'elastic.out(1, 0.5)' })
        setTimeout(() => setStatus('✅ Done — hit replay!'), 1500)
      },
    })
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="7"
      title='Callbacks'
      description="Hook JavaScript functions into animation lifecycle events."
      code={{
        lines: `gsap.to(element, {
  x: 300,
  duration: 1.5,
  onStart: () => console.log("started"),
  onUpdate: function() {
    // this.progress() → 0 to 1
    console.log(this.progress() * 100 + "%");
  },
  onComplete: () => console.log("done"),
  onRepeat: () => console.log("repeating")
})`,
      }}
      html={`<div class="box"></div>
<div class="status">idle</div>  <!-- updates live -->`}
      breakdown={[
        { key: 'onStart', desc: 'Runs once when animation begins' },
        { key: 'onUpdate', desc: 'Runs every frame during animation' },
        { key: 'onComplete', desc: 'Runs when animation finishes' },
        { key: 'onRepeat', desc: 'Runs each time it loops (with repeat)' },
      ]}
      replay={run}
    >
      <div className="demo-stage">
        <div className="demo-box" ref={boxRef}></div>
        <div className="callback-status">{status}</div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 8 — MOTION PATH
// ═══════════════════════════════════════════════

function MotionPathDemo() {
  const ballRef = useRef(null)
  const run = () => {
    if (!ballRef.current) return
    gsap.set(ballRef.current, { x: 0, y: 0 })
    gsap.to(ballRef.current, {
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: 80, y: -60 },
          { x: 200, y: -20 },
          { x: 250, y: 40 },
          { x: 150, y: 80 },
          { x: 0, y: 0 },
        ],
        autoRotate: true,
      },
      duration: 3, ease: 'sine.inOut', repeat: 1, yoyo: true,
    })
  }
  useEffect(() => { run() }, [])
  return (
    <LessonCard
      number="8"
      title='Motion Path'
      description="Animate elements along a curved path defined by x/y coordinates."
      code={{
        lines: `gsap.to(ball, {
  motionPath: {
    path: [
      { x: 0, y: 0 },
      { x: 80, y: -60 },
      { x: 200, y: -20 },
      { x: 250, y: 40 },
      { x: 0, y: 0 }
    ],
    autoRotate: true
  },
  duration: 3,
  ease: "sine.inOut"
})`,
      }}
      html={`<div class="stage">
  <div class="ball">🚀</div>
</div>`}
      breakdown={[
        { key: 'path: [...]', desc: 'Array of {x, y} waypoints (relative to start)' },
        { key: 'autoRotate: true', desc: 'Element rotates to follow the curve direction' },
        { key: 'ease: "sine.inOut"', desc: 'Smooth acceleration & deceleration' },
      ]}
      replay={run}
    >
      <div className="demo-stage motion-path-stage">
        <svg className="motion-path-svg" viewBox="0 50 250 100" fill="none">
          <path d="M30,30 L110,-30 L230,-10 L280,50 L180,90 L30,30" stroke="#2a2a3d" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        <div className="motion-ball" ref={ballRef}>🚀</div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 9 — FLIP (state morphing)
// ═══════════════════════════════════════════════

function FlipDemo() {
  const itemsRef = useRef(null)
  const [layout, setLayout] = useState('grid')

  const run = useCallback(() => {
    if (!itemsRef.current) return
    const items = itemsRef.current.children
    const firsts = Array.from(items).map(el => el.getBoundingClientRect())

    const next = layout === 'grid' ? 'list' : 'grid'
    setLayout(next)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const lasts = Array.from(items).map(el => el.getBoundingClientRect())
        firsts.forEach((first, i) => {
          const dx = first.left - lasts[i].left
          const dy = first.top - lasts[i].top
          const dScale = first.width / lasts[i].width

          gsap.set(items[i], { x: dx, y: dy, scaleX: dScale, scaleY: dScale })
          gsap.to(items[i], { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power3.inOut' })
        })
      })
    })
  }, [layout])

  return (
    <LessonCard
      number="9"
      title='FLIP — State Morphing'
      description="Animate layout changes smoothly without knowing the math ahead of time."
      code={{
        lines: `// 1. Capture FIRST position
const first = el.getBoundingClientRect();

// 2. Change state (React re-renders)
setExpanded(true);

// 3. Capture LAST position
requestAnimationFrame(() => {
  const last = el.getBoundingClientRect();

  // 4. Invert — calculate the delta
  gsap.set(el, {
    x: first.left - last.left,
    y: first.top - last.top
  });

  // 5. Play — animate back to normal
  gsap.to(el, {
    x: 0, y: 0, duration: 0.5
  });
})`,
      }}
      html={`<div class="container grid">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>

<!-- Toggle .grid → .list in CSS -->`}
      breakdown={[
        { key: 'First', desc: 'Record positions before any change' },
        { key: 'Last', desc: 'Record positions after the state change' },
        { key: 'Invert', desc: 'Calculate the difference (delta)' },
        { key: 'Play', desc: 'GSAP animates from the delta back to 0' },
      ]}
      replay={run}
    >
      <div className="demo-stage" style={{ padding: '1rem' }} ref={itemsRef}>
        <button className="flip-toggle" onClick={run}>{layout === 'grid' ? 'Switch to List →' : 'Switch to Grid →'}</button>
        <div className={`flip-container ${layout}`}>
          {[1, 2, 3, 4].map((n) => {
            const hues = ['#e94560', '#0ea5e9', '#8b5cf6', '#10b981']
            return <div key={n} className="flip-item" style={{ background: hues[n - 1] }}>Item {n}</div>
          })}
        </div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 10 — SCROLLTRIGGER
// ═══════════════════════════════════════════════

function ScrollTriggerDemos() {
  const triggerRef = useRef(null)
  const scrollTl = useRef(null)

  useEffect(() => {
    if (!triggerRef.current) return
    const container = triggerRef.current
    const children = Array.from(container.children)
    if (children.length < 4) return

    scrollTl.current = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    })

    scrollTl.current
      .fromTo(children[0], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 })
      .fromTo(children[1], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 })
      .fromTo(children[2], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 })
      .fromTo(children[3], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 })

    return () => {
      try {
        scrollTl.current?.scrollTrigger?.kill()
        scrollTl.current?.kill()
      } catch (e) {}
    }
  }, [])

  return (
    <LessonCard
      number="10"
      title='ScrollTrigger'
      description="Tie animations to scroll position — items animate as you scroll them into view."
      code={{
        lines: `gsap.timeline({
  scrollTrigger: {
    trigger: ".container",   // what to watch
    start: "top center",     // when animation starts
    end: "bottom center",    // when it ends
    scrub: 1                 // smooth scrub time (s)
  }
})
  .to(el, { opacity: 1, y: 0 })`,
      }}
      html={`// Add to the <body> (or any overflow container):
<div class="container">
  <div class="scroll-item">↓ Scroll me</div>
  <div class="scroll-item">↓ Keep going</div>
  <div class="scroll-item">↓ Almost done</div>
  <div class="scroll-item">✓ Done</div>
</div>`}
      breakdown={[
        { key: 'trigger', desc: 'The element being watched for scrolling' },
        { key: 'start: "top center"', desc: 'When top of trigger hits center of viewport' },
        { key: 'end: "bottom center"', desc: 'When bottom hits center' },
        { key: 'scrub: 1', desc: 'Smooth animation over 1s of scroll' },
        { key: 'scrub: true', desc: 'No smoothing — perfectly synced to scroll' },
      ]}
      replay={() => {
        if (scrollTl.current) scrollTl.current.scrollTrigger.update()
      }}
    >
      <div ref={triggerRef} className="scroll-trigger-container">
        <div className="scroll-item" style={{ background: '#e94560' }}>↓ Scroll down to see me appear</div>
        <div className="scroll-item" style={{ background: '#0ea5e9' }}>↓ Keep going...</div>
        <div className="scroll-item" style={{ background: '#8b5cf6' }}>↓ Almost there...</div>
        <div className="scroll-item" style={{ background: '#10b981' }}>✓ Got it!</div>
      </div>
      <div style={{ height: '120px', background: 'linear-gradient(#0d0d1a, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.8rem', borderRadius: '8px', marginTop: '1rem' }}>
        ⬆ Scroll within the demo above to scrub the animation
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 11 — TYPING TEXT EFFECT
// ═══════════════════════════════════════════════

function TextTypeDemo() {
  const charsRef = useRef(null)
  const tlRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const text = 'Hello GSAP'

  const run = () => {
    if (!charsRef.current) return
    if (tlRef.current) tlRef.current.kill()

    const spans = charsRef.current.querySelectorAll('.type-char')
    gsap.set(spans, { opacity: 0, y: -15 })
    setStatus('typing...')

    tlRef.current = gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      stagger: 0.06,
      ease: 'power2.out',
      onComplete: () => setStatus('done ✓'),
    })
  }

  useEffect(() => { run() }, [])

  return (
    <LessonCard
      number="11"
      title='Typewriter Text Effect'
      description="Animate text character-by-character. No plugin needed — just GSAP stagger."
      code={{
        lines: `// 1. Wrap each char in a <span>
<div class="word">
  <span class="char">H</span>
  <span class="char">i</span>
  ...
</div>

// 2. Stagger animate all spans
gsap.fromTo(
  document.querySelectorAll(".char"),
  { opacity: 0, y: -20 },
  { opacity: 1, y: 0, stagger: 0.08 }
)`,
      }}
      html={`<div class="word">
  <span class="char">H</span>
  <span class="char">e</span>
  <span class="char">l</span>
  <span class="char">l</span>
  <span class="char">o</span>
</div>
<!-- one span per letter -->`}
      breakdown={[
        { key: 'Wrap letters', desc: 'Each char in its own <span> (or do it with JS)' },
        { key: 'gsap.set()', desc: 'Start all spans invisible and above' },
        { key: 'stagger: 0.08', desc: '80ms gap between each letter appearing' },
        { key: 'y: -15 → 0', desc: 'Letters drop into place' },
      ]}
      replay={run}
    >
      <div className="demo-stage" style={{ flexDirection: 'column', alignItems: 'flex-start', minHeight: '80px' }}>
        <div ref={charsRef} style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e94560', display: 'flex', gap: '1px', flexWrap: 'wrap' }}>
          {text.split('').map((char, i) =>
            char === ' '
              ? <span key={i} style={{ width: '12px' }}></span>
              : <span key={i} className="type-char">{char}</span>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: '#a89cc8', marginTop: '0.5rem', fontFamily: 'Cascadia Code, monospace' }}>{status}</span>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 12 — OBSERVER
// ═══════════════════════════════════════════════

function ObserverDemo() {
  const stageRef = useRef(null)
  const obsRef = useRef(null)
  const [log, setLog] = useState([])

  useEffect(() => {
    if (!stageRef.current) return

    obsRef.current = Observer.create({
      target: stageRef.current,
      type: 'wheel,touch,pointer',
      onWheel: (self) => {
        gsap.to(self.target, { rotation: `+=${self.deltaY * 0.5}`, scale: 1 + self.deltaY * 0.001 })
        setLog((prev) => [...prev.slice(-4), `scroll ${self.deltaY > 0 ? '↓' : '↑'} (${self.deltaY})`])
      },
      onLeft: (self) => {
        gsap.to(self.target, { rotate: `-=${30}`, duration: 0.4 })
        setLog((prev) => [...prev.slice(-4), 'Swipe ←'])
      },
      onRight: (self) => {
        gsap.to(self.target, { rotate: `+=30`, duration: 0.4 })
        setLog((prev) => [...prev.slice(-4), 'Swipe →'])
      },
      onUp: (self) => {
        gsap.to(self.target, { scale: '+=0.1', duration: 0.3 })
        setLog((prev) => [...prev.slice(-4), 'Swipe ↑'])
      },
      onDown: (self) => {
        gsap.to(self.target, { scale: '-=0.1', duration: 0.3 })
        setLog((prev) => [...prev.slice(-4), 'Swipe ↓'])
      },
    })

    return () => { if (obsRef.current) obsRef.current.kill() }
  }, [])

  const resetLog = () => {
    setLog([])
    if (stageRef.current) gsap.to(stageRef.current, { rotation: 0, scale: 1, duration: 0.4 })
  }

  return (
    <LessonCard
      number="12"
      title='Observer'
      description="Listen to mouse wheel, touch, and pointer events — no plugins or libraries needed."
      code={{
        lines: `Observer.create({
  target: stage,
  type: "wheel,touch,pointer",
  onWheel: (self) => {
    // self.deltaY → scroll amount
    gsap.to(target, {
      rotation: self.deltaY
    })
  },
  onLeft: (self) => /* swiped left */,
  onRight: (self) => /* swiped right */,
  onUp: (self) => /* swiped up */,
  onDown: (self) => /* swiped down */
})`,
      }}
      html={`<div class="stage">
  <div class="box">Drag me!</div>
</div>`}
      breakdown={[
        { key: 'type', desc: 'What to listen to: "wheel", "touch", "pointer"' },
        { key: 'onWheel', desc: 'Fires on scroll with self.deltaY' },
        { key: 'onLeft/onRight', desc: 'Swipe direction events (touch)' },
        { key: 'onUp/onDown', desc: 'Swipe direction events (touch)' },
        { key: 'self.kill()', desc: 'Stop observing anytime' },
      ]}
      replay={resetLog}
    >
      <div className="demo-stage" style={{ flexDirection: 'column', gap: '0.5rem' }}>
        <div ref={stageRef} className="demo-box" style={{ margin: '0 auto' }}></div>
        <div style={{ fontSize: '0.75rem', color: '#a89cc8', fontFamily: 'Cascadia Code, monospace', marginTop: '0.5rem' }}>
          {log.length ? log.map((msg, i) => <div key={i}>{msg}</div>) : <span style={{ color: '#555' }}>Scroll or swipe on the box above...</span>}
        </div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 13 — DRAGGABLE
// ═══════════════════════════════════════════════

function DraggableDemo() {
  const stageRef = useRef(null)
  const [status, setStatus] = useState('Drag the boxes!')

  useEffect(() => {
    if (!stageRef.current) return

    const items = stageRef.current.querySelectorAll('.draggable-item')

    Draggable.create(items, {
      type: 'x,y',
      bounds: stageRef.current,
      inertia: true,
      onDrag: () => setStatus('Dragging...'),
      onThrowUpdate() {
        setStatus('Throwing with momentum...')
      },
      onDragEnd() {
        setStatus('Dropped ✅')
      },
    })

    return () => {
      items.forEach(item => {
        if (Draggable.get(item)) Draggable.get(item).kill()
      })
    }
  }, [])

  return (
    <LessonCard
      number="13"
      title='Draggable'
      description="Make any element draggable with bounds, inertia, and snap."
      code={{
        lines: `import { Draggable } from "gsap/Draggable"

gsap.registerPlugin(Draggable)

// Make all boxes draggable
Draggable.create(".box", {
  type: "x,y",          // allow movement on both axes
  bounds: parent,       // keep inside container
  inertia: true,        // throw with momentum
  onDrag: () => {},     // while dragging
  onDragEnd: () => {}   // after release
})`,
      }}
      html={`<div class="container">
  <div class="box draggable">🔴</div>
  <div class="box draggable">🟢</div>
  <div class="box draggable">🔵</div>
</div>`}
      breakdown={[
        { key: 'type: "x,y"', desc: 'Draggable on both axes (use "x" or "y" for one axis)' },
        { key: 'bounds', desc: 'Constrain movement to parent element' },
        { key: 'inertia: true', desc: 'Continue with momentum on release' },
        { key: 'snap', desc: 'Snap to grid or array of values on release' },
        { key: 'onDrag/onDragEnd', desc: 'Lifecycle callbacks' },
      ]}
      replay={() => {
        if (stageRef.current) {
          const items = stageRef.current.querySelectorAll('.draggable-item')
          gsap.to(items, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' })
          setStatus('Drag the boxes!')
        }
      }}
    >
      <div className="demo-stage" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
        <div ref={stageRef} className="draggable-stage">
          <div className="draggable-item" style={{ background: '#e94560', top: '20px', left: '20px' }}>🔴</div>
          <div className="draggable-item" style={{ background: '#10b981', top: '20px', left: '90px' }}>🟢</div>
          <div className="draggable-item" style={{ background: '#0ea5e9', top: '20px', left: '160px' }}>🔵</div>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#a89cc8', fontFamily: 'Cascadia Code, monospace' }}>{status}</span>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════

function GsapLessons() {
  const headerRef = useRef(null)

  useEffect(() => {
    if (!headerRef.current) return
    gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    return () => {
      ScrollTrigger.getAll().forEach(st => { try { st.kill() } catch (e) {} })
    }
  }, [])

  return (
    <div className="lessons-page">
      <header className="lessons-header" ref={headerRef}>
        <h1>🎬 Learn GSAP</h1>
        <p>Each lesson shows the code, explains every line, then demonstrates it live.</p>
      </header>

      <section className="lessons-section">
        <h2>Core Methods</h2>
        <TweenToDemo />
        <TweenFromDemo />
        <TweenFromToDemo />
      </section>

      <section className="lessons-section">
        <h2>Timelines & Sequencing</h2>
        <TimelineDemo />
        <StaggerDemo />
      </section>

      <section className="lessons-section">
        <h2>Easing</h2>
        <EasesDemo />
      </section>

      <section className="lessons-section">
        <h2>Event Handling</h2>
        <CallbacksDemo />
      </section>

      <section className="lessons-section">
        <h2>Advanced</h2>
        <MotionPathDemo />
        <FlipDemo />
        <ScrollTriggerDemos />
      </section>

      <section className="lessons-section">
        <h2>Next Up</h2>
        <TextTypeDemo />
      </section>

      <section className="lessons-section">
        <h2>Observer</h2>
        <ObserverDemo />
      </section>

      <section className="lessons-section">
        <h2>Draggable</h2>
        <DraggableDemo />
      </section>

      <footer className="lessons-footer">
        <p>📖 <a href="https://gsap.com/docs/" target="_blank" rel="noreferrer">GSAP Docs</a> · <a href="https://gsap.com/cheatsheet/" target="_blank" rel="noreferrer">Cheat Sheet</a> · <a href="https://gsap.com/docs/v3/Eases" target="_blank" rel="noreferrer">Visual Ease Explorer</a></p>
      </footer>
    </div>
  )
}

export default GsapLessons
