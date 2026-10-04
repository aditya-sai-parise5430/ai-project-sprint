import api from './client'

const adminApi = {
  headers: () => ({ 'X-Admin-Key': localStorage.getItem('aps_admin_key') || '' }),

  async getStats() {
    const res = await api.get('/admin/stats', { headers: this.headers() })
    return res.data
  },
  async getRegistrationsByDay() {
    const res = await api.get('/admin/registrations-by-day', { headers: this.headers() })
    return res.data
  },
  async getSourceBreakdown() {
    const res = await api.get('/admin/source-breakdown', { headers: this.headers() })
    return res.data
  },
  async getTopReferrers() {
    const res = await api.get('/admin/top-referrers', { headers: this.headers() })
    return res.data
  },
  async getFunnel() {
    const res = await api.get('/admin/funnel', { headers: this.headers() })
    return res.data
  },
}

export default adminApi
