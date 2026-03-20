<template>
  <div class="space-y-6 fade-in-up">
    <!-- Doctor Header -->
    <div class="doctor-header">
      <div class="doctor-header-content">
        <div class="flex items-center gap-4">
          <div class="doctor-avatar">
            {{ authStore.doctorName?.charAt(0)?.toUpperCase() || "D" }}
          </div>

          <div class="doctor-info">
            <h2 class="doctor-name">
              Dr. {{ authStore.doctorName || "Doctor" }}
            </h2>
            <p class="doctor-designation">
              {{ authStore.doctorDesignation || "MBBS, FCPS (Medicine)" }}
            </p>
          </div>
        </div>

        <div class="doctor-sub mobile-hidden">
          <span class="doctor-sub-item"
            >🏥 {{ authStore.hospital || "City Medical Center, Dhaka" }}</span
          >
          <span class="doctor-sub-item"
            >📋 Reg: {{ authStore.regNo || "A-45231" }}</span
          >
          <span class="doctor-sub-item"
            >📞 {{ authStore.phone || "01711-000000" }}</span
          >
        </div>
      </div>

      <div class="doctor-stats">
        <div class="mini-stat">
          <span class="dot orange"></span>
          <span class="stat-label">Today:</span>
          <b>{{ todayCount }}</b>
        </div>

        <div class="mini-stat">
          <span class="dot blue"></span>
          <span class="stat-label">Patients:</span>
          <b>{{ patientsStore.total }}</b>
        </div>
      </div>

      <div class="doctor-sub-mobile mobile-only">
        <div class="mobile-sub-item">
          <span
            >🏥 {{ authStore.hospital || "City Medical Center, Dhaka" }}</span
          >
        </div>
        <div class="mobile-sub-row">
          <span class="mobile-sub-item"
            >📋 Reg: {{ authStore.regNo || "A-45231" }}</span
          >
          <span class="mobile-sub-item"
            >📞 {{ authStore.phone || "01711-000000" }}</span
          >
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="stats-grid">
      <div
        v-for="(s, i) in stats"
        :key="s.label"
        class="stat-card"
        :class="'stat-' + i"
      >
        <div class="stat-icon">
          {{ s.icon }}
        </div>

        <div class="stat-info">
          <div class="stat-value">
            {{ s.value }}
          </div>

          <div class="stat-label">
            {{ s.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions + recent -->
    <div class="dashboard-grid">
      <!-- Quick Actions -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Quick Actions</h3>
        </div>

        <div class="quick-grid">
          <RouterLink
            v-for="a in quickActions"
            :key="a.to"
            :to="a.to"
            class="quick-card"
          >
            <div class="quick-icon">
              {{ a.icon }}
            </div>

            <div class="quick-label">
              {{ a.label }}
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Recent Prescriptions -->
      <div class="dashboard-card">
        <div class="card-header space-between">
          <h3>Recent Prescriptions</h3>

          <RouterLink to="/prescriptions" class="see-all">
            See all →
          </RouterLink>
        </div>

        <div v-if="rxStore.loading" class="loading">Loading...</div>

        <div v-else-if="recentRx.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p>No prescriptions yet</p>

          <RouterLink to="/prescriptions/new" class="create-btn">
            Create first one →
          </RouterLink>
        </div>

        <div v-else class="recent-list">
          <div
            v-for="rx in recentRx"
            :key="rx.prescriptionId"
            class="recent-card"
            @click="$router.push(`/prescriptions/${rx.prescriptionId}`)"
          >
            <div>
              <p class="patient-name">
                {{ rx.patientName || "—" }}
              </p>

              <p class="diagnosis">
                {{ rx.diagnosis || "No diagnosis" }}
              </p>
            </div>

            <span class="date-pill">
              {{ fmtDate(rx.visitDate) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Common diagnoses reference -->
    <div class="dashboard-card">
      <div class="card-header space-between">
        <h3>Common Diagnoses</h3>

        <RouterLink to="/prescriptions/new" class="see-all">
          New Rx →
        </RouterLink>
      </div>

      <div class="dx-list">
        <RouterLink
          v-for="d in commonDx"
          :key="d"
          :to="`/prescriptions/new?dx=${encodeURIComponent(d)}`"
          class="dx-pill"
        >
          {{ d }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import dayjs from "dayjs";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { usePatientsStore } from "@/features/patients/stores/patientsStore";
import { usePrescriptionsStore } from "@/features/prescriptions/stores/prescriptionsStore";
import { useChambersStore } from "@/features/chambers/stores/chambersStore";

const authStore = useAuthStore();
const patientsStore = usePatientsStore();
const rxStore = usePrescriptionsStore();
const chambersStore = useChambersStore();

const formattedDate = computed(() => dayjs().format("dddd, MMMM D, YYYY"));
const todayCount = computed(
  () =>
    rxStore.prescriptions.filter((r) =>
      dayjs(r.visitDate).isSame(dayjs(), "day"),
    ).length,
);
const recentRx = computed(() => rxStore.prescriptions.slice(0, 5));
const fmtDate = (d) => (d ? dayjs(d).format("MMM D") : "—");

const stats = computed(() => [
  { icon: "📋", value: rxStore.total, label: "Total Prescriptions" },
  { icon: "👥", value: patientsStore.total, label: "Patients" },
  { icon: "🏥", value: chambersStore.chambers.length, label: "Chambers" },
  { icon: "📅", value: todayCount.value, label: "Today's Rx" },
]);

const quickActions = [
  {
    to: "/prescriptions/new",
    icon: "✍️",
    label: "New Prescription",
    bg: "rgba(238,136,117,0.1)",
    border: "rgba(238,136,117,0.25)",
    color: "#C05030",
  },
  {
    to: "/patients/new",
    icon: "👤",
    label: "Add Patient",
    bg: "rgba(46,107,139,0.08)",
    border: "rgba(46,107,139,0.2)",
    color: "#2E6B8B",
  },
  {
    to: "/medicines",
    icon: "💊",
    label: "Medicines",
    bg: "rgba(46,180,120,0.08)",
    border: "rgba(46,180,120,0.2)",
    color: "#2a9d6e",
  },
  {
    to: "/chambers",
    icon: "🏥",
    label: "Chambers",
    bg: "rgba(30,42,74,0.06)",
    border: "rgba(30,42,74,0.12)",
    color: "#1E2A4A",
  },
];

const commonDx = [
  "Hypertension",
  "Type 2 Diabetes",
  "Fever",
  "URI",
  "Dyspepsia",
  "Allergic Rhinitis",
  "Asthma",
  "Gastritis",
  "Bronchitis",
  "Migraine",
  "UTI",
  "IBS",
  "Hypothyroidism",
];

onMounted(async () => {
  await Promise.all([
    rxStore.fetchAll({ limit: 10 }),
    patientsStore.fetchAll(),
    chambersStore.fetchAll(),
  ]);
});
</script>
<style scoped>
/* doctor header design */
.doctor-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(
    119deg,
    rgb(251 202 178 / 29%) 0%,
    rgba(244, 165, 138, 0.7) 50%,
    rgba(236, 138, 114, 0.5) 100%
  );
  border-radius: 16px;
  padding: 50px 40px;
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.doctor-header-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doctor-header:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.doctor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ee8875;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 22px;
  font-weight: 800;
  color: #1e2a4a;
  line-height: 1.2;
  margin-bottom: 4px;
}

.doctor-designation {
  font-size: 14px;
  color: #2e8b8b;
}

.doctor-sub {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  color: #363535;
  margin-top: 8px;
}

.doctor-sub-item {
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.doctor-stats {
  display: flex;
  gap: 20px;
  border-top: 1px solid rgba(30, 42, 74, 0.1);
  padding-top: 16px;
}

.mini-stat {
  font-size: 12px;
  color: #5e6a85;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.orange {
  background: #ee8875;
}

.dot.blue {
  background: #2e6b8b;
}

@media (max-width: 768px) {
  .doctor-header {
    padding: 16px;
    gap: 12px;
  }

  .doctor-header-content .flex {
    flex-wrap: wrap;
  }

  .doctor-avatar {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }

  .doctor-name {
    font-size: 18px;
  }

  .doctor-designation {
    font-size: 12px;
    margin-top: 2px;
  }

  .doctor-sub {
    display: none;
  }

  .doctor-sub-mobile {
    display: block;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 12px;
    margin-top: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .mobile-sub-item {
    font-size: 11px;
    color: #1e2a4a;
    display: block;
    margin-bottom: 8px;
  }

  .mobile-sub-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  .mobile-sub-item {
    font-size: 11px;
    color: #1e2a4a;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 20px;
    white-space: nowrap;
  }

  .doctor-stats {
    padding-top: 12px;
    gap: 16px;
  }

  .mini-stat {
    font-size: 11px;
  }

  .stat-label-mobile {
    display: inline;
  }
}

@media (min-width: 769px) {
  .doctor-header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .doctor-sub-mobile {
    display: none;
  }

  .stat-label-mobile {
    display: none;
  }
}

/* stats design */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-top: 20px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(238, 136, 117, 0.35),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  filter: blur(35px);
  pointer-events: none;
}

.stat-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  opacity: 0.35;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border-radius: 12px;
  background: rgba(238, 136, 117, 0.08);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.stat-label {
  display: inline;
  font-size: 12px;
  color: #6c6b6b;
  margin-top: 2px;
  font-weight: 600;
}

/* quick action + recent design */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-card {
  position: relative;
  background: white;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: 0.3s;
  margin-top: 20px;
}

.dashboard-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 20% 20%,
    rgba(238, 136, 117, 0.25),
    transparent 60%
  );
  opacity: 0;
  filter: blur(40px);
  transition: 0.35s;
  pointer-events: none;
}

.dashboard-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.dashboard-card:hover::before {
  opacity: 0.35;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.card-header.space-between {
  justify-content: space-between;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.see-all {
  font-size: 12px;
  font-weight: 700;
  color: #ee8875;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 14px;
  background: #fafbff;
  border: 1px solid rgba(30, 42, 74, 0.06);
  transition: 0.25s;
  text-decoration: none;
}

.quick-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.quick-icon {
  font-size: 22px;
}

.quick-label {
  font-size: 12px;
  font-weight: 700;
  color: #5e6a85;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 190px;
  overflow-y: auto;
  overflow-x: hidden;
}

.recent-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  transition: 0.25s;
  border: 1px solid transparent;
}

.recent-card:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: rgba(238, 136, 117, 0.15);
  transform: translateX(3px);
}

.patient-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.diagnosis {
  font-size: 11px;
  color: #9aa0b8;
  margin-top: 2px;
}

.date-pill {
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 20px;
  background: rgba(238, 136, 117, 0.12);
  color: #c05030;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 30px 0;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: #9aa0b8;
}

.create-btn {
  font-size: 12px;
  font-weight: 700;
  color: #ee8875;
  margin-top: 6px;
  display: inline-block;
}

/* common diagnoses */
.dx-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dx-pill {
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(238, 136, 117, 0.1);
  color: #c05030;
  border: 1px solid rgba(238, 136, 117, 0.2);
  transition: 0.25s;
  text-decoration: none;
  cursor: pointer;
}

.dx-pill:hover {
  transform: translateY(-2px) scale(1.05);
  background: #ee8875;
  color: white;
  box-shadow: 0 6px 16px rgba(238, 136, 117, 0.35);
}

@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}
</style>
