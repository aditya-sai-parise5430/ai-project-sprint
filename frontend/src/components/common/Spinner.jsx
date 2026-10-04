export default function Spinner({ size = 32, color = 'var(--color-primary)' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{
        width: size, height: size,
        border: `3px solid rgba(99,102,241,0.15)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin-slow 0.8s linear infinite',
      }} />
    </div>
  )
}
