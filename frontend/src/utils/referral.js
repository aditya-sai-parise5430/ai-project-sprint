const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'
const STORAGE_KEY = 'aps_ref'

/**
 * Extract ?ref= param from the current URL and persist it in localStorage.
 * Should be called once on app load.
 */
export function extractAndPersistRef() {
  const params = new URLSearchParams(window.location.search)
  const ref = params.get('ref')
  if (ref) {
    localStorage.setItem(STORAGE_KEY, ref.toUpperCase())
  }
  return localStorage.getItem(STORAGE_KEY)
}

export function getStoredRef() {
  return localStorage.getItem(STORAGE_KEY)
}

export function clearStoredRef() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Build the WhatsApp share URL for a given referral code.
 */
export function buildWhatsAppShareUrl(referralCode) {
  const link = `${SITE_URL}/?ref=${referralCode}`
  const message = encodeURIComponent(
    `Hey! 👋 I just signed up for a free AI workshop where we build a real AI project in just 60 minutes.\n\n` +
    `🚀 *Build Your First AI Project in 60 Minutes* — completely free!\n\n` +
    `Join me here: ${link}\n\n` +
    `Use my link and we both track our referrals. Let's build something together!`
  )
  return `https://wa.me/?text=${message}`
}

/**
 * Build the referral link for a code.
 */
export function buildReferralLink(referralCode) {
  return `${SITE_URL}/?ref=${referralCode}`
}

/** Milestone definitions */
export const MILESTONES = [
  { count: 1,  emoji: '🔥', label: 'Spark',           desc: 'First referral!' },
  { count: 5,  emoji: '⚡', label: 'Builder',         desc: '5 friends joined' },
  { count: 10, emoji: '🚀', label: 'Launcher',        desc: '10 friends joined' },
  { count: 20, emoji: '🏆', label: 'Sprint Champion', desc: '20 friends joined' },
]

export function getAchievedMilestones(count) {
  return MILESTONES.filter(m => count >= m.count)
}

export function getNextMilestone(count) {
  return MILESTONES.find(m => count < m.count) || null
}
