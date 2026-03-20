import http from '@/shared/utils/http'

export const patientsApi = {
  /**
   * Get all patients for the doctor
   * GET /api/patients
   * Returns: { patients: [{ patientId, mobileNumber, fullName, age }] }
   */
  getAll(params = {}) {
    return http.get('/patients', { params })
  },

  /**
   * Get patient by ID
   * GET /api/patients/:id
   */
  getById(id) {
    return http.get(`/patients/${id}`)
  },

  /**
   * Create patient
   * POST /api/patients
   * Body: { mobileNumber, fullName, age }
   */
  create(payload) {
    return http.post('/patients', payload)
  },

  /**
   * Update patient
   * PUT /api/patients/:id
   */
  update(id, payload) {
    return http.put(`/patients/${id}`, payload)
  },

  /**
   * Delete patient
   * DELETE /api/patients/:id
   */
  delete(id) {
    return http.delete(`/patients/${id}`)
  },

  /**
   * Search patients
   * GET /api/patients/search?q=name
   */
  search(query) {
    return http.get('/patients/search', { params: { q: query } })
  }
}
