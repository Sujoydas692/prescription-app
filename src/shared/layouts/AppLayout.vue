<template>
  <div class="flex h-screen overflow-hidden bg-[#F4F0EC]">
    <!-- Mobile Topbar -->
    <div class="mobile-topbar">
      <div class="mobile-logo">
        <svg
          class="mobile-logo-svg"
          width="32"
          height="32"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="28"
            cy="28"
            r="26"
            stroke="url(#mobileLogoRing)"
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
            fill="url(#mobileLogoCross)"
          />
          <rect
            x="14"
            y="22"
            width="28"
            height="12"
            rx="6"
            fill="url(#mobileLogoCross)"
          />
          <circle cx="28" cy="28" r="4" fill="white" opacity="0.9" />
          <defs>
            <linearGradient
              id="mobileLogoRing"
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
              id="mobileLogoCross"
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

      <div class="mobile-greeting">
        <span class="mobile-greeting-emoji">{{ greetingIcon }}</span>
        <span class="mobile-greeting-text">{{ greeting }}</span>
        <span class="top-date">{{ formattedDate }}</span>
      </div>

      <div class="mobile-top-actions">
        <button @click="$router.push('/settings')" class="mobile-top-btn">
          <IconSettings class="mobile-top-icon" />
        </button>

        <button @click="$router.push('/profile')" class="mobile-profile-btn">
          <span class="mobile-profile-badge">
            {{ authStore.doctorName?.charAt(0)?.toUpperCase() || "D" }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-items">
        <button
          v-for="item in navItems"
          :key="item.to"
          @click="handleMobileNav(item.to)"
          class="mobile-menu-item"
          :class="{ 'mobile-active': isActive(item.to) }"
        >
          <component :is="item.icon" class="mobile-menu-icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>

      <div class="mobile-menu-footer">
        <button @click="handleMobileNav('/settings')" class="mobile-menu-item">
          <IconSettings class="mobile-menu-icon" />
          <span>Settings</span>
        </button>

        <div class="mobile-profile" @click="handleMobileNav('/profile')">
          <div class="mobile-avatar">
            {{ authStore.doctorName?.charAt(0)?.toUpperCase() || "D" }}
          </div>
          <div class="mobile-profile-info">
            <div class="mobile-profile-name">
              Dr. {{ authStore.doctorName || "Doctor" }}
            </div>
            <div class="mobile-profile-role">
              {{ authStore.doctorDesignation || "MBBS, FCPS" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- LEFT PANEL (ICON RAIL + SIDEBAR together) -->
    <div class="left-panel desktop-only">
      <!-- ICON RAIL -->
      <aside class="icon-rail">
        <div class="logo-wrapper mb-8">
          <div class="logo-glow">
            <svg
              class="logo-svg"
              width="28"
              height="28"
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
        </div>

        <div class="nav-container flex flex-col items-center gap-3 w-full px-3">
          <button
            v-for="item in navItems"
            :key="item.to"
            @click="$router.push(item.to)"
            class="icon-btn group relative"
            :class="{ 'is-active': isActive(item.to) }"
          >
            <div class="icon-bg"></div>

            <div class="icon-wrapper">
              <component
                :is="item.icon"
                class="icon-svg"
                :class="{ 'active-icon': isActive(item.to) }"
              />
            </div>

            <span class="tooltip">
              {{
                (item.tooltip || item.to.replace("/", ""))
                  .charAt(0)
                  .toUpperCase() +
                (item.tooltip || item.to.replace("/", "")).slice(1)
              }}
            </span>
          </button>
        </div>

        <div
          class="bottom-section flex flex-col items-center gap-3 w-full px-3"
        >
          <button
            @click="$router.push('/settings')"
            class="icon-btn group relative"
            :class="{ 'is-active': isActive('/settings') }"
          >
            <div class="icon-bg"></div>
            <div class="icon-wrapper">
              <IconSettings class="icon-svg" />
            </div>
            <span class="tooltip">Settings</span>
          </button>

          <div
            class="profile-avatar group relative"
            @click="$router.push('/profile')"
          >
            <div class="avatar-glow"></div>

            <div class="avatar-content">
              <span class="avatar-text">
                {{ authStore.doctorName?.charAt(0)?.toUpperCase() || "D" }}
              </span>
            </div>

            <span class="online-indicator"></span>

            <span class="tooltip">Profile</span>
          </div>
        </div>
      </aside>

      <!-- SIDEBAR LIST -->
      <div class="sidebar-content">
        <div class="px-1 pt-7 pb-4">
          <p class="sidebar-group">
            {{ pageConfig.group }}
          </p>

          <div class="flex justify-between items-center">
            <h2 class="sidebar-title">
              {{ pageConfig.title }}
            </h2>

            <RouterLink
              v-if="pageConfig.addRoute"
              :to="pageConfig.addRoute"
              class="add-circle"
            >
              <span class="plus">+</span>
            </RouterLink>
          </div>
        </div>

        <!-- Search -->
        <div class="search">
          <input
            v-model="sidebarSearch"
            :placeholder="searchPlaceholder"
            class="sidebar-search"
          />
          <svg
            class="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Dynamic Content based on route -->
        <div class="sidebar-dynamic-content">
          <!-- Patients List -->
          <div v-if="route.path.includes('/patients')" class="dynamic-list">
            <div
              v-for="patient in filteredPatients"
              :key="patient.patientId"
              class="list-item"
              @click="$router.push(`/patients/${patient.patientId}`)"
            >
              <div
                class="item-avatar"
                :style="{ background: getAvatarColor(patient.fullName) }"
              >
                {{ patient.fullName?.charAt(0)?.toUpperCase() || "?" }}
              </div>
              <div class="item-info">
                <div class="item-name">{{ patient.fullName }}</div>
                <div class="item-details">
                  <span>{{ patient.age || "—" }} yrs</span>
                  <span class="dot">•</span>
                  <span>{{ patient.gender || "—" }}</span>
                </div>
                <div class="item-diagnosis" v-if="patient.diagnosis">
                  {{ patient.diagnosis }}
                </div>
              </div>
            </div>

            <div v-if="filteredPatients.length === 0" class="empty-state">
              <p>No patients found</p>
            </div>
          </div>

          <!-- Prescriptions List -->
          <div
            v-else-if="route.path.includes('/prescriptions')"
            class="dynamic-list"
          >
            <div
              v-for="prescription in filteredPrescriptions"
              :key="prescription.id"
              class="list-item"
              @click="$router.push(`/prescriptions/${prescription.id}`)"
            >
              <div class="item-icon">💊</div>
              <div class="item-info">
                <div class="item-name">{{ prescription.patientName }}</div>
                <div class="item-details">
                  <span>{{ formatDate(prescription.date) }}</span>
                  <span class="dot">•</span>
                  <span
                    >{{ prescription.medicines?.length || 0 }} medicines</span
                  >
                </div>
                <div class="item-diagnosis">{{ prescription.diagnosis }}</div>
              </div>
            </div>

            <div v-if="filteredPrescriptions.length === 0" class="empty-state">
              <p>No prescriptions found</p>
            </div>
          </div>

          <!-- Medicines List -->
          <div
            v-else-if="route.path.includes('/medicines')"
            class="dynamic-list"
          >
            <div
              v-for="medicine in filteredMedicines"
              :key="medicine.id"
              class="list-item"
              @click="$router.push(`/medicines/${medicine.id}`)"
            >
              <div class="item-icon">💊</div>
              <div class="item-info">
                <div class="item-name">{{ medicine.name }}</div>
                <div class="item-details">
                  <span>{{ medicine.brand }}</span>
                  <span class="dot">•</span>
                  <span>{{ medicine.strength }}</span>
                </div>
                <div class="item-price">৳{{ medicine.price }}</div>
              </div>
            </div>

            <div v-if="filteredMedicines.length === 0" class="empty-state">
              <p>No medicines found</p>
            </div>
          </div>

          <!-- Chambers List -->
          <div
            v-else-if="route.path.includes('/chambers')"
            class="dynamic-list"
          >
            <div
              v-for="chamber in filteredChambers"
              :key="chamber.id"
              class="list-item"
              @click="$router.push(`/chambers/${chamber.id}`)"
            >
              <div class="item-icon">🏥</div>
              <div class="item-info">
                <div class="item-name">{{ chamber.name }}</div>
                <div class="item-details">
                  <span>{{ chamber.location }}</span>
                </div>
                <div class="item-time">{{ chamber.time }}</div>
              </div>
            </div>

            <div v-if="filteredChambers.length === 0" class="empty-state">
              <p>No chambers found</p>
            </div>
          </div>

          <!-- Dashboard - Recent Items -->
          <div v-else-if="route.path === '/dashboard'" class="dynamic-list">
            <div class="list-header mt-3">Recent Prescriptions</div>
            <div
              v-for="prescription in recentPrescriptions"
              :key="prescription.id"
              class="list-item"
              @click="$router.push(`/prescriptions/${prescription.id}`)"
            >
              <div class="item-icon">💊</div>
              <div class="item-info">
                <div class="item-name">{{ prescription.patientName }}</div>
                <div class="item-details">
                  <span>{{ formatDate(prescription.date) }}</span>
                  <span class="dot">•</span>
                  <span
                    >{{ prescription.medicines?.length || 0 }} medicines</span
                  >
                </div>
                <div class="item-diagnosis">{{ prescription.diagnosis }}</div>
              </div>
            </div>
          </div>

          <!-- Default - Show subLinks -->
          <div v-else class="sidebar-links">
            <RouterLink
              v-for="link in pageConfig.subLinks"
              :key="link.to"
              :to="link.to"
              class="sidebar-link"
              :class="{ active: route.path === link.to }"
            >
              <component :is="link.icon" class="w-4" />
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN PANEL -->
    <div class="main" :class="{ 'mobile-main': mobileMenuOpen }">
      <!-- TOP BAR -->
      <header class="topbar desktop-only">
        <h1 class="top-title">
          {{ pageConfig.topbar }}
        </h1>

        <div class="flex items-center gap-4">
          <div class="greeting-pill">
            <div class="greeting-row">
              <span class="greeting-emoji">{{ greetingIcon }}</span>
              <span class="greeting-text">{{ greeting }}</span>
            </div>
            <div class="date-row">
              <span class="top-date">{{ formattedDate }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <main class="page" :class="{ 'mobile-page': mobileMenuOpen }">
        <RouterView />
      </main>

      <div class="mobile-tabbar mobile-only">
        <button
          v-for="item in navItems"
          :key="item.to"
          @click="$router.push(item.to)"
          class="tabbar-item"
          :class="{ 'tabbar-active': isActive(item.to) }"
        >
          <component :is="item.icon" class="tabbar-icon" />
          <span class="tabbar-label">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import { toast } from "vue3-toastify";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { usePatientsStore } from "../../features/patients/stores/patientsStore";
import { usePrescriptionsStore } from "../../features/prescriptions/stores/prescriptionsStore";
import { useMedicinesStore } from "../../features/medicines/stores/medicinesStore";
import { useChambersStore } from "../../features/chambers/stores/chambersStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const patientStore = usePatientsStore();
const prescriptionStore = usePrescriptionsStore();
const medicineStore = useMedicinesStore();
const chamberStore = useChambersStore();

const sidebarSearch = ref("");

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleMobileNav = (path) => {
  router.push(path);
  mobileMenuOpen.value = false;
};

// ── Icon components ───────────────────────────────────────────
const mkIcon = (d) => () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d,
      }),
    ],
  );
const mkIconMulti =
  (...ds) =>
  () =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
      },
      ds.map((d) =>
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d,
        }),
      ),
    );

const IconGrid = mkIconMulti(
  "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z",
  "M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z",
  "M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z",
  "M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
);
const IconUsers = mkIcon(
  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
);
const IconDoc = mkIcon(
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
);
const IconPill = mkIcon(
  "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
);
const IconBuilding = mkIcon(
  "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
);
const IconSettings = mkIconMulti(
  "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
);
const IconPlus = mkIcon("M12 4v16m8-8H4");
const IconList = mkIcon("M4 6h16M4 10h16M4 14h16M4 18h16");
const IconNew = mkIcon(
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
);

// ── Rail nav ──────────────────────────────────────────────────
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: IconGrid },
  { to: "/patients", label: "Patients", icon: IconUsers },
  { to: "/prescriptions", label: "Prescriptions", icon: IconDoc },
  { to: "/medicines", label: "Medicines", icon: IconPill },
  { to: "/chambers", label: "Chambers", icon: IconBuilding },
];

// ── Per-page config ───────────────────────────────────────────
const pageConfigs = {
  "/dashboard": {
    group: "Overview",
    title: "Dashboard",
    topbar: "Dashboard",
    addRoute: null,
    subLinks: [{ to: "/dashboard", label: "Overview", icon: IconGrid }],
  },
  "/patients": {
    group: "Directory",
    title: "Patients",
    topbar: "Patients",
    addRoute: "/patients/new",
    subLinks: [],
  },
  "/prescriptions": {
    group: "Records",
    title: "Prescriptions",
    topbar: "Prescriptions",
    addRoute: "/prescriptions/new",
    subLinks: [],
  },
  "/medicines": {
    group: "Pharmacy",
    title: "Medicines",
    topbar: "Medicines",
    addRoute: null,
    subLinks: [],
  },
  "/chambers": {
    group: "Locations",
    title: "Chambers",
    topbar: "Chambers",
    addRoute: "/chambers/new",
    subLinks: [],
  },
  "/profile": {
    group: "Account",
    title: "Profile",
    topbar: "Doctor Profile",
    addRoute: null,
    subLinks: [{ to: "/profile", label: "My Profile", icon: IconSettings }],
  },
  "/settings": {
    group: "Account",
    title: "Settings",
    topbar: "Settings",
    addRoute: null,
    subLinks: [{ to: "/profile", label: "Profile", icon: IconSettings }],
  },
};

const DEFAULT_CONFIG = {
  group: "",
  title: "",
  topbar: "",
  addRoute: null,
  subLinks: [],
};

const pageConfig = computed(() => {
  for (const [prefix, cfg] of Object.entries(pageConfigs)) {
    if (route.path.startsWith(prefix)) return cfg;
  }
  return DEFAULT_CONFIG;
});

const isActive = (path) => route.path.startsWith(path);

const now = ref(dayjs());
let timer = null;

const updateTime = () => {
  now.value = dayjs();
};

onMounted(() => {
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    updateTime();
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

const formattedDate = computed(() =>
  now.value.format("ddd, MMM D • h:mm:ss A"),
);

const currentHour = computed(() => now.value.hour());

const greeting = computed(() => {
  const hour = currentHour.value;
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 20) return "Good Evening";
  return "Good Night";
});

const greetingIcon = computed(() => {
  const hour = currentHour.value;
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤";
  if (hour < 20) return "🌇";
  return "🌙";
});

// ── Search placeholder based on route ────────────────────────
const searchPlaceholder = computed(() => {
  if (route.path.includes("/patients")) return "Search patients...";
  if (route.path.includes("/prescriptions")) return "Search prescriptions...";
  if (route.path.includes("/medicines")) return "Search medicines...";
  if (route.path.includes("/chambers")) return "Search chambers...";
  return "Search...";
});

// ── Filtered data based on search ────────────────────────────
const filteredPatients = computed(() => {
  if (!patientStore.patients) return [];
  if (!sidebarSearch.value) return patientStore.patients;

  const search = sidebarSearch.value.toLowerCase();
  return patientStore.patients.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(search) ||
      p.mobileNumber?.includes(search) ||
      p.diagnosis?.toLowerCase().includes(search),
  );
});

const filteredPrescriptions = computed(() => {
  if (!prescriptionStore.prescriptions) return [];
  if (!sidebarSearch.value) return prescriptionStore.prescriptions;

  const search = sidebarSearch.value.toLowerCase();
  return prescriptionStore.prescriptions.filter(
    (p) =>
      p.patientName?.toLowerCase().includes(search) ||
      p.diagnosis?.toLowerCase().includes(search),
  );
});

const filteredMedicines = computed(() => {
  if (!medicineStore.medicines) return [];
  if (!sidebarSearch.value) return medicineStore.medicines;

  const search = sidebarSearch.value.toLowerCase();
  return medicineStore.medicines.filter(
    (m) =>
      m.name?.toLowerCase().includes(search) ||
      m.brand?.toLowerCase().includes(search),
  );
});

const filteredChambers = computed(() => {
  if (!chamberStore.chambers) return [];
  if (!sidebarSearch.value) return chamberStore.chambers;

  const search = sidebarSearch.value.toLowerCase();
  return chamberStore.chambers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search) ||
      c.location?.toLowerCase().includes(search),
  );
});

// ── Recent items for dashboard ───────────────────────────────
const recentPatients = computed(() => {
  return patientStore.patients?.slice(0, 3) || [];
});

const recentPrescriptions = computed(() => {
  return prescriptionStore.prescriptions?.slice(0, 3) || [];
});

// ── Helper functions ─────────────────────────────────────────
const getAvatarColor = (name) => {
  const colors = [
    "linear-gradient(135deg, #2e8b8b, #f4a58a)",
    "linear-gradient(135deg, #ee8875, #2e6b8b)",
    "linear-gradient(135deg, #f4a58a, #ee8875)",
    "linear-gradient(135deg, #2e6b8b, #2e8b8b)",
  ];
  const index = (name?.length || 0) % colors.length;
  return colors[index];
};

const formatDate = (date) => {
  if (!date) return "";
  return dayjs(date).format("DD MMM YYYY");
};

// ── Load data ────────────────────────────────────────────────
onMounted(() => {
  patientStore.fetchAll();
  prescriptionStore.fetchAll();
  medicineStore.fetchAll();
  chamberStore.fetchAll();
});

function handleLogout() {
  authStore.logout();
  toast.success("Logged out");
  router.push("/login");
}
</script>

<style scoped>
/* Modern Rail Design */
.left-panel {
  display: flex;
  background: linear-gradient(
    90deg,
    rgba(251, 202, 178, 0.9) 0%,
    rgba(244, 165, 138, 0.7) 50%,
    rgba(236, 138, 114, 0.5) 100%
  );
  position: relative;
  height: 100vh;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
  z-index: 5;
}

.main {
  flex: 1;
  background: white;
  border-radius: 26px 0 0 26px;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
  margin-left: -26px;
  z-index: 10;
  position: relative;
}

.main::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.02), transparent);
  pointer-events: none;
}

/* Icon Rail */
.icon-rail {
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

/* Divider between icon rail and sidebar */
.icon-rail::after {
  content: "";
  position: absolute;
  right: 0;
  top: 10%;
  height: 80%;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 20;
}

/* Sidebar Content */
.sidebar-content {
  width: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
  padding-right: 36px;
}

.sidebar-group {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(30, 42, 74, 0.8);
  font-weight: 800;
}

.sidebar-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e2a4a;
}

.add-circle {
  padding: 6px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #1e2a4a;
  border: 2px solid rgba(30, 42, 74, 0.1);
  background: rgba(255, 255, 255, 0.322);
  font-family: "Nunito", sans-serif;
  box-shadow: 0 6px 18px rgba(238, 136, 117, 0.35);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.plus {
  font-size: 18px;
  transform: scale(1.6);
  display: inline-block;
  color: #2e8b8b;
  font-weight: 700;
}

.add-circle:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(238, 136, 117, 0.45);
}

/* Search */
.search {
  position: relative;
}

.sidebar-search {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 20px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  font-size: 13px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1e2a4a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.search-icon {
  position: absolute;
  left: 217px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: rgba(30, 42, 74, 0.5);
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 1;
}

.sidebar-search::placeholder {
  color: rgba(30, 42, 74, 0.4);
  font-weight: 400;
  transition: all 0.3s ease;
}

.sidebar-search:hover {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sidebar-search:focus {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(46, 139, 139, 0.3);
  box-shadow: 0 0 0 4px rgba(46, 139, 139, 0.1);
  backdrop-filter: blur(8px);
  padding-left: 44px;
}

.sidebar-search:focus + .search-icon {
  color: #2e8b8b;
  transform: translateY(-50%) scale(1.05);
  left: 18px;
}

/* Dynamic Content Styles */
.sidebar-dynamic-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-header {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(30, 42, 74, 0.5);
  padding: 8px 8px 4px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.2);
}

.item-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.item-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  font-size: 11px;
  color: rgba(30, 42, 74, 0.6);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.item-diagnosis {
  font-size: 11px;
  color: #2e8b8b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 11px;
  font-weight: 700;
  color: #2e8b8b;
}

.item-time {
  font-size: 11px;
  color: #ee8875;
}

.dot {
  color: rgba(30, 42, 74, 0.3);
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: rgba(30, 42, 74, 0.4);
  font-size: 12px;
  font-style: italic;
}

/* Sidebar Links (fallback) */
.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(30, 42, 74, 0.7);
  transition: all 0.2s ease;
  text-decoration: none;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #1e2a4a;
}

.sidebar-link.active {
  background: rgba(30, 42, 74, 0.2);
  color: #1e2a4a;
  backdrop-filter: blur(4px);
}

/* Logo Styles */
.logo-wrapper {
  position: relative;
  margin-top: 24px;
  margin-bottom: 0;
}

.logo-glow {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-glow:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.logo-svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Navigation Container */
.nav-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 0 12px;
  flex: 1;
  margin: 0;
}

/* Icon Button Styles */
.icon-btn {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  border-radius: 12px;
}

.icon-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.icon-btn:hover::before {
  background: rgba(46, 139, 139, 0.08);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.icon-btn.is-active::before {
  background: rgba(46, 139, 139, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(46, 139, 139, 0.2);
}

.icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.icon-svg {
  width: 20px;
  height: 20px;
  color: rgba(30, 42, 74, 0.6);
  transition: all 0.2s ease;
}

.icon-btn:hover .icon-svg {
  color: rgba(30, 42, 74, 0.9);
  transform: scale(1.05);
}

.icon-btn.is-active .icon-svg {
  color: #2e8b8b;
}

/* Tooltip Styles */
.tooltip {
  position: absolute;
  left: 60px;
  background: rgba(30, 42, 74, 0.9);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.group:hover .tooltip {
  opacity: 1;
  transform: translateX(0);
}

/* Profile Avatar Styles */
.profile-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(46, 139, 139, 0.1),
    rgba(244, 165, 138, 0.1)
  );
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.profile-avatar:hover .avatar-glow {
  background: linear-gradient(
    135deg,
    rgba(46, 139, 139, 0.2),
    rgba(244, 165, 138, 0.2)
  );
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

.avatar-content {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2e8b8b, #f4a58a);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(46, 139, 139, 0.3);
}

.avatar-text {
  color: white;
  font-weight: 700;
  font-size: 16px;
  font-family: "Nunito", sans-serif;
}

.online-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  z-index: 2;
}

.bottom-section {
  margin-top: 0;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

/* Fade In Up Animation */
.fade-in-up {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.topbar {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #eee;
}

.top-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e2a4a;
}

.top-date {
  padding: 3px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(238, 136, 117, 0.1);
  color: #c05030;
  border: 1px solid rgba(238, 136, 117, 0.2);
  transition: 0.25s;
  text-decoration: none;
}

.greeting-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  font-size: 12px;
  font-weight: 700;
  background: linear-gradient(
    90deg,
    rgb(255 255 255),
    rgba(255, 186, 130, 0.295)
  );
  color: #2e8b8b;
  left: 30px;
}

.greeting-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-row {
  font-size: 11px;
}

.greeting-emoji {
  font-size: 20px;
  font-family:
    "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  color: unset;
  margin-bottom: 7px;
}

.greeting-text {
  font-size: 16px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
}

.page {
  flex: 1;
  overflow: auto;
  padding: 28px;
}

/* Scrollbar Styling */
.sidebar-dynamic-content::-webkit-scrollbar {
  width: 3px;
}

.sidebar-dynamic-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-dynamic-content::-webkit-scrollbar-thumb {
  background: rgba(30, 42, 74, 0.2);
  border-radius: 3px;
}

.sidebar-dynamic-content::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 42, 74, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block;
  }

  .mobile-topbar {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: white;
    border-bottom: 1px solid rgba(30, 42, 74, 0.08);
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  }

  .mobile-logo {
    width: 44px;
    height: 44px;
    background: rgba(247, 179, 134, 0.384);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .mobile-logo:hover {
    background: rgba(247, 179, 134, 0.384);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .mobile-logo-svg {
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .top-date {
    padding: 3px 14px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    background: rgba(238, 136, 117, 0.1);
    color: #c05030;
    border: 1px solid rgba(238, 136, 117, 0.2);
    transition: 0.25s;
    text-decoration: none;
  }

  .mobile-greeting {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 20px;
    
  }

  .mobile-greeting-emoji {
    font-size: 16px;
    font-family:
      "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
    color: unset;
  }

  .mobile-greeting-text {
    font-size: 12px;
    font-weight: 700;
    color: #2e8b8b;
  }

  .mobile-top-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mobile-top-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(30, 42, 74, 0.6);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mobile-top-btn:hover,
  .mobile-top-btn:active {
    color: #f4a58a;
    transform: scale(0.98);
  }

  .mobile-top-icon {
    width: 20px;
    height: 20px;
  }

  .mobile-profile-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgba(30, 42, 74, 0.1);
    background: rgba(240, 162, 110, 0.233);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .mobile-profile-btn:hover,
  .mobile-profile-btn:active {
    transform: scale(0.98);
  }

  .mobile-profile-badge {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2e8b8b, #ee8875);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 16px;
  }

  /* Mobile Tabbar */
  .mobile-tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: white;
    border-radius: 26px 26px 0px 0px;
    border-top: 1px solid rgba(30, 42, 74, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px;
    z-index: 1000;
    box-shadow: 0 -9px 10px rgba(0, 0, 0, 0.04);
  }

  .tabbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: transparent;
    border: none;
    padding: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(30, 42, 74, 0.6);
    flex: 1;
    max-width: 70px;
  }

  .tabbar-item:active {
    transform: scale(0.95);
  }

  .tabbar-icon {
    width: 22px;
    height: 22px;
    transition: all 0.2s ease;
  }

  .tabbar-label {
    font-size: 10px;
    font-weight: 600;
    font-family: "Nunito", sans-serif;
  }

  .tabbar-active {
    color: #f4a58a;
  }

  .tabbar-active .tabbar-icon {
    color: #f4a58a;
    transform: translateY(-2px);
  }

  .main {
    margin-left: 0 !important;
    border-radius: 0 !important;
    padding-top: 70px;
    padding-bottom: 70px;
  }

  .main.mobile-main {
    filter: blur(5px);
    pointer-events: none;
  }

  .page {
    padding: 20px 16px !important;
  }

  .page.mobile-page {
    padding-bottom: 30px;
  }

  .greeting-pill {
    left: 0 !important;
    padding: 10px 14px !important;
  }

  .greeting-text {
    font-size: 14px !important;
  }
}

@media (min-width: 769px) {
  .mobile-only,
  .mobile-topbar,
  .mobile-tabbar {
    display: none;
  }
}
</style>
