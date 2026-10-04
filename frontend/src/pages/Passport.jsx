import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Copy, Check, Share2, ExternalLink, Clock, Award } from 'lucide-react'
import { getPassport } from '../api'
import { buildWhatsAppShareUrl, buildReferralLink, MILESTONES } from '../utils/referral'
import { fireEvent } from '../utils/analytics'
import Spinner from '../components/common/Spinner'

function StackBadge({ tech }) {
  return (
    <span style={{
      padding: '0.3rem 0.75rem', borderRadius: '999px',
      background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
      color: '#67e8f9', fontSize: '0.78rem', fontWeight: 500,
    }}>
      {tech}
    </span>
  )
}

function MilestoneBadge({ milestone, achieved }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
      opacity: achieved ? 1 : 0.3,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: achieved ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
        border: `2px solid ${achieved ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem',
      }}>
        {milestone.emoji}
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: achieved ? 'var(--color-text)' : 'var(--color-muted)' }}>
        {milestone.label}
      </span>
      <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{milestone.count} refs</span>
    </div>
  )
}

export default function Passport() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || localStorage.getItem('aps_passport_token')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/login'); return }

    getPassport(token)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Passport not found. Check your link.'); setLoading(false) })
  }, [token])

  async function handleCopy() {
    const link = buildReferralLink(data.user.referral_code)
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    fireEvent('referral_link_copied', { referral_code: data.user.referral_code })
    toast.success('Referral link copied!')
  }

  function handleWhatsApp() {
    const url = buildWhatsAppShareUrl(data.user.referral_code)
    fireEvent('share_clicked', { referral_code: data.user.referral_code, channel: 'whatsapp' })
    window.open(url, '_blank')
  }

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={40} /></div>

  if (error) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <p style={{ color: '#f87171', marginBottom: '1rem' }}>⚠️ {error}</p>
        <button className="btn-secondary" onClick={() => navigate('/login')}>Find My Passport</button>
      </div>
    </div>
  )

  const { user, project, workshop, milestones } = data
  const referralLink = buildReferralLink(user.referral_code)
  const nextM = MILESTONES.find(m => user.referral_count < m.count)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="glass animate-fade-in" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
          background: 'var(--gradient-hero)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem', fontWeight: 700,
        }}>
          {user.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.name}</h1>
            <span className="badge badge-success">Registered ✓</span>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{user.college} · {user.year} Year</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>AI Project Passport</div>
          <div style={{ fontFamily: 'Space Grotesk, monospace', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
            #{user.referral_code}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* ── Project Card ─────────────────────────────────────── */}
        <div className="glass animate-fade-in delay-100" style={{ padding: '1.75rem', gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Your Recommended Project</h2>
          </div>

          <div style={{
            padding: '1rem', borderRadius: '0.625rem',
            background: 'var(--gradient-card)',
            border: '1px solid var(--color-border)',
            marginBottom: '1rem',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.title}</h3>
            <span className="badge" style={{ background: project.difficulty === 'beginner' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: project.difficulty === 'beginner' ? '#6ee7b7' : '#fcd34d', borderColor: project.difficulty === 'beginner' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)' }}>
              {project.difficulty}
            </span>
          </div>

          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            {project.description}
          </p>

          <div style={{ padding: '0.875rem', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.825rem', color: '#a5b4fc', lineHeight: 1.6 }}>
              💡 <strong>Why this project?</strong> {project.why_description}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.625rem', fontWeight: 500 }}>TECH STACK</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tech_stack.map(t => <StackBadge key={t} tech={t} />)}
            </div>
          </div>
        </div>

        {/* ── 60-Min Build Plan ─────────────────────────────────── */}
        <div className="glass animate-fade-in delay-200" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="#06b6d4" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>60-Minute Build Plan</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {project.build_plan.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', paddingBottom: i < project.build_plan.length - 1 ? '1.25rem' : 0, position: 'relative' }}>
                {/* Timeline connector */}
                {i < project.build_plan.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 15, top: 30, bottom: 0, width: 2,
                    background: 'linear-gradient(to bottom, rgba(99,102,241,0.3), rgba(99,102,241,0.05))',
                  }} />
                )}
                {/* Step number */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)',
                  zIndex: 1,
                }}>
                  {step.step}
                </div>
                <div style={{ paddingTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', background: 'rgba(6,182,212,0.1)', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                      {step.duration_mins}m
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Referral Card ─────────────────────────────────────── */}
        <div className="glass animate-fade-in delay-300" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Share2 size={18} color="#6366f1" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Share & Track Referrals</h2>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Share your link. Every friend who registers adds to your count.
          </p>

          {/* Referral count */}
          <div style={{
            textAlign: 'center', padding: '1.25rem', borderRadius: '0.75rem',
            background: 'var(--gradient-card)', border: '1px solid var(--color-border)',
            marginBottom: '1.25rem',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user.referral_count}
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              friend{user.referral_count !== 1 ? 's' : ''} referred
            </div>
            {nextM && (
              <div style={{ marginTop: '0.875rem' }}>
                <div className="progress-track" style={{ maxWidth: 200, margin: '0 auto 0.5rem' }}>
                  <div className="progress-fill" style={{ width: `${(user.referral_count / nextM.count) * 100}%` }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  {nextM.count - user.referral_count} more for {nextM.emoji} {nextM.label}
                </span>
              </div>
            )}
          </div>

          {/* Referral link */}
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.5rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '0.75rem', marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {referralLink}
            </span>
            <button id="copy-referral-link" className="btn-copy" onClick={handleCopy} style={{ flexShrink: 0 }}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>

          {/* WhatsApp share */}
          <button id="whatsapp-share" className="btn-whatsapp" style={{ width: '100%' }} onClick={handleWhatsApp}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </button>
        </div>

        {/* ── Milestones ────────────────────────────────────────── */}
        <div className="glass animate-fade-in delay-400" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Award size={18} color="#f59e0b" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Referral Milestones</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            {MILESTONES.map(m => (
              <MilestoneBadge key={m.count} milestone={m} achieved={user.referral_count >= m.count} />
            ))}
          </div>
        </div>

        {/* ── Workshop Info ─────────────────────────────────────── */}
        <div className="glass-light animate-fade-in delay-500" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '2rem' }}>📅</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{workshop.title}</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{workshop.date} · {workshop.time} · {workshop.platform}</p>
          </div>
          {workshop.join_link !== '#' && (
            <a href={workshop.join_link} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flexShrink: 0, fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <ExternalLink size={14} /> Join
            </a>
          )}
        </div>

      </div>
    </div>
  )
}
