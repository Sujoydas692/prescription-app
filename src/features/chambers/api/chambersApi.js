import http from '@/shared/utils/http'

export const chambersApi = {
  /**
   * Get all chambers for current doctor
   * GET /api/chambers
   */
  getAll() {
    return http.get('/chambers')
  },

  /**
   * Get chamber by ID
   * GET /api/chambers/:id
   */
  getById(id) {
    return http.get(`/chambers/${id}`)
  },

  /**
   * Create chamber
   * POST /api/chambers
   * Body: { name, address, thana_id }
   */
  create(payload) {
    return http.post('/chambers', payload)
  },

  /**
   * Update chamber
   * PUT /api/chambers/:id
   */
  update(id, payload) {
    return http.put(`/chambers/${id}`, payload)
  },

  /**
   * Delete chamber
   * DELETE /api/chambers/:id
   */
  delete(id) {
    return http.delete(`/chambers/${id}`)
  }
}
