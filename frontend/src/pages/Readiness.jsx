import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { QUIZ_QUESTIONS, computeReadinessResult } from '../data/quiz'
import { fireEvent } from '../utils/analytics'

export default function Readiness() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fireEvent('readiness_check_started')
  }, [])

  const question = QUIZ_QUESTIONS[currentQ]
  const total = QUIZ_QUESTIONS.length
  const progress = ((currentQ) / total) * 100

  function handleSelect(value) {
    setSelected(value)
  }

  function handleNext() {
    if (selected === null) return
    const newAnswers = { ...answers, [question.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      // Compute result
      const numericAnswers = QUIZ_QUESTIONS
        .filter(q => !q.isInterest && !q.isGoal)
        .map(q => newAnswers[q.id])
        .filter(v => typeof v === 'number')

      const res = computeReadinessResult(numericAnswers)
      const interest = QUIZ_QUESTIONS.find(q => q.isInterest)
      const goalQ = QUIZ_QUESTIONS.find(q => q.isGoal)
      res.ai_interest = interest ? newAnswers[interest.id] : 'NLP'
      res.goal = goalQ ? newAnswers[goalQ.id] : 'Placement'

      // Persist for register form prefill
      sessionStorage.setItem('aps_quiz_result', JSON.stringify(res))
      fireEvent('readiness_check_completed', { score: res.score, level: res.level })
      setResult(res)
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
      setSelected(answers[QUIZ_QUESTIONS[currentQ - 1].id] ?? null)
    }
  }

  if (result) {
    return (
      <div style={{
        minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}>
        <div className="glass animate-fade-in" style={{ maxWidth: 540, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          {/* Result badge */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1.5rem',
            background: `${result.color}20`,
            border: `2px solid ${result.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
          }}>
            {result.level === 'AI Ready' ? '🚀' : result.level === 'Almost There' ? '⚡' : '🌱'}
          </div>

          <div className="badge" style={{ background: `${result.color}18`, color: result.color, borderColor: `${result.color}30`, marginBottom: '1rem' }}>
            {result.level}
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Your Readiness Score
          </h2>

          {/* Score bar */}
          <div style={{ margin: '1.25rem auto', maxWidth: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Score</span>
              <span style={{ fontWeight: 700, color: result.color, fontSize: '1rem' }}>{result.percentage}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${result.percentage}%`, background: result.color }} />
            </div>
          </div>

          <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
            {result.message}
          </p>

          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            We've matched you with the perfect AI project for your goal: <strong style={{ color: 'var(--color-text)' }}>{result.goal}</strong>
          </p>

          <button
            id="readiness-register-cta"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/register')}
          >
            Register & See My Project <ArrowRight size={18} />
          </button>
          <button
            className="btn-ghost"
            style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1.5rem',
    }}>
      <div style={{ maxWidth: 580, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            AI Project Readiness Check
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            5 quick questions · takes under 2 minutes
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>Question {currentQ + 1} of {total}</span>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div key={currentQ} className="glass animate-fade-in" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.75rem', lineHeight: 1.5 }}>
            {question.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                id={`quiz-option-${currentQ}-${i}`}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '0.625rem',
                  border: `1.5px solid ${selected === opt.value ? 'var(--color-primary)' : 'rgba(99,102,241,0.15)'}`,
                  background: selected === opt.value ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                  color: selected === opt.value ? 'var(--color-text)' : 'var(--color-muted)',
                  textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontSize: '0.925rem', fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}
                onMouseEnter={e => { if (selected !== opt.value) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)' }}
                onMouseLeave={e => { if (selected !== opt.value) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)' }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${selected === opt.value ? 'var(--color-primary)' : 'rgba(99,102,241,0.3)'}`,
                  background: selected === opt.value ? 'var(--color-primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
            {currentQ > 0 && (
              <button className="btn-secondary" onClick={handleBack} style={{ flexShrink: 0 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              id="quiz-next"
              className="btn-primary"
              onClick={handleNext}
              disabled={selected === null}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {currentQ < total - 1 ? 'Next' : 'See My Result'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
