import http from '@/shared/utils/http'

export const prescriptionsApi = {
  /**
   * Get all prescriptions (filtered by doctor via token)
   * GET /api/prescriptions?patientId=&chamberId=&page=&limit=
   */
  getAll(params = {}) {
    return http.get('/prescriptions', { params })
  },

  /**
   * Get prescription by ID
   * GET /api/prescriptions/:id
   */
  getById(id) {
    return http.get(`/prescriptions/${id}`)
  },

  /**
   * Create prescription
   * POST /api/prescriptions
   * Body: {
   *   chamberId, patientId, visitDate, chiefComplaints, diagnosis, nextVisitDate,
   *   medicines: [{ brandId, dosage, duration, instruction }],
   *   tests: [{ testName }]
   * }
   */
  create(payload) {
    return http.post('/prescriptions', payload)
  },

  /**
   * Update prescription
   * PUT /api/prescriptions/:id
   */
  update(id, payload) {
    return http.put(`/prescriptions/${id}`, payload)
  },

  /**
   * Delete prescription
   * DELETE /api/prescriptions/:id
   */
  delete(id) {
    return http.delete(`/prescriptions/${id}`)
  },

  /**
   * Get patient prescription history
   * GET /api/prescriptions/patient/:patientId
   */
  getByPatient(patientId) {
    return http.get(`/prescriptions/patient/${patientId}`)
  }
}
