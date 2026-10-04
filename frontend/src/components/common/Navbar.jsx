import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8,12,20,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '0.5rem',
            background: 'var(--gradient-hero)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            AI Project Sprint
          </span>
        </Link>

        {/* CTA */}
        <button
          className="btn-ghost"
          onClick={() => navigate('/login')}
          style={{ fontSize: '0.875rem' }}
        >
          Find My Passport →
        </button>
      </div>
    </nav>
  )
}
