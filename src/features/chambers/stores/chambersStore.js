import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chambersApi } from '../api/chambersApi'

export const useChambersStore = defineStore('chambers', () => {
  const chambers = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    try {
      const { data } = await chambersApi.getAll()
      chambers.value = data.chambers
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load chambers'
    } finally {
      loading.value = false
    }
  }

  async function createChamber(payload) {
    loading.value = true
    try {
      const { data } = await chambersApi.create(payload)
      chambers.value.push(data.chamber)
      return data.chamber
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create chamber'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateChamber(id, payload) {
    loading.value = true
    try {
      const { data } = await chambersApi.update(id, payload)
      const idx = chambers.value.findIndex(c => c.chamberId === id)
      if (idx !== -1) chambers.value[idx] = data.chamber
      return data.chamber
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update chamber'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteChamber(id) {
    try {
      await chambersApi.delete(id)
      chambers.value = chambers.value.filter(c => c.chamberId !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete chamber'
      throw err
    }
  }

  return { chambers, loading, error, fetchAll, createChamber, updateChamber, deleteChamber }
})
