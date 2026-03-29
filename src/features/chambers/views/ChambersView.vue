<template>
  <div class="chambers-container fade-in-up">
    <!-- Header Section -->
    <div class="chambers-header">
      <div class="header-left">
        <div class="header-icon">🏥</div>
        <div>
          <h2 class="header-title">Your Chambers</h2>
          <p class="header-subtitle">Manage your practice locations</p>
        </div>
      </div>
      <button
        @click="showForm = !showForm"
        class="add-chamber-btn"
        :class="{ 'cancel-mode': showForm }"
      >
        <svg
          v-if="!showForm"
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
        <span>{{ showForm ? "Cancel" : "Add Chamber" }}</span>
      </button>
    </div>

    <!-- Add Form - Modern Design -->
    <transition name="slide-down">
      <div v-if="showForm" class="add-form-card">
        <div class="form-header">
          <div class="form-icon">✨</div>
          <h4 class="form-title">Add New Chamber</h4>
        </div>
        <div class="form-body">
          <div class="form-group">
            <label class="form-label">Chamber Name</label>
            <div class="input-wrapper">
              <span class="input-icon">🏥</span>
              <input
                v-model="form.name"
                class="form-input"
                placeholder="e.g., Dhanmondi Chamber"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <div class="input-wrapper">
              <span class="input-icon">📍</span>
              <input
                v-model="form.address"
                class="form-input"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button @click="showForm = false" class="btn-cancel">Cancel</button>
          <button @click="save" :disabled="store.loading" class="btn-save">
            <div v-if="store.loading" class="btn-spinner"></div>
            <span>{{ store.loading ? "Saving..." : "Save Chamber" }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Loading State -->
    <div v-if="store.loading && !store.chambers.length" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Loading chambers...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="store.chambers.length === 0" class="empty-state">
      <div class="empty-icon">🏥</div>
      <h3 class="empty-title">No chambers yet</h3>
      <p class="empty-desc">Add your practice locations to get started</p>
    </div>

    <!-- Chambers Grid - Modern Cards -->
    <div v-else class="chambers-grid">
      <div v-for="c in store.chambers" :key="c.chamberId" class="chamber-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon">
              <span>🏥</span>
            </div>
            <div class="action-buttons">
              <button
                @click="editChamber(c)"
                class="edit-btn"
                title="Edit chamber"
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
              </button>
              <button @click="del(c)" class="delete-btn" title="Delete chamber">
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
          <h4 class="chamber-name">{{ c.name }}</h4>
          <div class="chamber-address">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{{ c.address || "No address provided" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="modal-overlay"
      @click.self="closeEditModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">✏️</div>
          <h3 class="modal-title">Edit Chamber</h3>
          <button @click="closeEditModal" class="modal-close">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Chamber Name</label>
            <div class="input-wrapper">
              <span class="input-icon">🏥</span>
              <input
                v-model="editForm.name"
                class="form-input"
                placeholder="e.g., Dhanmondi Chamber"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <div class="input-wrapper">
              <span class="input-icon">📍</span>
              <input
                v-model="editForm.address"
                class="form-input"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeEditModal" class="btn-cancel">Cancel</button>
          <button
            @click="updateChamber"
            :disabled="store.loading"
            class="btn-save"
          >
            <div v-if="store.loading" class="btn-spinner"></div>
            <span>{{ store.loading ? "Updating..." : "Update Chamber" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { useChambersStore } from "../stores/chambersStore";

const store = useChambersStore();
const showForm = ref(false);
const form = reactive({ name: "", address: "" });

// Edit modal
const showEditModal = ref(false);
const editForm = reactive({ id: null, name: "", address: "" });
const currentChamber = ref(null);

async function save() {
  if (!form.name.trim()) {
    toast.error("Enter chamber name");
    return;
  }
  try {
    await store.createChamber(form);
    toast.success("Chamber added successfully!");
    showForm.value = false;
    Object.assign(form, { name: "", address: "" });
  } catch {
    toast.error(store.error || "Failed to add chamber");
  }
}

function editChamber(chamber) {
  currentChamber.value = chamber;
  editForm.id = chamber.chamberId;
  editForm.name = chamber.name;
  editForm.address = chamber.address || "";
  showEditModal.value = true;
}

async function updateChamber() {
  if (!editForm.name.trim()) {
    toast.error("Enter chamber name");
    return;
  }
  try {
    await store.updateChamber(editForm.id, {
      name: editForm.name,
      address: editForm.address,
    });
    toast.success("Chamber updated successfully!");
    closeEditModal();
  } catch {
    toast.error(store.error || "Failed to update chamber");
  }
}

function closeEditModal() {
  showEditModal.value = false;
  editForm.id = null;
  editForm.name = "";
  editForm.address = "";
  currentChamber.value = null;
}

async function del(c) {
  if (!confirm(`Delete "${c.name}"? This action cannot be undone.`)) return;
  try {
    await store.deleteChamber(c.chamberId);
    toast.success("Chamber deleted");
  } catch {
    toast.error("Failed to delete chamber");
  }
}

onMounted(() => store.fetchAll());
</script>

<style scoped>
.chambers-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* ========== Header Styles ========== */
.chambers-header {
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

.add-chamber-btn {
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
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-chamber-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(238, 136, 117, 0.3);
}

.add-chamber-btn.cancel-mode {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 12px;
  background: transparent;
  color: #5a6282;
  border: 1.5px solid rgba(30, 42, 74, 0.15);
  box-shadow: none;
}

.add-chamber-btn.cancel-mode:hover {
  transform: none;
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

/* ========== Form Styles ========== */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.add-form-card {
  background: white;
  border-radius: 24px;
  margin-bottom: 32px;
  overflow: hidden;
  border: 1px solid rgba(30, 42, 74, 0.08);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(
    135deg,
    rgba(238, 136, 117, 0.08),
    rgba(46, 107, 139, 0.05)
  );
  border-bottom: 1px solid rgba(30, 42, 74, 0.06);
}

.form-icon {
  font-size: 24px;
}

.form-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.form-body {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 11px;
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

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: 14px;
  border: 1.5px solid rgba(30, 42, 74, 0.12);
  background: white;
  color: #1e2a4a;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #ee8875;
  box-shadow: 0 0 0 3px rgba(238, 136, 117, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(30, 42, 74, 0.06);
  background: #fafcff;
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  background: transparent;
  border: 1.5px solid rgba(30, 42, 74, 0.15);
  color: #5a6282;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  background: #f4a58a;
  color: #1e2a4a;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(238, 136, 117, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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
  width: 50px;
  height: 50px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
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
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 13px;
  color: #9aa0b8;
  margin-bottom: 24px;
}

/* ========== Chambers Grid ========== */
.chambers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.chamber-card {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.chamber-card:hover {
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
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    rgba(238, 136, 117, 0.15),
    rgba(46, 107, 139, 0.08)
  );
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: rgba(46, 107, 139, 0.08);
  border: none;
  color: #2e6b8b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: rgba(46, 107, 139, 0.15);
  transform: scale(1.05);
}

.delete-btn {
  width: 32px;
  height: 32px;
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

.chamber-name {
  font-size: 16px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 8px;
}

.chamber-address {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9aa0b8;
  line-height: 1.5;
}

/* ========== Modal Styles ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(
    135deg,
    rgba(238, 136, 117, 0.08),
    rgba(46, 107, 139, 0.05)
  );
  border-bottom: 1px solid rgba(30, 42, 74, 0.06);
}

.modal-icon {
  font-size: 24px;
}

.modal-title {
  flex: 1;
  font-size: 18px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(30, 42, 74, 0.08);
  border: none;
  color: #5a6282;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(238, 136, 117, 0.15);
  color: #ee8875;
}

.modal-body {
  padding: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(30, 42, 74, 0.06);
  background: #fafcff;
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .chambers-container {
    padding: 16px;
  }

  .form-body {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .chambers-grid {
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
  .chambers-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .add-chamber-btn {
    width: 100%;
    justify-content: center;
  }

  .form-actions,
  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>
