import api from '../api/client'

let sessionId = sessionStorage.getItem('aps_session_id')
if (!sessionId) {
  sessionId = crypto.randomUUID()
  sessionStorage.setItem('aps_session_id', sessionId)
}

/**
 * Fire an analytics event (non-blocking, swallows errors).
 * @param {string} eventName
 * @param {object} properties
 */
export async function fireEvent(eventName, properties = {}) {
  try {
    await api.post('/events', {
      event_name: eventName,
      session_id: sessionId,
      referral_code: localStorage.getItem('aps_ref') || undefined,
      properties,
    })
  } catch {
    // swallow — analytics must never break the flow
  }
}
