<template>
  <div class="patient-details-container">
    <!-- Back button and actions -->
    <div class="action-bar">
      <button
        @click="$router.back()"
        @mouseover="(e) => (e.currentTarget.style.color = '#1E2A4A')"
        @mouseout="(e) => (e.currentTarget.style.color = '#9AA0B8')"
        class="back-btn"
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back</span>
      </button>

      <div class="action-buttons" v-if="patient">
        <RouterLink :to="`/patients/${$route.params.id}/edit`" class="edit-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Edit</span>
        </RouterLink>

        <RouterLink
          :to="`/prescriptions/new?patientId=${$route.params.id}`"
          class="prescription-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Prescription</span>
        </RouterLink>
      </div>
    </div>

    <div
      v-if="store.loading"
      class="text-center py-16 text-[13px]"
      style="color: #9aa0b8"
    >
      Loading...
    </div>
    <div v-else-if="!patient" class="text-center py-16">
      <div class="text-4xl mb-3">👤</div>
      <p
        class="text-[14px] font-bold mb-1"
        style="color: #1e2a4a; font-family: &quot;Nunito&quot;, sans-serif"
      >
        Patient not found
      </p>
    </div>

    <template v-else>
      <div class="patient-card">
        <div class="card-cover"></div>

        <div class="card-content">
          <div class="profile-header">
            <div class="avatar-wrapper">
              <div class="avatar-glow"></div>
              <div class="avatar">
                <span class="avatar-text">{{
                  patient.fullName?.charAt(0)?.toUpperCase() || "?"
                }}</span>
              </div>
            </div>

            <div class="profile-info">
              <h2 class="patient-name">{{ patient.fullName }}</h2>
              <div class="patient-meta">
                <span class="meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{{ patient.mobileNumber }}</span>
                </span>
                <span class="meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>{{ patient.address }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="info-grid">
            <div
              v-for="f in fields"
              :key="f.label"
              v-show="f.value"
              class="info-card"
            >
              <div
                class="info-icon"
                :style="{ background: f.bgColor, color: f.color }"
              >
                {{ f.icon }}
              </div>
              <div class="info-content">
                <span class="info-label">{{ f.label }}</span>
                <span class="info-value">{{ f.value }}</span>
              </div>
            </div>
          </div>

          <div class="additional-info">
            <div class="info-chip">
              <span class="chip-label">Last Visit</span>
              <span class="chip-value">{{ patient.lastVisit }}</span>
            </div>
            <div class="info-chip">
              <span class="chip-label">Total Visits</span>
              <span class="chip-value">{{ patient.totalVisits }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="prescriptions-section">
        <div class="section-header">
          <div class="header-left">
            <h3 class="section-title">Prescription History</h3>
            <span class="section-badge">{{ patientRx.length }} total</span>
          </div>
          <RouterLink to="/prescriptions" class="view-all-link">
            <span>View All</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </RouterLink>
        </div>

        <div v-if="!patientRx.length" class="text-center py-10">
          <div class="text-3xl mb-2">📋</div>
          <p class="text-[13px]" style="color: #9aa0b8">No prescriptions yet</p>
        </div>

        <div v-else class="prescriptions-list">
          <div
            v-for="rx in patientRx"
            :key="rx.prescriptionId"
            class="prescription-card"
            @mouseover="
              (e) =>
                (e.currentTarget.style.background = 'rgba(238,136,117,0.04)')
            "
            @mouseout="
              (e) => (e.currentTarget.style.background = 'transparent')
            "
            @click="$router.push(`/prescriptions/${rx.prescriptionId}`)"
          >
            <div class="card-left">
              <div class="prescription-icon">💊</div>
              <div class="prescription-info">
                <h4 class="prescription-title">
                  {{ rx.diagnosis || "No diagnosis" }}
                </h4>
                <p class="prescription-meta">
                  <span>{{ rx.chamberName }}</span>
                </p>
              </div>
            </div>
            <div class="card-right">
              <span class="date-badge">{{ fmtDate(rx.visitDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { usePatientsStore } from "../stores/patientsStore";
import { usePrescriptionsStore } from "@/features/prescriptions/stores/prescriptionsStore";

const route = useRoute();
const store = usePatientsStore();
const rxStore = usePrescriptionsStore();
const patient = computed(() => store.currentPatient);
const patientRx = ref([]);
const fmtDate = (d) => (d ? dayjs(d).format("MMM D, YYYY") : "—");
const fields = computed(() =>
  patient.value
    ? [
        {
          label: "Age",
          value: patient.value.age ? `${patient.value.age} yrs` : null,
          icon: "📅",
          color: "#ee8875",
          bgColor: "rgba(238, 136, 117, 0.1)",
        },
        {
          label: "Gender",
          value: patient.value.gender,
          icon: "👤",
          color: "#2e8b8b",
          bgColor: "rgba(46, 139, 139, 0.1)",
        },
        {
          label: "Weight",
          value: patient.value.weight ? `${patient.value.weight} kg` : null,
          icon: "⚖️",
          color: "#f4a58a",
          bgColor: "rgba(244, 165, 138, 0.1)",
        },
        {
          label: "Blood Group",
          value: patient.value.bloodGroup,
          icon: "🩸",
          color: "#c05030",
          bgColor: "rgba(192, 80, 48, 0.1)",
        },
      ]
    : [],
);
onMounted(async () => {
  await store.fetchById(route.params.id);
  patientRx.value = await rxStore.fetchByPatient(route.params.id);
});
</script>

<style scoped>
.patient-details-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeInUp 0.5s ease forwards;
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.1);
  color: #5a6282;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.edit-btn,
.prescription-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  text-decoration: none;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #fff;
  border: 1px solid rgba(30, 42, 74, 0.1);
  color: #1e2a4a;
}

.edit-btn:hover {
  border-color: #ee8875;
  color: #ee8875;
}

.prescription-btn {
  background: #f4a58a;
  color: #1e2a4a;
  box-shadow: 0 6px 16px rgba(238, 136, 117, 0.3);
  border: none;
}

.prescription-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(238, 136, 117, 0.4);
}

/* Patient Card */
.patient-card {
  position: relative;
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  transition: all 0.4s ease;
}

.patient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.card-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #ee8875, #2e8b8b, #f4a58a);
  opacity: 0.1;
}

.card-content {
  position: relative;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
}

.avatar-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #ee8875, #2e8b8b);
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(8px);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

.avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ee8875;
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

.profile-info {
  flex: 1;
}

.patient-name {
  font-size: 28px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 8px;
}

.patient-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5e6a85;
  font-size: 13px;
  background: rgba(238, 136, 117, 0.05);
  padding: 6px 12px;
  border-radius: 20px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.info-card:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.info-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9aa0b8;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-top: 2px;
}

/* Additional Info */
.additional-info {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid rgba(30, 42, 74, 0.08);
}

.info-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(46, 139, 139, 0.05);
  border-radius: 30px;
  border: 1px solid rgba(46, 139, 139, 0.1);
}

.chip-label {
  font-size: 11px;
  font-weight: 600;
  color: #5e6a85;
}

.chip-value {
  font-size: 12px;
  font-weight: 700;
  color: #2e8b8b;
  font-family: "Nunito", sans-serif;
}

/* Prescriptions Section */
.prescriptions-section {
  background: white;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(30, 42, 74, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.section-badge {
  padding: 4px 12px;
  border-radius: 30px;
  background: rgba(238, 136, 117, 0.1);
  color: #c05030;
  font-size: 11px;
  font-weight: 700;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2e8b8b;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #ee8875;
  transform: translateX(4px);
}

.prescriptions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prescription-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.prescription-card:hover {
  background: white;
  transform: translateX(8px);
  box-shadow: 0 8px 20px rgba(238, 136, 117, 0.12);
  border-color: rgba(238, 136, 117, 0.2);
}

.card-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.prescription-icon {
  width: 44px;
  height: 44px;
  background: rgba(238, 136, 117, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.prescription-info {
  flex: 1;
}

.prescription-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 4px;
}

.prescription-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #9aa0b8;
  flex-wrap: wrap;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-badge {
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(46, 139, 139, 0.1);
  color: #2e8b8b;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

/* Fade In Animation */
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

/* Responsive Design */
@media (max-width: 768px) {
  .patient-details-container {
    padding: 16px;
  }

  .card-content {
    padding: 20px;
  }

  .profile-header {
    gap: 16px;
  }

  .avatar {
    width: 64px;
    height: 64px;
  }

  .avatar-text {
    font-size: 26px;
  }

  .patient-name {
    font-size: 22px;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .prescription-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-right {
    width: 100%;
    justify-content: space-between;
  }

  .prescription-card:hover {
    transform: translateX(4px);
  }
}

@media (max-width: 480px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    width: 100%;
  }

  .edit-btn,
  .prescription-btn {
    flex: 1;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .patient-meta {
    flex-direction: column;
    gap: 8px;
  }

  .meta-item {
    width: fit-content;
  }
}
</style>
