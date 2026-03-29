<template>
  <div class="medicines-container fade-in-up">
    <!-- Header Section -->
    <div class="medicines-header">
      <div class="header-left">
        <div class="header-icon">💊</div>
        <div>
          <h2 class="header-title">Medicines</h2>
          <p class="header-subtitle">Manage drug brands and generics</p>
        </div>
      </div>
    </div>

    <!-- Modern Tabs -->
    <div class="tabs-container">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="activeTab = t.id"
        class="tab-button"
        :class="{ 'tab-active': activeTab === t.id }"
      >
        <span class="tab-icon">{{ t.icon }}</span>
        <span class="tab-label">{{ t.label }}</span>
      </button>
    </div>

    <!-- ── BRANDS TAB ── -->
    <div v-if="activeTab === 'brands'" class="tab-content">
      <div class="content-header">
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
            v-model="brandSearch"
            type="text"
            placeholder="Search brand name or generic..."
            class="search-input"
            @input="handleBrandSearch"
          />
        </div>
        <button
          @click="showAddBrand = !showAddBrand"
          class="add-btn"
          :class="{ 'cancel-mode': showAddBrand }"
        >
          <svg
            v-if="!showAddBrand"
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
          <span>{{ showAddBrand ? "Cancel" : "Add Brand" }}</span>
        </button>
      </div>

      <!-- Add brand form - Modern Card -->
      <transition name="slide-down">
        <div v-if="showAddBrand" class="add-form-card">
          <div class="form-header">
            <div class="form-icon">✨</div>
            <h4 class="form-title">Add New Brand</h4>
          </div>
          <div class="form-body">
            <div class="form-group">
              <label class="form-label">Brand Name</label>
              <div class="input-wrapper">
                <span class="input-icon">💊</span>
                <input
                  v-model="newBrand.brandName"
                  class="form-input"
                  placeholder="e.g. Napa"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Generic</label>
              <div class="input-wrapper">
                <span class="input-icon">🧪</span>
                <input
                  v-model="newBrand.genericId"
                  class="form-input"
                  placeholder="Generic ID"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Company</label>
              <div class="input-wrapper">
                <span class="input-icon">🏢</span>
                <input
                  v-model="newBrand.companyId"
                  class="form-input"
                  placeholder="Company ID"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Form</label>
              <div class="input-wrapper">
                <span class="input-icon">📦</span>
                <select v-model="newBrand.form" class="form-select">
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Injection</option>
                  <option>Cream</option>
                  <option>Drops</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Strength</label>
              <div class="input-wrapper">
                <span class="input-icon">⚖️</span>
                <input
                  v-model="newBrand.strength"
                  class="form-input"
                  placeholder="e.g. 500mg"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Price (BDT)</label>
              <div class="input-wrapper">
                <span class="input-icon">💰</span>
                <input
                  v-model="newBrand.price"
                  type="number"
                  class="form-input"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click="showAddBrand = false" class="btn-cancel">
              Cancel
            </button>
            <button
              @click="saveBrand"
              :disabled="store.loading"
              class="btn-save"
            >
              <div v-if="store.loading" class="btn-spinner"></div>
              <span>{{ store.loading ? "Saving..." : "Save Brand" }}</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Brands Grid - Modern Cards -->
      <div v-if="store.loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading brands...</p>
      </div>
      <div v-else-if="filteredBrands.length === 0" class="empty-state">
        <div class="empty-icon">💊</div>
        <h3 class="empty-title">
          {{ brandSearch ? "No results found" : "No brands yet" }}
        </h3>
        <p class="empty-desc">
          {{
            brandSearch
              ? `No matches for "${brandSearch}"`
              : "Add your first brand to get started"
          }}
        </p>
        <button
          v-if="!brandSearch"
          @click="showAddBrand = true"
          class="empty-btn"
        >
          Add Your First Brand →
        </button>
      </div>
      <div v-else class="brands-grid">
        <div v-for="b in filteredBrands" :key="b.brandId" class="brand-card">
          <div class="card-gradient"></div>
          <div class="card-content">
            <div class="card-header">
              <div class="brand-icon">💊</div>
              <div class="price-badge" v-if="b.price">৳{{ b.price }}</div>
            </div>
            <h3 class="brand-name">{{ b.brandName }}</h3>
            <div class="brand-details">
              <div class="detail-item">
                <span class="detail-icon">🧪</span>
                <span class="detail-text">{{ b.genericName || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🏢</span>
                <span class="detail-text">{{ b.companyName || "—" }}</span>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-icon">📦</span>
                  <span class="detail-badge">{{ b.form }}</span>
                </div>
                <div class="detail-item" v-if="b.strength">
                  <span class="detail-icon">⚖️</span>
                  <span class="detail-text">{{ b.strength }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        v-if="brandsTotalPages > 1"
        v-model:current-page="brandsCurrentPage"
        :total-pages="brandsTotalPages"
        :total-items="brandsTotalItems"
        :page-size="brandsPageSize"
        @page-change="handleBrandsPageChange"
      />
    </div>

    <!-- ── GENERICS TAB ── -->
    <div v-if="activeTab === 'generics'" class="tab-content">
      <div class="content-header">
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
            v-model="genericSearch"
            type="text"
            placeholder="Search generic name..."
            class="search-input"
            @input="handleGenericSearch"
          />
        </div>
      </div>

      <!-- Generics Grid - Modern Cards -->
      <div v-if="store.loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading generics...</p>
      </div>
      <div v-else-if="filteredGenerics.length === 0" class="empty-state">
        <div class="empty-icon">🧪</div>
        <h3 class="empty-title">
          {{ genericSearch ? "No results found" : "No generics yet" }}
        </h3>
        <p class="empty-desc">
          {{
            genericSearch
              ? `No matches for "${genericSearch}"`
              : "Generics will appear here"
          }}
        </p>
      </div>
      <div v-else class="generics-grid">
        <div
          v-for="g in filteredGenerics"
          :key="g.genericId"
          class="generic-card"
        >
          <div class="card-gradient"></div>
          <div class="card-content">
            <div class="card-header">
              <div class="generic-icon">🧪</div>
              <div v-if="g.pregnancyCategory" class="pregnancy-badge">
                Cat {{ g.pregnancyCategory }}
              </div>
            </div>
            <h3 class="generic-name">{{ g.genericName }}</h3>
            <div class="generic-details">
              <div class="detail-item" v-if="g.indication">
                <span class="detail-icon">📋</span>
                <span class="detail-text">{{ g.indication }}</span>
              </div>
              <div class="detail-item" v-if="g.dose">
                <span class="detail-icon">💊</span>
                <span class="detail-text">{{ g.dose }}</span>
              </div>
              <div class="detail-item" v-if="g.sideEffects">
                <span class="detail-icon">⚠️</span>
                <span class="detail-text">{{ g.sideEffects }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        v-if="genericsTotalPages > 1"
        v-model:current-page="genericsCurrentPage"
        :total-pages="genericsTotalPages"
        :total-items="genericsTotalItems"
        :page-size="genericsPageSize"
        @page-change="handleGenericsPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import { useMedicinesStore } from "../stores/medicinesStore";

const store = useMedicinesStore();
const activeTab = ref("brands");
const brandSearch = ref("");
const genericSearch = ref("");
const showAddBrand = ref(false);

// Brands pagination
const brandsCurrentPage = ref(1);
const brandsPageSize = ref(12);
const brandsTotalItems = ref(0);
const brandsTotalPages = ref(0);
const allBrands = ref([]);

// Generics pagination
const genericsCurrentPage = ref(1);
const genericsPageSize = ref(12);
const genericsTotalItems = ref(0);
const genericsTotalPages = ref(0);
const allGenerics = ref([]);

let brandSearchTimeout;
let genericSearchTimeout;

const tabs = [
  { id: "brands", label: "Drug Brands", icon: "💊" },
  { id: "generics", label: "Generics", icon: "🧪" },
];

const newBrand = reactive({
  brandName: "",
  genericId: "",
  companyId: "",
  form: "Tablet",
  strength: "",
  price: "",
});

// Filtered and paginated brands
const filteredBrands = computed(() => {
  const start = (brandsCurrentPage.value - 1) * brandsPageSize.value;
  const end = start + brandsPageSize.value;
  let brands = allBrands.value;

  if (brandSearch.value) {
    brands = brands.filter(
      (b) =>
        b.brandName?.toLowerCase().includes(brandSearch.value.toLowerCase()) ||
        b.genericName?.toLowerCase().includes(brandSearch.value.toLowerCase()),
    );
  }

  brandsTotalItems.value = brands.length;
  brandsTotalPages.value = Math.ceil(
    brandsTotalItems.value / brandsPageSize.value,
  );
  return brands.slice(start, end);
});

// Filtered and paginated generics
const filteredGenerics = computed(() => {
  const start = (genericsCurrentPage.value - 1) * genericsPageSize.value;
  const end = start + genericsPageSize.value;
  let generics = allGenerics.value;

  if (genericSearch.value) {
    generics = generics.filter((g) =>
      g.genericName?.toLowerCase().includes(genericSearch.value.toLowerCase()),
    );
  }

  genericsTotalItems.value = generics.length;
  genericsTotalPages.value = Math.ceil(
    genericsTotalItems.value / genericsPageSize.value,
  );
  return generics.slice(start, end);
});

// Handle brand search with debounce
function handleBrandSearch() {
  clearTimeout(brandSearchTimeout);
  brandSearchTimeout = setTimeout(() => {
    brandsCurrentPage.value = 1;
  }, 300);
}

// Handle generic search with debounce
function handleGenericSearch() {
  clearTimeout(genericSearchTimeout);
  genericSearchTimeout = setTimeout(() => {
    genericsCurrentPage.value = 1;
  }, 300);
}

// Handle brands page change
function handleBrandsPageChange(page) {
  brandsCurrentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle generics page change
function handleGenericsPageChange(page) {
  genericsCurrentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveBrand() {
  if (!newBrand.brandName.trim()) {
    toast.error("Enter brand name");
    return;
  }
  try {
    await store.createBrand(newBrand);
    toast.success("Brand added successfully!");
    showAddBrand.value = false;
    Object.assign(newBrand, {
      brandName: "",
      genericId: "",
      companyId: "",
      form: "Tablet",
      strength: "",
      price: "",
    });
  } catch {
    toast.error("Failed to add brand");
  }
}

async function loadBrands() {
  await store.fetchBrands();
  allBrands.value = [...store.brands];
  brandsTotalItems.value = allBrands.value.length;
  brandsTotalPages.value = Math.ceil(
    brandsTotalItems.value / brandsPageSize.value,
  );
  brandsCurrentPage.value = 1;
}

async function loadGenerics() {
  await store.fetchGenerics();
  allGenerics.value = [...store.generics];
  genericsTotalItems.value = allGenerics.value.length;
  genericsTotalPages.value = Math.ceil(
    genericsTotalItems.value / genericsPageSize.value,
  );
  genericsCurrentPage.value = 1;
}

// Watch for search changes
watch(brandSearch, () => {
  brandsCurrentPage.value = 1;
});

watch(genericSearch, () => {
  genericsCurrentPage.value = 1;
});

onMounted(async () => {
  await Promise.all([loadBrands(), loadGenerics()]);
});
</script>

<style scoped>
.medicines-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* ========== Header Styles ========== */
.medicines-header {
  margin-bottom: 32px;
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

/* ========== Tabs Styles ========== */
.tabs-container {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(30, 42, 74, 0.1);
  padding-bottom: 0;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #9aa0b8;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #ee8875;
}

.tab-active {
  color: #ee8875;
}

.tab-active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ee8875;
  border-radius: 2px;
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  font-family: "Nunito", sans-serif;
  font-weight: 700;
}

/* ========== Content Header ========== */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 250px;
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
  transition: all 0.3s ease;
}

.search-input:hover {
  background: white;
  border-color: rgba(238, 136, 117, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
  border-color: #ee8875;
  box-shadow:
    0 0 0 4px rgba(238, 136, 117, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
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

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  background: #f4a58a;
  color: #1e2a4a;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(238, 136, 117, 0.3);
}

.add-btn.cancel-mode {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 12px;
  background: transparent;
  color: #5a6282;
  border: 1.5px solid rgba(30, 42, 74, 0.15);
  box-shadow: none;
}

.add-btn.cancel-mode:hover {
  transform: none;
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

/* ========== Add Form Styles ========== */
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
  grid-template-columns: repeat(3, 1fr);
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

.form-input,
.form-select {
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

.form-input:focus,
.form-select:focus {
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

/* ========== Brands Grid ========== */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.brand-card {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.brand-card:hover {
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

.brand-icon {
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

.price-badge {
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(46, 107, 139, 0.1);
  color: #2e6b8b;
  font-size: 14px;
  font-weight: 700;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 12px;
}

.brand-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(30, 42, 74, 0.06);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.detail-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.detail-icon {
  font-size: 14px;
  width: 24px;
}

.detail-text {
  color: #5e6a85;
}

.detail-badge {
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(46, 107, 139, 0.1);
  color: #2e6b8b;
  font-size: 11px;
  font-weight: 600;
}

/* ========== Generics Grid ========== */
.generics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.generic-card {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.generic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.generic-icon {
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

.pregnancy-badge {
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(224, 148, 58, 0.1);
  color: #e0943a;
  font-size: 12px;
  font-weight: 700;
}

.generic-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  margin-bottom: 12px;
}

.generic-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(30, 42, 74, 0.06);
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .medicines-container {
    padding: 16px;
  }

  .form-body {
    grid-template-columns: 1fr;
  }

  .brands-grid,
  .generics-grid {
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

  .tab-button {
    padding: 8px 16px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .content-header {
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  .search-wrapper {
    width: 100%;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>
