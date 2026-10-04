import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: 'var(--color-muted)',
      fontSize: '0.875rem',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={14} color="#6366f1" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'var(--color-text)' }}>AI Project Sprint</span>
        </div>
        <p>Build. Ship. Prove. — A NxtWave Growth Challenge</p>
        <p style={{ opacity: 0.6 }}>© {new Date().getFullYear()} AI Project Sprint. Free workshop for engineering students.</p>
      </div>
    </footer>
  )
}
