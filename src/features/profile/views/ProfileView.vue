<template>
  <div class="profile-container fade-in-up">
    <!-- Hero Section with Cover Image -->
    <div class="profile-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="avatar-wrapper">
          <div class="avatar-ring"></div>
          <div class="avatar">
            <span class="avatar-text">{{
              authStore.doctorName?.charAt(0)?.toUpperCase() || "D"
            }}</span>
          </div>
        </div>
        <div class="hero-info">
          <h1 class="hero-name">{{ authStore.doctorName || "Doctor" }}</h1>
          <p class="hero-email">
            {{ authStore.doctor?.email || "subirdassujoy@gmail.com" }}
          </p>
          <div class="hero-badge">
            <span class="badge-icon">👨‍⚕️</span>
            <span>Verified Doctor</span>
          </div>
        </div>
      </div>
      <div class="hero-pattern"></div>
    </div>

    <div class="profile-content">
      <!-- Profile Form Card -->
      <div class="profile-card">
        <div class="card-header">
          <div class="header-left">
            <div class="header-icon">👨‍⚕️</div>
            <div>
              <h3 class="card-title">Doctor Information</h3>
              <p class="card-subtitle">Update your professional details</p>
            </div>
          </div>
          <button @click="save" :disabled="saving" class="save-btn">
            <div v-if="saving" class="btn-spinner"></div>
            <span>{{ saving ? "Saving..." : "Save Changes" }}</span>
          </button>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                v-model="form.fullName"
                class="form-input"
                placeholder="Dr. Full Name"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Degree / Qualifications</label>
            <div class="input-wrapper">
              <span class="input-icon">🎓</span>
              <input
                v-model="form.degree"
                class="form-input"
                placeholder="MBBS, FCPS (Medicine)"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Specialization</label>
            <div class="input-wrapper">
              <span class="input-icon">🔬</span>
              <input
                v-model="form.specialization"
                class="form-input"
                placeholder="Internal Medicine"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Registration No.</label>
            <div class="input-wrapper">
              <span class="input-icon">📋</span>
              <input
                v-model="form.regNo"
                class="form-input"
                placeholder="A-XXXXX"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Phone</label>
            <div class="input-wrapper">
              <span class="input-icon">📞</span>
              <input
                v-model="form.phone"
                class="form-input"
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrapper disabled">
              <span class="input-icon">✉️</span>
              <input
                :value="authStore.doctor?.email"
                class="form-input"
                disabled
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Clinic / Hospital</label>
            <div class="input-wrapper">
              <span class="input-icon">🏥</span>
              <input
                v-model="form.hospital"
                class="form-input"
                placeholder="City Medical Center, Dhaka"
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Address</label>
            <div class="input-wrapper">
              <span class="input-icon">📍</span>
              <input
                v-model="form.address"
                class="form-input"
                placeholder="House, Road, Area, City"
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Chamber Schedule</label>
            <div class="input-wrapper">
              <span class="input-icon">⏰</span>
              <textarea
                v-model="form.schedule"
                rows="2"
                class="form-textarea"
                placeholder="Sat–Thu: 5PM–9PM, Fri: Closed"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences Card -->
      <!-- <div class="profile-card">
        <div class="card-header">
          <div class="header-left">
            <div class="header-icon">⚙️</div>
            <div>
              <h3 class="card-title">Preferences</h3>
              <p class="card-subtitle">Customize your prescription settings</p>
            </div>
          </div>
        </div>

        <div class="preferences-list">
          <div
            v-for="pref in prefItems"
            :key="pref.key"
            class="preference-item"
          >
            <div class="preference-info">
              <div class="preference-icon">{{ pref.icon }}</div>
              <div>
                <p class="preference-title">{{ pref.label }}</p>
                <p class="preference-desc">{{ pref.desc }}</p>
              </div>
            </div>
            <button
              @click="prefs[pref.key] = !prefs[pref.key]"
              class="toggle-switch"
              :class="{ active: prefs[pref.key] }"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
        </div>
      </div> -->

      <!-- Account Card -->
      <div class="profile-card danger-card">
        <div class="card-header">
          <div class="header-left">
            <div class="header-icon danger">⚠️</div>
            <div>
              <h3 class="card-title danger">Account</h3>
              <p class="card-subtitle">Manage your account settings</p>
            </div>
          </div>
        </div>

        <div class="account-actions">
          <div class="action-info">
            <div class="action-icon">🚪</div>
            <div>
              <p class="action-title">Sign Out</p>
              <p class="action-desc">Sign out from this device</p>
            </div>
          </div>
          <button @click="logout" class="signout-btn">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "@/features/auth/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const saving = ref(false);

const form = reactive({
  fullName: "",
  degree: "",
  specialization: "",
  regNo: "",
  phone: "",
  hospital: "",
  address: "",
  schedule: "",
});

const prefs = reactive({
  showDate: true,
  showVitals: true,
  signature: true,
  showTests: true,
});

const prefItems = [
  {
    key: "showDate",
    label: "Show date on prescription",
    desc: "Print visit date on the Rx slip",
    icon: "📅",
  },
  {
    key: "showVitals",
    label: "Include vitals",
    desc: "Show BP, pulse etc. on the Rx",
    icon: "❤️",
  },
  {
    key: "signature",
    label: "Signature line",
    desc: "Show signature line at bottom",
    icon: "✍️",
  },
  {
    key: "showTests",
    label: "Show test section",
    desc: "Include investigations section",
    icon: "🔬",
  },
];

async function save() {
  saving.value = true;
  try {
    authStore.doctor = { ...authStore.doctor, ...form };
    toast.success("Profile saved successfully!");
  } catch {
    toast.error("Failed to save profile");
  } finally {
    saving.value = false;
  }
}

function logout() {
  authStore.logout();
  toast.success("Signed out");
  router.push("/login");
}

onMounted(() => {
  if (authStore.doctor) {
    Object.assign(form, {
      fullName: authStore.doctor.fullName || authStore.doctorName || "",
      degree: authStore.doctor.degree || "",
      specialization: authStore.doctor.specialization || "",
      regNo: authStore.doctor.regNo || "",
      phone: authStore.doctor.phone || "",
      hospital: authStore.doctor.hospital || "",
      address: authStore.doctor.address || "",
      schedule: authStore.doctor.schedule || "",
    });
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Hero Section */
.profile-hero {
  position: relative;
  background: linear-gradient(135deg, #1e2a4a, #243258);
  border-radius: 28px;
  margin-bottom: 24px;
  overflow: hidden;
  padding: 32px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 80% 20%,
    rgba(238, 136, 117, 0.15),
    transparent 70%
  );
  pointer-events: none;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E");
  pointer-events: none;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  z-index: 2;
}

.avatar-wrapper {
  position: relative;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f4a58a, #2e8b8b);
  opacity: 0.5;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.avatar {
  position: relative;
  width: 80px;
  height: 80px;
  background: #ee8875;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.avatar-text {
  color: white;
  font-size: 32px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
}

.hero-info {
  flex: 1;
}

.hero-name {
  font-size: 28px;
  font-weight: 800;
  color: white;
  font-family: "Nunito", sans-serif;
  margin-bottom: -6px;
}

.hero-email {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: rgba(238, 136, 117, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.header-icon.danger {
  background: rgba(224, 82, 82, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 4px;
}

.card-title.danger {
  color: #e05252;
}

.card-subtitle {
  font-size: 12px;
  color: #9aa0b8;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9aa0b8;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper.disabled {
  opacity: 0.7;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  pointer-events: none;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: 12px;
  border: 1.5px solid rgba(30, 42, 74, 0.12);
  background: white;
  font-size: 13px;
  font-family: "DM Sans", sans-serif;
  color: #1e2a4a;
  outline: none;
  transition: all 0.2s;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #ee8875;
  box-shadow: 0 0 0 3px rgba(238, 136, 117, 0.1);
}

.form-input:disabled {
  background: rgba(30, 42, 74, 0.04);
  cursor: not-allowed;
}

/* Save Button */
.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  background: #f4a58a;
  color: #1e2a4a;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 136, 117, 0.35);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Preferences List */
.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(30, 42, 74, 0.06);
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.preference-icon {
  width: 40px;
  height: 40px;
  background: rgba(238, 136, 117, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.preference-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e2a4a;
  margin-bottom: 2px;
}

.preference-desc {
  font-size: 11px;
  color: #9aa0b8;
}

/* Toggle Switch */
.toggle-switch {
  width: 48px;
  height: 26px;
  background: rgba(30, 42, 74, 0.15);
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.toggle-switch.active {
  background: #ee8875;
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-slider {
  transform: translateX(22px);
}

/* Account Actions */
.account-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.action-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-icon {
  width: 44px;
  height: 44px;
  background: rgba(224, 82, 82, 0.08);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.action-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e2a4a;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 11px;
  color: #9aa0b8;
}

.signout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(224, 82, 82, 0.1);
  color: #e05252;
  border: 1px solid rgba(224, 82, 82, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.signout-btn:hover {
  background: rgba(224, 82, 82, 0.2);
  transform: translateY(-1px);
}

/* Danger Card */
.danger-card {
  border-color: rgba(224, 82, 82, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-name {
    font-size: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .save-btn {
    width: 100%;
    justify-content: center;
  }

  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .account-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .signout-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 64px;
    height: 64px;
  }

  .avatar-text {
    font-size: 26px;
  }

  .hero-name {
    font-size: 20px;
  }

  .profile-card {
    padding: 20px;
  }
}
</style>
