import http from '@/shared/utils/http'

export const authApi = {
  /**
   * Login with Google OAuth token
   * POST /api/auth/google-login
   * Body: { googleToken: string }
   * Returns: { token, doctor: { doctorId, fullName, email, isVerified } }
   */
  googleLogin(googleToken) {
    return http.post('/auth/google-login', { googleToken })
  },

  /**
   * Register with Google OAuth token
   * POST /api/auth/google-register
   * Body: { googleToken: string }
   * Returns: { token, doctor: { doctorId, fullName, email } }
   */
  googleRegister(googleToken) {
    return http.post('/auth/google-register', { googleToken })
  },

  /**
   * Get current doctor profile
   * GET /api/auth/me
   * Returns: { doctor }
   */
  getMe() {
    return http.get('/auth/me')
  },

  /**
   * Logout
   * POST /api/auth/logout
   */
  logout() {
    return http.post('/auth/logout')
  }
}
