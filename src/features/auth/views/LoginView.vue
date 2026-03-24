<template>
  <div
    class="login-bg h-screen relative overflow-hidden flex items-center justify-center"
  >
    <!-- Decorative blobs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
        style="
          background: radial-gradient(
            circle,
            rgba(244, 165, 138, 0.6) 0%,
            transparent 70%
          );
          filter: blur(50px);
        "
      />
      <div
        class="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full"
        style="
          background: radial-gradient(
            circle,
            rgba(237, 213, 232, 0.55) 0%,
            transparent 70%
          );
          filter: blur(55px);
        "
      />
      <div
        class="absolute top-1/3 right-1/4 w-72 h-72 rounded-full"
        style="
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 70%
          );
          filter: blur(30px);
        "
      />
    </div>

    <!-- Main Container -->
    <div
      class="relative w-full fade-in-up"
      :class="isMobile ? 'max-w-full px-6' : 'max-w-[600px] mx-5'"
    >
      <!-- Card shell -->
      <div
        :class="
          isMobile
            ? 'bg-transparent border-0 shadow-none p-0'
            : 'rounded-[24px] px-9 py-11'
        "
        :style="isMobile ? '' : cardStyle"
      >
        <!-- Logo -->
        <div
          class="flex flex-col items-center"
          :class="isMobile ? 'mb-10 mt-8' : 'mb-2'"
        >
          <div class="mb-1">
            <svg
              width="58"
              height="58"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="url(#logoRing)"
                stroke-width="2.5"
                fill="none"
                stroke-dasharray="6 3"
              />
              <rect
                x="22"
                y="14"
                width="12"
                height="28"
                rx="6"
                fill="url(#logoCross)"
              />
              <rect
                x="14"
                y="22"
                width="28"
                height="12"
                rx="6"
                fill="url(#logoCross)"
              />
              <circle cx="28" cy="28" r="4" fill="white" opacity="0.9" />
              <defs>
                <linearGradient
                  id="logoRing"
                  x1="0"
                  y1="0"
                  x2="56"
                  y2="56"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stop-color="#EE8875" />
                  <stop offset="100%" stop-color="#2E6B8B" />
                </linearGradient>
                <linearGradient
                  id="logoCross"
                  x1="14"
                  y1="14"
                  x2="42"
                  y2="42"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stop-color="#EE8875" />
                  <stop offset="100%" stop-color="#2E6B8B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1
            class="text-[26px] font-extrabold tracking-tight"
            style="font-family: &quot;Nunito&quot;, sans-serif; color: #1e2a4a"
          >
            Prescription App
          </h1>
          <p
            class="mt-1 text-center text-[13px] font-medium leading-snug"
            style="color: #5a6282; padding-bottom: 38px"
          >
            Generate Your Prescription Easily
          </p>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-3 mb-1">
          <div
            class="flex-1 h-px"
            style="background: rgba(30, 42, 74, 0.12)"
          ></div>
          <span
            class="text-[10px] font-bold uppercase tracking-[0.15em]"
            style="color: #5a6282"
            >Continue with</span
          >
          <div
            class="flex-1 h-px"
            style="background: rgba(30, 42, 74, 0.12)"
          ></div>
        </div>

        <!-- Google Sign In Button -->
        <button
          @click="handleGoogleLogin"
          :disabled="authStore.loading"
          class="w-full flex items-center justify-center gap-2 rounded-[12px] font-bold text-[14px] transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
          style="
            padding: 14px 10px;
            background: rgba(255, 255, 255, 0.75);
            border: 1.5px solid rgba(255, 255, 255, 0.9);
            color: #1e2a4a;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            backdrop-filter: blur(12px);
            font-family: &quot;Nunito&quot;, sans-serif;
          "
          @mouseover="
            (e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.95)')
          "
          @mouseout="
            (e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.75)')
          "
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.22c1.89-1.74 2.99-4.3 2.99-7.31z"
              fill="#4285F4"
            />
            <path
              d="M10 20c2.7 0 4.96-.89 6.61-2.42l-3.22-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.75-5.59-4.12H1.1v2.58A10 10 0 0 0 10 20z"
              fill="#34A853"
            />
            <path
              d="M4.41 11.91A6.01 6.01 0 0 1 4.1 10c0-.66.11-1.3.31-1.91V5.51H1.1A10 10 0 0 0 0 10c0 1.61.39 3.14 1.1 4.49l3.31-2.58z"
              fill="#FBBC05"
            />
            <path
              d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.96 9.96 0 0 0 10 0 10 10 0 0 0 1.1 5.51L4.41 8.1C5.2 5.72 7.4 3.96 10 3.96z"
              fill="#EA4335"
            />
          </svg>
          <span>{{
            authStore.loading ? "Signing in..." : "Sign in with Google"
          }}</span>
        </button>

        <!-- Error -->
        <p
          v-if="authStore.error"
          class="mt-3 text-center text-[12px] text-red-400 font-medium"
        >
          {{ authStore.error }}
        </p>

        <!-- Footer -->
        <p
          class="mt-6 text-center text-[11px] leading-relaxed"
          style="color: #5a6282"
        >
          By continuing you agree to our
          <span
            class="underline cursor-pointer hover:text-[#5A6282] transition-colors"
            >Terms</span
          >
          &amp;
          <span
            class="underline cursor-pointer hover:text-[#5A6282] transition-colors"
            >Privacy Policy</span
          >
        </p>
      </div>

      <!-- Bottom glow — desktop only -->
      <div
        v-if="!isMobile"
        class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 rounded-full"
        style="background: rgba(238, 136, 117, 0.35); filter: blur(20px)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const windowWidth = ref(window.innerWidth);
const onResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  initGoogle();
});

onUnmounted(() => window.removeEventListener("resize", onResize));

const isMobile = computed(() => windowWidth.value < 768);

const cardStyle = `
  background: rgb(253 253 253 / 28%);
  backdrop-filter: blur(36px) saturate(1.6);
  -webkit-backdrop-filter: blur(36px) saturate(1.6);
  box-shadow: 0 20px 60px rgba(180,80,50,0.15), 0 4px 20px rgba(0,0,0,0.08), inset 0 0px 0 rgba(255,255,255,0.95);
  padding: 50px 30px 50px 30px;
`;

function initGoogle() {
  if (window.google?.accounts?.oauth2) {
    return;
  }
  setTimeout(initGoogle, 100);
}

// Single function for Google Login (both login and register use same endpoint)
function handleGoogleLogin() {
  if (!window.google?.accounts?.oauth2) {
    toast.error("Google services not loaded. Please refresh.");
    return;
  }

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: "email profile",
    callback: async (response) => {
      if (response.error) {
        console.error("Google error:", response.error);
        toast.error("Google authentication failed.");
        return;
      }

      try {
        // Call the login API with Google token
        await authStore.loginWithGoogle(response.access_token);

        // Check role from response
        if (authStore.userRole === "doctor") {
          toast.success("Login Successful!");
          router.push("/dashboard");
        } else {
          toast.error("Access denied. Only doctors can login.");
          authStore.logout();
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed. Please try again.");
      }
    },
  });

  client.requestAccessToken();
}
</script>
