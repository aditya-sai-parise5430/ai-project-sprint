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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

        {/* ── Left Column: Project & Build Plan ─────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ── Project Card ─────────────────────────────────────── */}
          <div className="glass animate-fade-in delay-100" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎯</span>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Your Recommended Project</h2>
            </div>

            <div style={{
              padding: '1.25rem', borderRadius: '0.75rem',
              background: 'var(--gradient-card)',
              border: '1px solid var(--color-border)',
              marginBottom: '1.25rem',
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.625rem', lineHeight: 1.3 }}>{project.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge" style={{ background: project.difficulty === 'beginner' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: project.difficulty === 'beginner' ? '#6ee7b7' : '#fcd34d', borderColor: project.difficulty === 'beginner' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)' }}>
                  {project.difficulty}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>60 Min Build</span>
              </div>
            </div>

            <p style={{ color: 'var(--color-text)', opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {project.description}
            </p>

            <div style={{ padding: '1rem', borderRadius: '0.625rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.6 }}>
                💡 <strong>Why this fits you:</strong> {project.why_description}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>TECH STACK</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tech_stack.map(t => <StackBadge key={t} tech={t} />)}
              </div>
            </div>
          </div>

          {/* ── 60-Min Build Plan ─────────────────────────────────── */}
          <div className="glass animate-fade-in delay-200" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Clock size={18} color="#06b6d4" />
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>60-Minute Build Plan</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {project.build_plan.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', paddingBottom: i < project.build_plan.length - 1 ? '1.5rem' : 0, position: 'relative' }}>
                  {/* Timeline connector */}
                  {i < project.build_plan.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 15, top: 32, bottom: 0, width: 2,
                      background: 'linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(99,102,241,0.1))',
                    }} />
                  )}
                  {/* Step number */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--color-surface)', border: '2px solid var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)',
                    zIndex: 1, boxShadow: '0 0 10px rgba(99,102,241,0.2)'
                  }}>
                    {step.step}
                  </div>
                  <div style={{ paddingTop: '0.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{step.title}</span>
                      <span style={{ fontSize: '0.7rem', color: '#67e8f9', background: 'rgba(6,182,212,0.15)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 500 }}>
                        {step.duration_mins} mins
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Sharing & Community ─────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ── Share Your Build ──────────────────────────────────── */}
          <div className="glass animate-fade-in delay-300" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Share2 size={18} color="#6366f1" />
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Share Your Build</h2>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Your project is ready. Share it with friends, coding communities, and your college network to track referrals and unlock milestones.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button className="btn-whatsapp" style={{ width: '100%' }} onClick={handleWhatsApp}>
                Share on WhatsApp
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  className="btn-discord" 
                  onClick={async () => {
                    import('../utils/referral').then(m => {
                      navigator.clipboard.writeText(decodeURIComponent(m.buildDiscordShareUrl(user.referral_code)));
                      toast.success("Discord message copied! Paste it in your server.");
                      fireEvent('share_clicked', { referral_code: user.referral_code, channel: 'discord' });
                    })
                  }}
                >
                  Discord
                </button>
                <button 
                  className="btn-linkedin" 
                  onClick={() => {
                    import('../utils/referral').then(m => {
                      window.open(m.buildLinkedInShareUrl(user.referral_code), '_blank');
                      fireEvent('share_clicked', { referral_code: user.referral_code, channel: 'linkedin' });
                    })
                  }}
                >
                  LinkedIn
                </button>
              </div>
            </div>

            {/* Referral link */}
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '0.625rem',
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '0.75rem',
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {referralLink}
              </span>
              <button className="btn-copy" onClick={handleCopy} style={{ flexShrink: 0 }}>
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
          </div>

          {/* ── Referral Milestones ─────────────────────────────── */}
          <div className="glass animate-fade-in delay-400" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="#f59e0b" />
                <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Milestones</h2>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {user.referral_count} <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 500 }}>Refs</span>
              </div>
            </div>

            {nextM && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Next: {nextM.emoji} {nextM.label}</span>
                  <span style={{ color: 'var(--color-accent)' }}>{nextM.count - user.referral_count} more</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(user.referral_count / nextM.count) * 100}%` }} />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {MILESTONES.map(m => (
                <MilestoneBadge key={m.count} milestone={m} achieved={user.referral_count >= m.count} />
              ))}
            </div>
          </div>

          {/* ── Where to Share Micro-section ─────────────────────── */}
          <div className="animate-fade-in delay-500" style={{ padding: '0.5rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Where should you share?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem' }}>WhatsApp</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>College / class groups</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem' }}>Discord</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>AI / coding communities</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem' }}>LinkedIn</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Professional network</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem' }}>College Clubs</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Student communities</div>
              </div>
            </div>
          </div>

          {/* ── Workshop Info ─────────────────────────────────────── */}
          <div className="glass-light animate-fade-in delay-600" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '2rem' }}>📅</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{workshop.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{workshop.date} · {workshop.time} · {workshop.platform}</p>
            </div>
            {workshop.join_link !== '#' ? (
              <a href={workshop.join_link} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flexShrink: 0, fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                <ExternalLink size={14} /> Join
              </a>
            ) : (
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-muted)', border: 'none' }}>
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
