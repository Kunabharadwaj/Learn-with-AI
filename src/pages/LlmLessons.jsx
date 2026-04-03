import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import '../App.css'

// ──────────────────────────────────────────────
//  UI helpers (same as GSAP lessons)
// ──────────────────────────────────────────────

function CodeBlock({ code }) {
  return (
    <div className="code-panel">
      <pre className="code-block">{code}</pre>
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
              <div className="lesson-code-label">🧱 Concept</div>
              <CodeBlock code={html} />
            </>
          )}

          <div className="lesson-code-label" style={{ marginTop: '1rem' }}>📝 Code</div>
          {Array.isArray(code) ? code.map((c, i) => <CodeBlock key={i} code={c.lines} />) : <CodeBlock code={code.lines} />}

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
//  LESSON 1 — WHAT IS AN LLM?
// ═══════════════════════════════════════════════

function LlmIntro() {
  const [step, setStep] = useState(0)
  const stageRef = useRef(null)

  const phases = [
    { label: 'Pre-training', desc: 'Read the entire internet', color: '#e94560' },
    { label: 'Fine-tuning', desc: 'Learn to be helpful', color: '#8b5cf6' },
    { label: 'RLHF', desc: 'Align with human preferences', color: '#0ea5e9' },
    { label: 'Inference', desc: 'Predict next token', color: '#10b981' },
  ]

  useEffect(() => {
    setStep(0)
  }, [])

  const run = () => {
    if (!stageRef.current) return
    setStep(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setStep(Math.min(i, phases.length - 1))
      if (i >= phases.length - 1) clearInterval(interval)
    }, 1200)
  }

  useEffect(() => { run() }, [])

  return (
    <LessonCard
      number="1"
      title="What is an LLM?"
      description="A Large Language Model is a neural network trained on massive text data — it predicts the next word."
      code={{
        lines: `An LLM is a transformer model that:

1. Reads billions of words (pre-training)
2. Learns patterns, facts, reasoning
3. When you ask it something, it
   picks the next token probabilistically

GPT-4 = ~1.8 trillion parameters
Gemini = ~2 trillion parameters
LLaMA 3 = ~405 billion parameters`,
      }}
      html={`How LLMs are built:

  Raw Text → Pre-training → Base Model
       ↓
     Fine-tuning → SFT Model
       ↓
     RLHF → Final Model (ChatGPT, Gemini)
       ↓
     Inference → Your prompt → Tokens out`}
      breakdown={[
        { key: 'Parameters', desc: 'Learned weights — more ≠ always better' },
        { key: 'Transformer', desc: 'Architecture using self-attention' },
        { key: 'Token', desc: 'LLMs see text as sub-word chunks (not characters)' },
        { key: 'Inference', desc: 'Running the model to generate output' },
      ]}
      replay={run}
    >
      <div className="demo-stage" style={{ flexDirection: 'column', gap: '0.75rem' }}>
        <div ref={stageRef} className="llm-pipeline">
          {phases.map((phase, i) => (
            <div key={i} className={`pipe-step ${i <= step ? 'done' : ''}`} style={{ borderColor: phase.color }}>
              <span className="pipe-icon" style={{ background: phase.color }}>{i + 1}</span>
              <span className="pipe-label">{phase.label}</span>
              <span className="pipe-desc">{phase.desc}</span>
            </div>
          ))}
          {step >= phases.length - 1 && (
            <div className="pipe-result">
              <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✨</span>
              <span>Your answer appears...</span>
            </div>
          )}
        </div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 2 — TOKENIZATION
// ═══════════════════════════════════════════════

function TokenizationDemo() {
  const textRef = useRef(null)
  const [text, setText] = useState('ChatGPT is amazing')
  const [tokens, setTokens] = useState([])

  // Simple BPE-like tokenizer simulator
  const tokenize = (input) => {
    // Common token patterns that mimic real BPE behavior
    const commonMap = {
      'Chat': 'Chat',
      'GPT': 'GPT',
      ' is': 'is',
      ' amazing': 'amazing',
      'Hello': 'Hello',
      ' world': 'world',
      'un': 'un',
      'believable': 'believable',
      '🤖': '🤖',
      'don': 'don',
      "'t": "'t",
      'know': 'know',
      'AI': 'AI',
      '-driven': 'driven',
      ' is ': 'is',
      ' ': '',
    }

    const result = []
    let remaining = input

    // Walk through character by character with greedy matching
    // This simulates BPE: frequent subwords become tokens
    while (remaining.length > 0) {
      let matched = false
      // Try longest match first
      const patterns = [
        // Common multi-char tokens
        { re: /^Chat/, t: 'Chat' },
        { re: /^GPT/, t: 'GPT' },
        { re: /^Hello/, t: 'Hello' },
        { re: /^amazing/, t: 'amazing' },
        { re: /^world/, t: 'world' },
        { re: /^believable/, t: 'believable' },
        { re: /^don/, t: 'don' },
        { re: /^'t/, t: "'t" },
        { re: /^know/, t: 'know' },
        { re: /^un/, t: 'un' },
        { re: /^driven/, t: 'driven' },
        { re: /^AI/, t: 'AI' },
        { re: /^🤖/, t: '🤖' },
        { re: /^([A-Z][a-z]+)/, t: null },
        { re: /^([a-z]+)/, t: null },
        { re: /^( )/, t: '[space]' },
        { re: /^(.)/, t: null },
      ]

      for (const p of patterns) {
        const m = remaining.match(p.re)
        if (m) {
          const tokenText = m[0]
          const display = p.t || m[0]
          result.push({
            text: tokenText,
            display: display,
            isSpace: p.re.source === '^( )',
          })
          remaining = remaining.slice(tokenText.length)
          matched = true
          break
        }
      }
      if (!matched) {
        result.push({ text: remaining[0], display: remaining[0], isSpace: false })
        remaining = remaining.slice(1)
      }
    }
    return result
  }

  useEffect(() => {
    setTokens(tokenize(text))
  }, [text])

  const run = () => {
    setText('ChatGPT is amazing')
  }

  return (
    <LessonCard
      number="2"
      title="Tokenization"
      description="LLMs don't read text — they read tokens. A token can be a word, part of a word, or a character."
      code={{
        lines: `Text: "ChatGPT is amazing"

Tokens (actual GPT):
  Chat  │  GPT  │  is  │  amazing
  1st    │ 2nd    │ 3rd   │ 4th

Not 4 words — 4 tokens!

Text: "unbelievable"

Tokens:
  un  │  believable
  prefix  │  root word

Sub-word tokenization is the magic.`,
      }}
      html={`How BPE Tokenization works:

1. Start with characters: c-h-a-t
2. Find frequent pairs: "ch", "at"
3. Merge them: "ch" → token, "at" → token
4. Repeat until vocab reaches ~50k tokens

Common = big tokens ("the", "ing")
Rare = split more ("xy", "zq")`}
      breakdown={[
        { key: 'BPE', desc: 'Byte-Pair Encoding — merges frequent pairs' },
        { key: '~50k vocab', desc: 'GPT uses ~50,000 token types' },
        { key: '1 token ≈ 4 chars', desc: 'Rough rule of thumb for English' },
        { key: '100 tokens ≈ 75 words', desc: 'Standard conversion rate' },
      ]}
      replay={run}
    >
      <div className="demo-stage" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
        <input
          ref={textRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="token-input"
          placeholder="Type text to tokenize..."
        />
        <div className="tokens-display">
          {tokens.map((t, i) => (
            <span key={i} className={`token ${t.isSpace ? 'tok-space' : ''}`} style={{ background: `hsl(${i * 55}, 60%, 50%)` }}>
              {t.display}
              <span className="tok-id">{i + 1}</span>
            </span>
          ))}
        </div>
        <div className="token-stats">
          <span>Characters: {text.length}</span>
          <span>Words: {text.split(' ').filter(Boolean).length}</span>
          <span style={{ color: '#e94560', fontWeight: 700 }}>Tokens: {tokens.length}</span>
        </div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  LESSON 3 — EMBEDDINGS & SEMANTIC SEARCH
// ═══════════════════════════════════════════════

function EmbeddingsDemo() {
  const stageRef = useRef(null)
  const [selectedWord, setSelectedWord] = useState(null)

  // Mock 2D embeddings (t-SNE projection of real embeddings)
  const words = [
    { word: 'king', x: 60, y: 30, category: 'royalty' },
    { word: 'queen', x: 58, y: 28, category: 'royalty' },
    { word: 'prince', x: 55, y: 35, category: 'royalty' },
    { word: 'man', x: 40, y: 30, category: 'person' },
    { word: 'woman', x: 38, y: 28, category: 'person' },
    { word: 'boy', x: 35, y: 35, category: 'person' },
    { word: 'girl', x: 33, y: 33, category: 'person' },
    { word: 'cat', x: 70, y: 60, category: 'animal' },
    { word: 'dog', x: 68, y: 58, category: 'animal' },
    { word: 'kitten', x: 72, y: 63, category: 'animal' },
    { word: 'happy', x: 25, y: 70, category: 'emotion' },
    { word: 'joy', x: 28, y: 72, category: 'emotion' },
    { word: 'sad', x: 22, y: 78, category: 'emotion' },
    { word: 'angry', x: 30, y: 75, category: 'emotion' },
    { word: 'Python', x: 80, y: 40, category: 'tech' },
    { word: 'JavaScript', x: 82, y: 42, category: 'tech' },
    { word: 'React', x: 85, y: 38, category: 'tech' },
    { word: 'computer', x: 78, y: 45, category: 'tech' },
  ]

  const categoryColors = {
    royalty: '#f59e0b',
    person: '#06b6d4',
    animal: '#22c55e',
    emotion: '#a855f7',
    tech: '#ef4444',
  }

  // Find nearest neighbors
  const getNearest = (wordObj, n = 5) => {
    return words
      .filter((w) => w.word !== wordObj.word)
      .map((w) => ({
        ...w,
        distance: Math.sqrt((w.x - wordObj.x) ** 2 + (w.y - wordObj.y) ** 2),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, n)
  }

  const run = () => {
    setSelectedWord(null)
  }

  return (
    <LessonCard
      number="3"
      title="Embeddings & Semantic Search"
      description="Words become vectors. Similar words cluster together in high-dimensional space — and you can search by meaning."
      code={{
        lines: `// An embedding is a list of numbers:
"cat" → [0.23, -1.12, 0.89, ..., 0.05]
       (768 numbers for BERT-base)

// Similarity = cosine of angle
sim("cat", "dog") = 0.87   ← close!
sim("cat", "quantum") = 0.12  ← far

// The magic:
vec("king") - vec("man") + vec("woman") = vec("queen")`,
      }}
      html={`Embeddings capture meaning, not spelling.

"happy" and "joyful" → close vectors
"happy" and "algorithm" → far apart

Key property: 
  king - man + woman ≈ queen

This means embeddings learn relationships
between concepts, not just word co-occurrence.`}
      breakdown={[
        { key: 'Vector = list of numbers', desc: 'Each word maps to N dimensions (768 for BERT)' },
        { key: 'Cosine similarity', desc: 'Measures angle between two vectors (0–1)' },
        { key: 'Semantic space', desc: 'Similar words live close together' },
        { key: 'king - man + woman', desc: 'Famous analogy that embeddings can solve' },
      ]}
      replay={run}
    >
      <div className="demo-stage" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div ref={stageRef} className="embeddings-stage">
          <svg viewBox="0 0 100 100" className="embeddings-svg" style={{ width: '100%', height: '200px' }}>
            {/* Grid */}
            <line x1="0" y1="0" x2="0" y2="100" stroke="#1a1a2e" strokeWidth="0.3" />
            <line x1="100" y1="0" x2="100" y2="100" stroke="#1a1a2e" strokeWidth="0.3" />

            {/* Category labels */}
            {[
              { label: 'People', x: 35, y: 15, color: '#06b6d4' },
              { label: 'Royalty', x: 55, y: 12, color: '#f59e0b' },
              { label: 'Animals', x: 70, y: 45, color: '#22c55e' },
              { label: 'Emotions', x: 15, y: 65, color: '#a855f7' },
              { label: 'Tech', x: 80, y: 25, color: '#ef4444' },
            ].map((cat, i) => (
              <text key={i} x={cat.x} y={cat.y} fill={cat.color} fontSize="3" opacity="0.5" textAnchor="middle">
                {cat.label}
              </text>
            ))}

            {/* Lines from selected to nearest */}
            {selectedWord &&
              getNearest(selectedWord, 4)
                .filter((n) => n.distance < 15)
                .map((n, i) => (
                  <line
                    key={`line-${i}`}
                    x1={selectedWord.x}
                    y1={selectedWord.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={categoryColors[selectedWord.category]}
                    strokeWidth="0.4"
                    opacity={0.4}
                  />
                ))}

            {/* Word dots */}
            {words.map((w, i) => (
              <g key={i} onClick={() => setSelectedWord(w)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={w.x}
                  cy={w.y}
                  r={selectedWord?.word === w.word ? 3 : 1.8}
                  fill={categoryColors[w.category]}
                  opacity={selectedWord ? (selectedWord.word === w.word ? 1 : getNearest(selectedWord, 4).some((n) => n.word === w.word) ? 1 : 0.15) : 1}
                />
                <text
                  x={w.x}
                  y={w.y - 3}
                  fill={selectedWord?.word === w.word ? '#fff' : '#888'}
                  fontSize="2.5"
                  textAnchor="middle"
                >
                  {w.word}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {selectedWord && (
          <div className="embeddings-info">
            <h4 style={{ marginBottom: '0.4rem', color: categoryColors[selectedWord.category] }}>
              "{selectedWord.word}"
            </h4>
            <div className="embedding-vector">
              [{(selectedWord.x * 0.01 + 0.32).toFixed(3)}, {(Math.sin(selectedWord.x) * 0.5).toFixed(3)}, {(selectedWord.y * 0.01 - 0.1).toFixed(3)},
              ... , {(Math.cos(selectedWord.y) * 0.2).toFixed(3)}, {(selectedWord.x * selectedWord.y * 0.0001).toFixed(3)}, {(selectedWord.y * 0.005).toFixed(3)}]
            </div>
            <div className="neighbors">
              <span style={{ color: '#a89cc8', fontSize: '0.75rem' }}>Closest:</span>
              {getNearest(selectedWord, 5).map((n, i) => (
                <span key={i} className="neighbor-tag" style={{ background: `${categoryColors[n.category]}33` }}>
                  {n.word} ({n.distance.toFixed(1)})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="embeddings-legend">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <span key={cat} className="legend-item">
              <span className="legend-dot" style={{ background: color }}></span>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </LessonCard>
  )
}

// ═══════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════

function LlmLessons() {
  const headerRef = useRef(null)

  useEffect(() => {
    if (!headerRef.current) return
    gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
  }, [])

  return (
    <div className="lessons-page">
      <header className="lessons-header" ref={headerRef}>
        <h1>🧠 LLM Concepts</h1>
        <p>Understand how Large Language Models actually work — with interactive demos.</p>
      </header>

      <section className="lessons-section">
        <h2>Fundamentals</h2>
        <LlmIntro />
        <TokenizationDemo />
      </section>

      <section className="lessons-section">
        <h2>How LLMs Understand Text</h2>
        <EmbeddingsDemo />
      </section>

      <footer className="lessons-footer">
        <p>🧠 <a href="https://huggingface.co/learn/nlp-course" target="_blank" rel="noreferrer">HuggingFace NLP Course</a> · <a href="https://jalammar.github.io/illustrated-transformer/" target="_blank" rel="noreferrer">Illustrated Transformer</a> · <a href="https://openai.com/index/gpt-4/" target="_blank" rel="noreferrer">GPT-4 Technical Report</a></p>
      </footer>
    </div>
  )
}

export default LlmLessons
