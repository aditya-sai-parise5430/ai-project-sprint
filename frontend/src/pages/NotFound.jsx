import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🤖</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>404 — Page Not Found</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>This page doesn't exist. Let's get you back on track.</p>
      <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  )
}
