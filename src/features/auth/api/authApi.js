import http from '@/shared/utils/http'

export const authApi = {
  /**
   * Login with Google OAuth token
   * POST /api/user/login
   * Body: { provider: "google", token: googleToken }
   * Returns: { success: true, message: "Success", data: { token: string, role: string } }
   */
  googleLogin(googleToken) {
    return http.post('/user/login', { 
      provider: "google", 
      token: googleToken 
    })
  },

  /**
   * Get current doctor profile
   * GET /api/user/me
   * Returns: { success: true, data: { doctor } }
   */
  getMe() {
    return http.get('/user/me')
  },

  /**
   * Logout
   * POST /api/auth/logout
   */
  logout() {
    return http.post('/auth/logout')
  }
}