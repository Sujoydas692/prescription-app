import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const doctor = ref(JSON.parse(localStorage.getItem('doctor') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const doctorName = computed(() => doctor.value?.fullName || '')
  const doctorDesignation = computed(() => doctor.value?.designation || '')
  const doctorEmail = computed(() => doctor.value?.email || '')
  const doctorPhone = computed(() => doctor.value?.phone || '')
  const doctorRegNo = computed(() => doctor.value?.regNo || '')

  function setAuth(data) {
    // API response structure: { token, role, doctor? }
    // Your API returns: { token: "...", role: "doctor" }
    // And optionally doctor details in separate response
    token.value = data.token
    
    // If doctor data is included in response
    if (data.doctor) {
      doctor.value = data.doctor
      localStorage.setItem('doctor', JSON.stringify(data.doctor))
    }
    
    localStorage.setItem('token', data.token)
    localStorage.setItem('user_role', data.role || 'doctor')
  }

  // Single login method - both login and register combined
  async function loginWithGoogle(googleToken) {
    loading.value = true
    error.value = null
    
    try {
      // Your API expects: { provider: "google", token: googleToken }
      const { data } = await authApi.googleLogin(googleToken)
      
      // Check if login was successful
      if (data.success) {
        // Store token and role from response
        setAuth({
          token: data.data.token,
          role: data.data.role,
          doctor: data.data.doctor || null
        })
        
        // Fetch doctor details if needed (if not included in login response)
        if (!data.data.doctor) {
          await fetchDoctorProfile()
        }
        
        return data
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch doctor profile using the token
  async function fetchDoctorProfile() {
    try {
      const { data } = await authApi.getMe()
      if (data.success) {
        doctor.value = data.data
        localStorage.setItem('doctor', JSON.stringify(data.data))
      }
    } catch (err) {
      console.error('Failed to fetch doctor profile:', err)
      // If fetching profile fails, token might be invalid
      if (err.response?.status === 401) {
        logout()
      }
    }
  }

  // Optional: Check if token is still valid
  async function checkAuth() {
    if (!token.value) return false
    
    try {
      await fetchDoctorProfile()
      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    token.value = null
    doctor.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('doctor')
    localStorage.removeItem('user_role')
  }

  return { 
    doctor, 
    token, 
    loading, 
    error, 
    isAuthenticated, 
    doctorName,
    doctorDesignation,
    doctorEmail,
    doctorPhone,
    doctorRegNo,
    loginWithGoogle,
    fetchDoctorProfile,
    checkAuth,
    logout 
  }
})