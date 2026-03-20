<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  // Refresh user profile if logged in
  if (authStore.isAuthenticated) {
    authStore.fetchMe()
  }
})
</script>
