import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Users, Zap, CheckCircle, Code2, Brain, Star } from 'lucide-react'
import { fireEvent } from '../utils/analytics'
import { extractAndPersistRef } from '../utils/referral'

const PAIN_POINTS = [
  {
    icon: '😰',
    title: '"I say I know AI, but I have nothing to show"',
    desc: 'Interviewers ask for projects. You have theory. That gap is costing you offers.',
  },
  {
    icon: '⏰',
    title: '"I don\'t have weeks to build something"',
    desc: 'You\'re in placement season. Assignments, mock interviews, aptitude tests. Where\'s the time?',
  },
  {
    icon: '😕',
    title: '"AI tutorials leave me more confused"',
    desc: 'You watch a 3-hour video and still can\'t build a working project on your own.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Check Your AI Readiness', desc: 'Take a 5-minute quiz. We map your skill level and goal.', icon: Brain },
  { step: '02', title: 'Register Free', desc: 'Claim your spot in 60 seconds. No payment, no catches.', icon: Users },
  { step: '03', title: 'Get Your AI Project', desc: 'We assign you a personalised project matched to your goal.', icon: Code2 },
  { step: '04', title: 'Build it Live in 60 min', desc: 'We build it together, live. You leave with a deployed project.', icon: Zap },
]

const SAMPLE_PROJECTS = [
  { id: 'sentiment', emoji: '🧠', title: 'Twitter Sentiment Analyzer', domain: 'NLP', stack: 'Python · Streamlit · HuggingFace' },
  { id: 'cv', emoji: '👁️', title: 'Image Classifier Web App', domain: 'Computer Vision', stack: 'PyTorch · Streamlit · ResNet' },
  { id: 'ml', emoji: '📈', title: 'Stock Price Trend Predictor', domain: 'Machine Learning', stack: 'scikit-learn · pandas · yfinance' },
]

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    extractAndPersistRef()
    fireEvent('landing_view', {
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
    })
  }, [])

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div className="badge badge-primary animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
          <Zap size={11} /> Free Workshop · Limited Seats
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up delay-100" style={{
          fontSize: 'clamp(2.25rem, 6vw, 4rem)',
          fontWeight: 800, lineHeight: 1.1,
          maxWidth: 780, marginBottom: '1rem',
        }}>
          Don't just say you know AI.{' '}
          <span className="gradient-text">Build something.</span>
        </h1>

        {/* Subhead */}
        <p className="animate-fade-in-up delay-200" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--color-muted)', maxWidth: 580,
          marginBottom: '2.5rem', lineHeight: 1.7,
        }}>
          Join other final-year engineering students building a real, deployed AI project
          in just <strong style={{ color: 'var(--color-text)' }}>60 minutes</strong> — for free.
        </p>

        {/* Workshop pill */}
        <div className="glass animate-fade-in-up delay-300" style={{
          display: 'inline-flex', alignItems: 'center', gap: '1rem',
          padding: '0.75rem 1.5rem', marginBottom: '2rem',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem' }}>
            <Clock size={15} /> 60 Minutes
          </span>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Build Your First AI Project</span>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.9rem' }}>
            <Star size={13} fill="currentColor" /> Free
          </span>
        </div>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-400" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            id="hero-cta-readiness"
            className="btn-primary"
            style={{ fontSize: '1.05rem', padding: '1rem 2.25rem' }}
            onClick={() => navigate('/readiness')}
          >
            Check My AI Readiness <ArrowRight size={18} />
          </button>
          <button
            id="hero-cta-register"
            className="btn-secondary"
            onClick={() => navigate('/register')}
          >
            Register Now →
          </button>
        </div>
      </section>

      <div className="divider" />

      {/* ── Pain Points ────────────────────────────────────────────── */}
      <section className="section">
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, textAlign: 'center', marginBottom: '0.75rem' }}>
          Sound familiar?
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: '3rem', maxWidth: 520, margin: '0 auto 3rem' }}>
          These are the exact frustrations of every final-year CS/IT student in placement season.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {PAIN_POINTS.map((p, i) => (
            <div key={i} className="glass" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{p.icon}</div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem', lineHeight: 1.4 }}>{p.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
          How the Sprint works
        </h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '3.5rem', maxWidth: 500, margin: '0 auto 3.5rem' }}>
          From zero to deployed AI project in 60 minutes — here's the exact path.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="glass-light" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                color: 'var(--color-primary)', marginBottom: '1rem', opacity: 0.7,
              }}>{step.step}</div>
              <step.icon size={24} color="#6366f1" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Sample Projects ────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
          What will you build?
        </h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '3rem', maxWidth: 500, margin: '0 auto 3rem' }}>
          We recommend a project personalised to your skill level and goal — not a random tutorial.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {SAMPLE_PROJECTS.map((p) => (
            <div key={p.id} className="glass" style={{ padding: '1.75rem', textAlign: 'left', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{p.emoji}</div>
              <div className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>{p.domain}</div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>{p.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.825rem' }}>{p.stack}</p>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--color-muted)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          + 7 more projects matched to your AI interest and goal
        </p>
      </section>

      <div className="divider" />

      {/* ── Workshop Details ───────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="glass" style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 2rem' }}>
          <div className="badge badge-success" style={{ marginBottom: '1.25rem' }}>Free Workshop</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Build Your First AI Project<br />in 60 Minutes
          </h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            A live, hands-on workshop where we write code together — and you leave with a deployed AI project you can show in your portfolio and interviews.
          </p>
          {[
            { icon: '✅', text: 'Working, deployed AI project' },
            { icon: '✅', text: 'Personalised to your skill level and goal' },
            { icon: '✅', text: 'Step-by-step 60-minute build plan' },
            { icon: '✅', text: 'Completely free, no hidden cost' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem', justifyContent: 'center' }}>
              <span>{item.icon}</span>
              <span style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{item.text}</span>
            </div>
          ))}
          <button
            id="workshop-cta"
            className="btn-primary"
            style={{ marginTop: '2rem', fontSize: '1.05rem', padding: '1rem 2.5rem' }}
            onClick={() => navigate('/register')}
          >
            Claim My Free Spot <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.05) 100%)',
      }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Your AI project is{' '}
          <span className="gradient-text">60 minutes away.</span>
        </h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '2.5rem', maxWidth: 460, margin: '0 auto 2.5rem' }}>
          Don't enter your next interview without something to show. Build it this weekend.
        </p>
        <button
          id="final-cta"
          className="btn-primary"
          style={{ fontSize: '1.1rem', padding: '1rem 2.75rem' }}
          onClick={() => navigate('/readiness')}
        >
          Start My Readiness Check <ArrowRight size={18} />
        </button>
      </section>
    </div>
  )
}
