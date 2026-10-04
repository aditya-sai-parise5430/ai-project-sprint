import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import adminApi from '../api/admin'
import Spinner from '../components/common/Spinner'

const ADMIN_KEY_STORAGE = 'aps_admin_key'
const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

function StatCard({ label, value, sub, color = '#6366f1' }) {
  return (
    <div className="glass" style={{ padding: '1.5rem' }}>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '2.25rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '0.25rem' }}>{value}</p>
      {sub && <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{sub}</p>}
    </div>
  )
}

function AdminLogin({ onLogin, initialError }) {
  const [key, setKey] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!key.trim()) return
    localStorage.setItem(ADMIN_KEY_STORAGE, key)
    onLogin(key)
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 380, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔐</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Growth Dashboard</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Admin access only</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="glass" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="admin-key">Admin Key</label>
              <input id="admin-key" type="password" className="input" placeholder="Enter admin key"
                value={key} onChange={e => setKey(e.target.value)} />
              {initialError && <p className="error-msg" style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>{initialError}</p>}
            </div>
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Access Dashboard</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem(ADMIN_KEY_STORAGE))
  const [adminKey, setAdminKey] = useState(localStorage.getItem(ADMIN_KEY_STORAGE) || '')
  const [stats, setStats] = useState(null)
  const [byDay, setByDay] = useState([])
  const [bySource, setBySource] = useState([])
  const [topRefs, setTopRefs] = useState([])
  const [funnel, setFunnel] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  function handleLogin(key) {
    setAdminKey(key)
    setAuthed(true)
    setErr(null)
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    Promise.all([
      adminApi.getStats(),
      adminApi.getRegistrationsByDay(),
      adminApi.getSourceBreakdown(),
      adminApi.getTopReferrers(),
      adminApi.getFunnel(),
    ]).then(([s, d, src, refs, fun]) => {
      setStats(s)
      setByDay(d.data || [])
      setBySource(src.data || [])
      setTopRefs(refs.data || [])
      setFunnel(fun.data || [])
      setLoading(false)
    }).catch(e => {
      if (e.response?.status === 401) {
        setAuthed(false)
        localStorage.removeItem(ADMIN_KEY_STORAGE)
        setErr('Invalid admin key.')
      } else {
        setErr('Failed to load dashboard data.')
      }
      setLoading(false)
    })
  }, [authed])

  if (!authed) return <AdminLogin onLogin={handleLogin} initialError={err} />
  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={40} /></div>
  if (err) return <div style={{ textAlign: 'center', padding: '4rem', color: '#f87171' }}>{err}</div>

  const FUNNEL_LABELS = {
    landing_view: 'Landing View',
    readiness_check_started: 'Readiness Started',
    readiness_check_completed: 'Readiness Done',
    registration_started: 'Reg. Started',
    registration_completed: 'Registered',
    referral_link_viewed: 'Passport Viewed',
    share_clicked: 'Share Clicked',
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>📊 Growth Dashboard</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>AI Project Sprint — campaign analytics</p>
      </div>

      {/* Stat tiles */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Total Registrations" value={stats.total_registrations} color="#6366f1" />
          <StatCard label="Referral Registrations" value={stats.referral_registrations} sub={`${stats.total_registrations ? Math.round(stats.referral_registrations / stats.total_registrations * 100) : 0}% of total`} color="#8b5cf6" />
          <StatCard label="Organic Registrations" value={stats.organic_registrations} color="#06b6d4" />
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Registrations by day */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Registrations by Day</h2>
          {byDay.length === 0 ? <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>No data yet</p> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byDay}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f1623', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Source breakdown */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Registrations by Source</h2>
          {bySource.length === 0 ? <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>No data yet</p> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bySource} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={70} label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}>
                  {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f1623', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Funnel + Top Referrers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Funnel */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Acquisition Funnel</h2>
          {funnel.length === 0 ? <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>No data yet</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {funnel.map((step, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{FUNNEL_LABELS[step.step] || step.step}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{step.count}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${funnel[0].count > 0 ? (step.count / funnel[0].count) * 100 : 0}%` }} />
                  </div>
                  {i > 0 && step.drop_off_pct > 0 && (
                    <span style={{ fontSize: '0.7rem', color: '#f87171' }}>↓ {step.drop_off_pct}% drop-off</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top referrers */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Top Referrers</h2>
          {topRefs.length === 0 ? <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>No referrals yet</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['#', 'Name', 'Code', 'Refs'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.25rem', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: 500, borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topRefs.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.625rem 0.25rem', color: 'var(--color-muted)' }}>{i + 1}</td>
                    <td style={{ padding: '0.625rem 0.25rem', fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: '0.625rem 0.25rem', color: 'var(--color-primary)', fontFamily: 'monospace' }}>{r.referral_code}</td>
                    <td style={{ padding: '0.625rem 0.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
