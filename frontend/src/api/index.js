import api from './client'

export async function registerUser(data) {
  const res = await api.post('/register', data)
  return res.data
}

export async function findPassport(email) {
  const res = await api.post('/login', { email })
  return res.data
}

export async function getPassport(token) {
  const res = await api.get(`/passport/${token}`)
  return res.data
}

export async function validateRef(code) {
  try {
    const res = await api.get(`/validate-ref/${code}`)
    return res.data
  } catch {
    return { valid: false }
  }
}

export async function getProjects() {
  const res = await api.get('/projects')
  return res.data
}
