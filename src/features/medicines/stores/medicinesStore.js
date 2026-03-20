import { defineStore } from 'pinia'
import { ref } from 'vue'
import { medicinesApi } from '../api/medicinesApi'

export const useMedicinesStore = defineStore('medicines', () => {
  const generics = ref([])
  const brands = ref([])
  const companies = ref([])
  const indications = ref([])
  const therapeuticClasses = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    try {
      await Promise.all([
        fetchBrands(),
        fetchCompanies(),
        fetchIndications(),
        fetchTherapeuticClasses()
      ])
    } catch (err) {
      error.value = 'Failed to fetch data'
    } finally {
      loading.value = false
    }
  }

  async function fetchBrands(params = {}) {
    try {
      const { data } = await medicinesApi.searchBrands(params)
      brands.value = data.brands
      return data.brands
    } catch {
      return []
    }
  }

  async function searchBrands(params = {}) {
    try {
      const { data } = await medicinesApi.searchBrands(params)
      brands.value = data.brands
      return data.brands
    } catch {
      return []
    }
  }

  async function searchGenerics(query = '') {
    try {
      const { data } = await medicinesApi.searchGenerics(query)
      generics.value = data.generics
      return data.generics
    } catch (err) {
      error.value = 'Failed to search generics'
      return []
    }
  }

  async function fetchCompanies() {
    try {
      const { data } = await medicinesApi.getCompanies()
      companies.value = data.companies
    } catch {}
  }

  async function fetchIndications() {
    try {
      const { data } = await medicinesApi.getIndications()
      indications.value = data.indications
    } catch {}
  }

  async function fetchTherapeuticClasses() {
    try {
      const { data } = await medicinesApi.getTherapeuticClasses()
      therapeuticClasses.value = data.therapeuticClasses
    } catch {}
  }

  async function createGeneric(payload) {
    loading.value = true
    try {
      const { data } = await medicinesApi.createGeneric(payload)
      generics.value.unshift(data.generic)
      return data.generic
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create generic'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBrand(payload) {
    loading.value = true
    try {
      const { data } = await medicinesApi.createBrand(payload)
      brands.value.unshift(data.brand)
      return data.brand
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create brand'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { 
    generics, 
    brands, 
    companies, 
    indications, 
    therapeuticClasses, 
    loading, 
    error, 
    fetchAll,
    fetchBrands,
    searchGenerics, 
    searchBrands, 
    fetchCompanies, 
    fetchIndications, 
    fetchTherapeuticClasses, 
    createGeneric, 
    createBrand 
  }
})