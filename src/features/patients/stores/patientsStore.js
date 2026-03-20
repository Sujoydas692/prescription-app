import { defineStore } from 'pinia'
import { ref } from 'vue'
import { patientsApi } from '../api/patientsApi'

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref([])
  const currentPatient = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)

  async function fetchAll(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await patientsApi.getAll(params)
      patients.value = data.patients
      total.value = data.total || data.patients.length
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch patients'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    error.value = null
    try {
      const { data } = await patientsApi.getById(id)
      currentPatient.value = data.patient
      return data.patient
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch patient'
    } finally {
      loading.value = false
    }
  }

  async function createPatient(payload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await patientsApi.create(payload)
      patients.value.unshift(data.patient)
      return data.patient
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create patient'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePatient(id, payload) {
    loading.value = true
    try {
      const { data } = await patientsApi.update(id, payload)
      const idx = patients.value.findIndex(p => p.patientId === id)
      if (idx !== -1) patients.value[idx] = data.patient
      if (currentPatient.value?.patientId === id) currentPatient.value = data.patient
      return data.patient
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update patient'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePatient(id) {
    try {
      await patientsApi.delete(id)
      patients.value = patients.value.filter(p => p.patientId !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete patient'
      throw err
    }
  }

  async function searchPatients(query) {
    try {
      const { data } = await patientsApi.search(query)
      return data.patients
    } catch {
      return []
    }
  }

  return { patients, currentPatient, loading, error, total, fetchAll, fetchById, createPatient, updatePatient, deletePatient, searchPatients }
})
