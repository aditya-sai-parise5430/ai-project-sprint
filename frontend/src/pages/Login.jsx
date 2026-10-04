import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Loader2, ArrowRight } from 'lucide-react'
import { findPassport } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email'); return }
    setError('')
    setLoading(true)
    try {
      const data = await findPassport(email.trim().toLowerCase())
      if (data.success && data.passport_token) {
        localStorage.setItem('aps_passport_token', data.passport_token)
        toast.success('Found your passport!')
        navigate(`/passport?token=${data.passport_token}`)
      } else {
        setError("We couldn't find a registration for this email. Double-check or register below.")
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎫</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Find My Passport</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Enter the email you registered with and we'll bring up your AI Project Passport.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label" htmlFor="login-email">Registered Email</label>
              <input
                id="login-email"
                type="email"
                className={`input${error ? ' error' : ''}`}
                placeholder="arjun@vnit.ac.in"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
              />
              {error && <p className="error-msg">{error}</p>}
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ justifyContent: 'center' }}
            >
              {loading
                ? <><Loader2 size={17} style={{ animation: 'spin-slow 0.8s linear infinite' }} /> Looking up...</>
                : <>Find My Passport <ArrowRight size={17} /></>}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>Not registered yet? </span>
              <button type="button" className="btn-ghost" style={{ padding: '0 0.25rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}
                onClick={() => navigate('/register')}>
                Register free →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
