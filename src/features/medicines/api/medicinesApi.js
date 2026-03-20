import http from '@/shared/utils/http'

export const medicinesApi = {
  // ── Drug Generic ──────────────────────────────────────────────
  /** GET /api/medicines/generics?q= */
  searchGenerics(query = '') {
    return http.get('/medicines/generics', { params: { q: query } })
  },
  getGenericById(id) {
    return http.get(`/medicines/generics/${id}`)
  },
  createGeneric(payload) {
    return http.post('/medicines/generics', payload)
  },
  updateGeneric(id, payload) {
    return http.put(`/medicines/generics/${id}`, payload)
  },
  deleteGeneric(id) {
    return http.delete(`/medicines/generics/${id}`)
  },

  // ── Drug Brand ────────────────────────────────────────────────
  /** GET /api/medicines/brands?q=&genericId= */
  searchBrands(params = {}) {
    return http.get('/medicines/brands', { params })
  },
  getBrandById(id) {
    return http.get(`/medicines/brands/${id}`)
  },
  createBrand(payload) {
    return http.post('/medicines/brands', payload)
  },
  updateBrand(id, payload) {
    return http.put(`/medicines/brands/${id}`, payload)
  },
  deleteBrand(id) {
    return http.delete(`/medicines/brands/${id}`)
  },

  // ── Companies ─────────────────────────────────────────────────
  getCompanies() {
    return http.get('/medicines/companies')
  },

  // ── Indications ───────────────────────────────────────────────
  getIndications() {
    return http.get('/medicines/indications')
  },

  // ── Therapeutic classes ───────────────────────────────────────
  getTherapeuticClasses() {
    return http.get('/medicines/therapeutic-classes')
  }
}
