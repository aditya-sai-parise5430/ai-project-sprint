import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { ArrowRight, Loader2 } from 'lucide-react'
import { registerUser } from '../api'
import { getStoredRef } from '../utils/referral'
import { fireEvent } from '../utils/analytics'

const YEARS = ['1st', '2nd', '3rd', 'Final']
const AI_INTERESTS = ['NLP', 'CV', 'ML', 'Automation', 'Other']
const GOALS = ['Placement', 'Internship', 'Learning', 'Startup']

const AI_INTEREST_LABELS = {
  NLP: '🧠 Natural Language Processing',
  CV: '👁️ Computer Vision',
  ML: '📊 Machine Learning',
  Automation: '🤖 Automation & AI Agents',
  Other: '✨ Other / Not Sure Yet',
}

const GOAL_LABELS = {
  Placement: '🏢 Placement at top company',
  Internship: '💼 Tech internship',
  Startup: '🚀 Build a startup / project',
  Learning: '📚 Learn AI properly',
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email required'
  if (!form.college.trim()) errors.college = 'College name is required'
  if (!form.year) errors.year = 'Please select your year'
  if (!form.ai_interest) errors.ai_interest = 'Please select an AI interest'
  if (!form.goal) errors.goal = 'Please select a goal'
  return errors
}

export default function Register() {
  const navigate = useNavigate()

  // Prefill from quiz if available
  const quizResult = (() => {
    try { return JSON.parse(sessionStorage.getItem('aps_quiz_result') || 'null') } catch { return null }
  })()

  const [form, setForm] = useState({
    name: '', email: '', college: '', year: '',
    ai_interest: quizResult?.ai_interest || '',
    goal: quizResult?.goal || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fireEvent('registration_started')
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const utm = Object.fromEntries(new URLSearchParams(window.location.search))
      const data = await registerUser({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        college: form.college.trim(),
        referred_by: getStoredRef() || undefined,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      })
      // Persist token in localStorage for returning visits
      localStorage.setItem('aps_passport_token', data.passport_token)
      toast.success("You're registered! 🎉")
      navigate(`/passport?token=${data.passport_token}`)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Step 2 of 2</div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Claim Your Free Spot
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            60 seconds to register. Your AI project waits on the other side.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Name */}
            <div>
              <label className="label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" name="name" className={`input${errors.name ? ' error' : ''}`}
                placeholder="Arjun Sharma" value={form.name} onChange={handleChange} />
              {errors.name && <p className="error-msg">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="reg-email">College Email</label>
              <input id="reg-email" name="email" type="email" className={`input${errors.email ? ' error' : ''}`}
                placeholder="arjun@vnit.ac.in" value={form.email} onChange={handleChange} />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            {/* College */}
            <div>
              <label className="label" htmlFor="reg-college">College / University</label>
              <input id="reg-college" name="college" className={`input${errors.college ? ' error' : ''}`}
                placeholder="VNIT Nagpur" value={form.college} onChange={handleChange} />
              {errors.college && <p className="error-msg">{errors.college}</p>}
            </div>

            {/* Year */}
            <div>
              <label className="label" htmlFor="reg-year">Current Year</label>
              <select id="reg-year" name="year" className={`input${errors.year ? ' error' : ''}`}
                value={form.year} onChange={handleChange}>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
              </select>
              {errors.year && <p className="error-msg">{errors.year}</p>}
            </div>

            {/* AI Interest */}
            <div>
              <label className="label" htmlFor="reg-ai-interest">AI Domain I'm most interested in</label>
              <select id="reg-ai-interest" name="ai_interest" className={`input${errors.ai_interest ? ' error' : ''}`}
                value={form.ai_interest} onChange={handleChange}>
                <option value="">Select AI domain</option>
                {AI_INTERESTS.map(i => <option key={i} value={i}>{AI_INTEREST_LABELS[i]}</option>)}
              </select>
              {errors.ai_interest && <p className="error-msg">{errors.ai_interest}</p>}
            </div>

            {/* Goal */}
            <div>
              <label className="label" htmlFor="reg-goal">My primary goal right now</label>
              <select id="reg-goal" name="goal" className={`input${errors.goal ? ' error' : ''}`}
                value={form.goal} onChange={handleChange}>
                <option value="">Select goal</option>
                {GOALS.map(g => <option key={g} value={g}>{GOAL_LABELS[g]}</option>)}
              </select>
              {errors.goal && <p className="error-msg">{errors.goal}</p>}
            </div>

            {/* Referral notice */}
            {getStoredRef() && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '0.5rem',
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                fontSize: '0.85rem', color: '#6ee7b7',
              }}>
                ✅ Referred by a friend — you're both on the leaderboard!
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <><Loader2 size={18} style={{ animation: 'spin-slow 0.8s linear infinite' }} /> Registering...</>
              ) : (
                <>Register & See My AI Project <ArrowRight size={18} /></>
              )}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
              Free. No card required. No spam.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
