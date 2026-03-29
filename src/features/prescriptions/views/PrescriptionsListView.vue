<template>
  <div class="prescriptions-container fade-in-up">
    <!-- Header Section -->
    <div class="prescriptions-header">
      <div class="header-left">
        <div class="header-icon">📋</div>
        <div>
          <h2 class="header-title">Prescriptions</h2>
          <p class="header-subtitle">Manage patient prescriptions</p>
        </div>
      </div>
      <RouterLink to="/prescriptions/new" class="add-prescription-btn">
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>New Prescription</span>
      </RouterLink>
    </div>

    <!-- Search Bar -->
    <div class="search-wrapper">
      <svg
        class="search-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search by patient or diagnosis..."
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Loading prescriptions...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3 class="empty-title">No prescriptions yet</h3>
      <p class="empty-desc">Create your first prescription to get started</p>
      <RouterLink to="/prescriptions/new" class="empty-btn">
        Create your first prescription →
      </RouterLink>
    </div>

    <!-- Prescriptions Grid - Modern Cards -->
    <div v-else class="prescriptions-grid">
      <div
        v-for="rx in filtered"
        :key="rx.prescriptionId"
        class="prescription-card"
      >
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="avatar">
              {{ rx.patientName?.charAt(0)?.toUpperCase() || "?" }}
            </div>
            <div class="action-buttons">
              <RouterLink
                :to="`/prescriptions/${rx.prescriptionId}/edit`"
                class="edit-btn"
                title="Edit prescription"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </RouterLink>
              <button
                @click="del(rx)"
                class="delete-btn"
                title="Delete prescription"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <h3
            class="patient-name"
            @click="$router.push(`/prescriptions/${rx.prescriptionId}`)"
          >
            {{ rx.patientName || "—" }}
          </h3>
          <div class="prescription-details">
            <div class="detail-item">
              <span class="detail-text-special">{{
                rx.diagnosis || "No diagnosis"
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🏥</span>
              <span class="detail-text">{{ rx.chamberName || "—" }}</span>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span class="detail-text"
                  >Visit: {{ fmtDate(rx.visitDate) }}</span
                >
              </div>
              <div class="detail-item" v-if="rx.nextVisitDate">
                <span class="detail-icon">⏰</span>
                <span class="detail-text"
                  >Next: {{ fmtDate(rx.nextVisitDate) }}</span
                >
              </div>
            </div>
          </div>
          <div class="card-footer">
            <RouterLink
              :to="`/prescriptions/${rx.prescriptionId}`"
              class="view-details-btn"
            >
              View Details
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <Pagination
      v-if="totalPages > 1"
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :page-size="pageSize"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import { usePrescriptionsStore } from "../stores/prescriptionsStore";
import Pagination from "@/components/common/Pagination.vue";

const store = usePrescriptionsStore();
const search = ref("");

const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const totalPages = ref(0);
const allPrescriptions = ref([]);

let searchTimeout;

const fmtDate = (d) => (d ? dayjs(d).format("MMM D, YYYY") : "—");

const filtered = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  let prescriptions = allPrescriptions.value;

  // Apply search filter
  if (search.value) {
    prescriptions = prescriptions.filter(
      (r) =>
        r.patientName?.toLowerCase().includes(search.value.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(search.value.toLowerCase()),
    );
  }

  // Update total items and pages
  totalItems.value = prescriptions.length;
  totalPages.value = Math.ceil(totalItems.value / pageSize.value);

  // Return paginated prescriptions
  return prescriptions.slice(start, end);
});

async function loadPrescriptions() {
  await store.fetchAll();
  allPrescriptions.value = [...store.prescriptions];
  totalItems.value = allPrescriptions.value.length;
  totalPages.value = Math.ceil(totalItems.value / pageSize.value);
  currentPage.value = 1;
}

// Handle search with debounce
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
  }, 300);
}

// Handle page change
function handlePageChange(page) {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function del(rx) {
  if (!confirm(`Delete prescription for ${rx.patientName}?`)) return;
  try {
    await store.deletePrescription(rx.prescriptionId);
    toast.success("Deleted");
    await loadPrescriptions();
  } catch {
    toast.error("Failed to delete");
  }
}

watch(search, () => {
  currentPage.value = 1;
});

onMounted(() => {
  loadPrescriptions();
});
</script>

<style scoped>
.prescriptions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* ========== Header Styles ========== */
.prescriptions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    rgba(238, 136, 117, 0.15),
    rgba(46, 107, 139, 0.1)
  );
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.header-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 13px;
  color: #9aa0b8;
}

.add-prescription-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  background: #f4a58a;
  color: #1e2a4a;
  text-decoration: none;
  transition: all 0.3s ease;
}

.add-prescription-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(238, 136, 117, 0.3);
}

/* ========== Search Styles ========== */
.search-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(30, 42, 74, 0.12);
  background: white;
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  color: #1e2a4a;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:hover {
  background: white;
  border-color: rgba(238, 136, 117, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
  border-color: #ee8875;
  box-shadow: 0 0 0 4px rgba(238, 136, 117, 0.1);
  background: white;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9aa0b8;
  pointer-events: none;
  transition: all 0.3s ease;
  stroke-width: 2;
}

.search-input:focus + .search-icon {
  color: #ee8875;
  transform: translateY(-50%) scale(1.05);
}

/* Placeholder Styles */
.search-input::placeholder {
  color: #9aa0b8;
  font-size: 13px;
  font-weight: 400;
  transition: all 0.3s ease;
}

.search-input:focus::placeholder {
  opacity: 0.6;
  transform: translateX(4px);
}

/* ========== Loading State ========== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 60px 40px;
  background: white;
  border-radius: 28px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  gap: 20px;
  transition: 0.3s;
}

.loading-state::before {
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

.loading-state:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.loading-state:hover::before {
  opacity: 0.35;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
}

.spinner-ring:nth-child(1) {
  border-top-color: #ee8875;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.spinner-ring:nth-child(2) {
  border-right-color: #2e8b8b;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse;
  animation-delay: -0.3s;
}
.spinner-ring:nth-child(3) {
  border-bottom-color: #f4a58a;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  animation-delay: -0.6s;
}
.spinner-ring:nth-child(4) {
  border-left-color: #2e6b8b;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse;
  animation-delay: -0.9s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 13px;
  color: #9aa0b8;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* ========== Empty State ========== */
.empty-state {
  position: relative;
  background: white;
  text-align: center;
  border-radius: 28px;
  padding: 60px 40px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: 0.3s;
  margin-top: 20px;
}

.empty-state::before {
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

.empty-state:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.empty-state:hover::before {
  opacity: 0.35;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.empty-desc {
  font-size: 13px;
  color: #9aa0b8;
  margin-bottom: 10px;
}

.empty-btn {
  font-size: 15px;
  font-weight: 700;
  color: #ee8875;
  text-decoration: none;
}

/* ========== Prescriptions Grid ========== */
.prescriptions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.prescription-card {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.prescription-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ee8875, #2e8b8b, #f4a58a);
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ee8875;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(46, 107, 139, 0.08);
  border: none;
  color: #2e6b8b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.edit-btn:hover {
  background: rgba(46, 107, 139, 0.15);
  transform: scale(1.05);
}

.delete-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(224, 82, 82, 0.08);
  border: none;
  color: #e05252;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(224, 82, 82, 0.15);
  transform: scale(1.05);
}

.patient-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 12px;
  cursor: pointer;
  transition: color 0.2s;
}

.patient-name:hover {
  color: #ee8875;
}

.prescription-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid rgba(30, 42, 74, 0.06);
  border-bottom: 1px solid rgba(30, 42, 74, 0.06);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-icon {
  font-size: 14px;
  width: 24px;
}

.detail-text {
  color: #5e6a85;
}

.detail-text-special {
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 30px;
  background: rgba(238, 136, 117, 0.1);
  color: #c05030;
  border: 1px solid rgba(238, 136, 117, 0.2);
}

.card-footer {
  text-align: right;
}

.view-details-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #ee8875;
  text-decoration: none;
  transition: all 0.2s;
}

.view-details-btn:hover {
  gap: 10px;
  color: #c05030;
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .prescriptions-container {
    padding: 16px;
  }

  .prescriptions-grid {
    grid-template-columns: 1fr;
  }

  .header-title {
    font-size: 20px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .prescriptions-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .add-prescription-btn {
    width: 100%;
    justify-content: center;
  }

  .card-header {
    flex-wrap: wrap;
    gap: 12px;
  }

  .action-buttons {
    margin-left: auto;
  }

  .detail-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
