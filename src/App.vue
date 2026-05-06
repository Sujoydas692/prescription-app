<template>
  <RouterView />
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { useAuthStore } from "@/features/auth/stores/authStore";

const authStore = useAuthStore();
const isDarkMode = ref(false);

// Dark mode management
const checkDarkMode = () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode !== null) {
    isDarkMode.value = savedMode === "true";
  } else {
    // Check system preference
    isDarkMode.value = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
  }
  applyDarkMode();
};

const applyDarkMode = () => {
  const htmlElement = document.documentElement;
  if (isDarkMode.value) {
    htmlElement.classList.add("dark");
    htmlElement.classList.remove("force-light");
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("force-light");
  }
  localStorage.setItem("darkMode", isDarkMode.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  applyDarkMode();
};

onMounted(() => {
  // Refresh user profile if logged in
  if (authStore.isAuthenticated) {
    authStore.fetchMe();
  }

  // Initialize dark mode
  checkDarkMode();

  // Watch for system preference changes
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemPreferenceChange = (e) => {
    // Only apply system preference if user hasn't manually set a preference
    if (localStorage.getItem("darkMode") === null) {
      isDarkMode.value = e.matches;
      applyDarkMode();
    }
  };

  darkModeMediaQuery.addEventListener("change", handleSystemPreferenceChange);

  // Optional: Save reference for cleanup if needed (though not strictly necessary as app never unmounts)
  // For completeness, you could store this in a variable and remove in onUnmounted if you add it
});

// Provide dark mode functionality to child components
provide("toggleDarkMode", toggleDarkMode);
provide("isDarkMode", isDarkMode);
</script>

<style>
/* Global transitions for smooth dark mode switching */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease,
    fill 0.3s ease,
    stroke 0.3s ease;
}

/* Prevent transition on page load to avoid flash */
.no-transition {
  transition: none !important;
}
</style>
