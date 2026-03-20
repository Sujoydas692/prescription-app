import { defineStore } from 'pinia'
import { ref } from 'vue'
import { prescriptionsApi } from '../api/prescriptionsApi'

export const usePrescriptionsStore = defineStore('prescriptions', () => {
  const prescriptions = ref([])
  const currentPrescription = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)

  async function fetchAll(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await prescriptionsApi.getAll(params)
      prescriptions.value = data.prescriptions
      total.value = data.total || data.prescriptions.length
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load prescriptions'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      const { data } = await prescriptionsApi.getById(id)
      currentPrescription.value = data.prescription
      return data.prescription
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load prescription'
    } finally {
      loading.value = false
    }
  }

  async function createPrescription(payload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await prescriptionsApi.create(payload)
      prescriptions.value.unshift(data.prescription)
      return data.prescription
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create prescription'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePrescription(id, payload) {
    loading.value = true
    try {
      const { data } = await prescriptionsApi.update(id, payload)
      const idx = prescriptions.value.findIndex(p => p.prescriptionId === id)
      if (idx !== -1) prescriptions.value[idx] = data.prescription
      return data.prescription
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update prescription'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePrescription(id) {
    try {
      await prescriptionsApi.delete(id)
      prescriptions.value = prescriptions.value.filter(p => p.prescriptionId !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete prescription'
      throw err
    }
  }

  async function fetchByPatient(patientId) {
    try {
      const { data } = await prescriptionsApi.getByPatient(patientId)
      return data.prescriptions
    } catch {
      return []
    }
  }

  return { prescriptions, currentPrescription, loading, error, total, fetchAll, fetchById, createPrescription, updatePrescription, deletePrescription, fetchByPatient }
})
