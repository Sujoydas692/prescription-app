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

  function setAuth(data) {
    token.value = data.token
    doctor.value = data.doctor
    localStorage.setItem('token', data.token)
    localStorage.setItem('doctor', JSON.stringify(data.doctor))
  }

  async function googleLogin(googleToken) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.googleLogin(googleToken)
      setAuth(data)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function googleRegister(googleToken) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.googleRegister(googleToken)
      setAuth(data)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    try {
      const { data } = await authApi.getMe()
      doctor.value = data.doctor
      localStorage.setItem('doctor', JSON.stringify(data.doctor))
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    doctor.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('doctor')
  }

  return { doctor, token, loading, error, isAuthenticated, doctorName, googleLogin, googleRegister, fetchMe, logout }
})
