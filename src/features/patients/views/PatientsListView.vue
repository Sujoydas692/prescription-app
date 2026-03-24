<template>
  <div class="space-y-5 fade-in-up">
    <!-- Search + Add -->
    <div class="search-add-container">
      <div class="search-wrapper">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or mobile..."
          class="search-input"
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
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <RouterLink to="/patients/new" class="add-btn">
        + Add Patient
      </RouterLink>
    </div>

    <!-- Patients table -->
    <div class="patients-card">
      <div v-if="store.loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading Patients...</p>
      </div>

      <div v-else-if="filtered.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">👥</div>

        <p class="empty-title">No patients found</p>

        <RouterLink to="/patients/new" class="empty-link">
          Add your first patient →
        </RouterLink>
      </div>

      <table v-else class="w-full patients-table">
        <thead>
          <tr>
            <th class="pt-th">Name</th>
            <th class="pt-th">Mobile</th>
            <th class="pt-th">Age</th>
            <th class="pt-th text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.patientId"
            class="patient-row"
            @click="$router.push(`/patients/${p.patientId}`)"
          >
            <td class="pt-td">
              <div class="flex items-center gap-3" style="gap: 10px">
                <div class="avatar">
                  {{ p.fullName?.charAt(0)?.toUpperCase() || "?" }}
                </div>

                <span class="patient-name">
                  {{ p.fullName }}
                </span>
              </div>
            </td>

            <td class="pt-td text-[13px]" style="color: #9aa0b8">
              {{ p.mobileNumber }}
            </td>

            <td class="pt-td text-[13px]" style="color: #9aa0b8">
              {{ p.age ? `${p.age} yrs` : "—" }}
            </td>

            <td class="pt-td text-right" @click.stop>
              <div
                class="flex items-center justify-end gap-2"
                style="gap: 10px"
              >
                <RouterLink
                  :to="`/patients/${p.patientId}`"
                  class="act-btn view"
                >
                  View
                </RouterLink>

                <RouterLink
                  :to="`/patients/${p.patientId}/edit`"
                  class="act-btn edit"
                >
                  Edit
                </RouterLink>

                <button @click="del(p)" class="act-btn delete">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { usePatientsStore } from "../stores/patientsStore";
const store = usePatientsStore();
const search = ref("");
const filtered = computed(() =>
  store.patients.filter(
    (p) =>
      !search.value ||
      p.fullName?.toLowerCase().includes(search.value.toLowerCase()) ||
      p.mobileNumber?.includes(search.value),
  ),
);
async function del(p) {
  if (!confirm(`Delete patient "${p.fullName}"?`)) return;
  try {
    await store.deletePatient(p.patientId);
    toast.success("Deleted");
  } catch {
    toast.error("Failed");
  }
}
onMounted(() => store.fetchAll());
</script>

<style scoped>
/* ========== Loading Animation Styles ========== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 20px;
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
  font-weight: 500;
  letter-spacing: 0.5px;
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
/* Search and Add Container */
.search-add-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  width: 100%;
}

/* Search Wrapper */
.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

/* Search Input */
.search-input {
  width: 100%;
  padding: 12px 44px 12px 16px;
  border-radius: 12px;
  border: 1px solid #c6cad6;
  background: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  font-family: "DM Sans", sans-serif;
  color: #1e2a4a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
}

/* Search Icon */
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

/* Hover Effects */
.search-input:hover {
  background: white;
  border-color: rgba(238, 136, 117, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

/* Focus Effects */
.search-input:focus {
  border-color: #ee8875;
  box-shadow:
    0 0 0 4px rgba(238, 136, 117, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  background: white;
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

/* Add Button */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #1e2a4a;
  background: #f4a58a;
  font-family: "Nunito", sans-serif;
  box-shadow: 0 6px 18px rgba(238, 136, 117, 0.35);
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
  min-width: 130px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(238, 136, 117, 0.45);
}

/* Patients Card */
.patients-card {
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

.patients-card::before {
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

.patients-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.patients-card:hover::before {
  opacity: 0.35;
}

/* Table Styles */
.patients-table {
  width: 100%;
  border-collapse: collapse;
}

.patients-table thead {
  background: rgba(238, 136, 117, 0.07);
}

.pt-th {
  padding: 12px 16px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ee8875;
  font-family: "Nunito", sans-serif;
  text-align: left;
}

.pt-td {
  padding: 14px 16px;
}

.patient-row {
  border-bottom: 1px solid rgba(30, 42, 74, 0.06);
  cursor: pointer;
  transition: 0.2s;
}

.patient-row:hover {
  background: rgba(238, 136, 117, 0.05);
  transform: translateX(2px);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #ee8875, #2e6b8b);
  flex-shrink: 0;
}

.patient-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Action Buttons */
.act-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: 0.2s;
  border: none;
}

.act-btn:hover {
  transform: translateY(-1px);
}

.view {
  background: rgba(46, 107, 139, 0.12);
  color: #2e6b8b;
}

.edit {
  background: rgba(238, 136, 117, 0.12);
  color: #c05030;
}

.delete {
  background: rgba(224, 82, 82, 0.1);
  color: #e05252;
}

/* Empty State */
.empty-title {
  font-size: 14px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 4px;
}

.empty-link {
  font-size: 13px;
  font-weight: 700;
  color: #ee8875;
  text-decoration: none;
}

/* ========== Responsive Design ========== */

/* Desktop (992px to 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .search-input {
    font-size: 14px;
    padding: 12px 44px 12px 16px;
  }
}

/* Tablet (768px to 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .search-add-container {
    gap: 10px;
  }

  .search-input {
    font-size: 13px;
    padding: 10px 40px 10px 14px;
  }

  .search-icon {
    right: 14px;
    width: 16px;
    height: 16px;
  }

  .add-btn {
    padding: 10px 16px;
    font-size: 13px;
    min-width: 120px;
  }

  .patients-card {
    padding: 16px;
  }

  .pt-th,
  .pt-td {
    padding: 10px 12px;
  }

  .pt-td:last-child {
    white-space: nowrap;
  }

  .act-btn {
    padding: 5px 10px;
    font-size: 10px;
  }
}

/* Mobile Large (576px to 767px) */
@media (min-width: 576px) and (max-width: 767px) {
  .search-add-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    font-size: 14px;
    padding: 12px 44px 12px 16px;
  }

  .search-icon {
    right: 16px;
    width: 18px;
    height: 18px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
    font-size: 14px;
  }

  .patients-card {
    padding: 16px;
    overflow-x: auto;
  }

  .patients-table {
    min-width: 600px;
  }
}

/* Mobile Small (up to 575px) */
@media (max-width: 575px) {
  .search-add-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    font-size: 14px;
    padding: 12px 44px 12px 14px;
  }

  .search-icon {
    right: 14px;
    width: 18px;
    height: 18px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 14px;
  }

  .patients-card {
    padding: 12px;
    overflow-x: auto;
    border-radius: 14px;
  }

  .patients-table {
    min-width: 550px;
  }

  .pt-th,
  .pt-td {
    padding: 10px 8px;
    font-size: 12px;
  }

  .pt-th {
    font-size: 9px;
  }

  .avatar {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

  .patient-name {
    font-size: 12px;
  }

  .act-btn {
    padding: 4px 8px;
    font-size: 10px;
  }

  .flex.items-center.gap-3 {
    gap: 6px !important;
  }

  .flex.items-center.justify-end.gap-2 {
    gap: 4px !important;
    flex-wrap: wrap;
  }
}

/* Very Small Mobile (up to 375px) */
@media (max-width: 375px) {
  .search-input {
    font-size: 13px;
    padding: 10px 40px 10px 12px;
  }

  .search-icon {
    right: 12px;
    width: 16px;
    height: 16px;
  }

  .add-btn {
    font-size: 13px;
    padding: 10px 14px;
  }

  .patients-card {
    padding: 10px;
  }

  .pt-th,
  .pt-td {
    padding: 8px 6px;
  }

  .pt-th {
    font-size: 8px;
  }

  .pt-td {
    font-size: 11px;
  }

  .avatar {
    width: 24px;
    height: 24px;
    font-size: 9px;
  }

  .patient-name {
    font-size: 11px;
  }

  .act-btn {
    padding: 3px 6px;
    font-size: 9px;
  }
}
</style>
