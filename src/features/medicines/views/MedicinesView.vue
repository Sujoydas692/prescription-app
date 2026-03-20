<template>
  <div class="space-y-5">
    <!-- Tabs -->
    <div class="flex gap-1 p-1 rounded-xl w-fit" style="background:rgba(30,42,74,0.07);">
      <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
        class="px-5 py-2 rounded-lg text-[13px] font-bold transition-all"
        :style="activeTab === t.id
          ? 'background:white; color:#1E2A4A; box-shadow:0 2px 8px rgba(0,0,0,0.08);'
          : 'color:#9AA0B8;'"
        style="font-family:'Nunito',sans-serif;">
        {{ t.label }}
      </button>
    </div>

    <!-- ── BRANDS TAB ── -->
    <div v-if="activeTab === 'brands'" class="space-y-4">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-52">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style="color:#9AA0B8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="brandSearch" type="text" placeholder="Search brand name..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] outline-none transition-all"
            style="border-color:rgba(30,42,74,0.14); color:#1E2A4A;"
            @focus="e=>e.target.style.borderColor='#EE8875'"
            @blur="e=>e.target.style.borderColor='rgba(30,42,74,0.14)'" />
        </div>
        <button @click="showAddBrand = !showAddBrand"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90"
          style="background:linear-gradient(135deg,#EE8875,#2E6B8B); font-family:'Nunito',sans-serif;">
          + Add Brand
        </button>
      </div>

      <!-- Add brand form -->
      <div v-if="showAddBrand" class="f-card space-y-4">
        <h4 class="font-extrabold text-[14px]" style="font-family:'Nunito',sans-serif; color:#1E2A4A;">Add New Brand</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="f-group">
            <label class="f-label">Brand Name *</label>
            <input v-model="newBrand.brandName" class="f-control" placeholder="e.g. Napa" />
          </div>
          <div class="f-group">
            <label class="f-label">Generic ID</label>
            <input v-model="newBrand.genericId" class="f-control" placeholder="Generic ID" />
          </div>
          <div class="f-group">
            <label class="f-label">Company ID</label>
            <input v-model="newBrand.companyId" class="f-control" placeholder="Company ID" />
          </div>
          <div class="f-group">
            <label class="f-label">Form</label>
            <select v-model="newBrand.form" class="f-control">
              <option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Injection</option><option>Cream</option><option>Drops</option>
            </select>
          </div>
          <div class="f-group">
            <label class="f-label">Strength</label>
            <input v-model="newBrand.strength" class="f-control" placeholder="e.g. 500mg" />
          </div>
          <div class="f-group">
            <label class="f-label">Price (BDT)</label>
            <input v-model="newBrand.price" type="number" class="f-control" placeholder="0.00" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="showAddBrand=false" class="f-btn-ghost">Cancel</button>
          <button @click="saveBrand" class="f-btn-primary">Save Brand ✓</button>
        </div>
      </div>

      <!-- Brands table -->
      <div class="rounded-2xl overflow-hidden" style="background:white; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 12px rgba(0,0,0,0.04);">
        <div v-if="store.loading" class="text-center py-12 text-[13px]" style="color:#9AA0B8;">Loading...</div>
        <div v-else-if="filteredBrands.length === 0" class="text-center py-12">
          <div class="text-3xl mb-2">💊</div>
          <p class="text-[13px]" style="color:#9AA0B8;">{{ brandSearch ? 'No results for "' + brandSearch + '"' : 'No brands yet' }}</p>
        </div>
        <table v-else class="w-full">
          <thead>
            <tr style="background:rgba(238,136,117,0.07);">
              <th class="med-th">Brand Name</th>
              <th class="med-th">Generic</th>
              <th class="med-th">Company</th>
              <th class="med-th">Form</th>
              <th class="med-th">Strength</th>
              <th class="med-th">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in filteredBrands" :key="b.brandId"
                class="border-b transition-colors"
                style="border-color:rgba(30,42,74,0.06);"
                @mouseover="e=>e.currentTarget.style.background='rgba(238,136,117,0.04)'"
                @mouseout="e=>e.currentTarget.style.background='transparent'">
              <td class="med-td font-bold text-[13px]" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">{{ b.brandName }}</td>
              <td class="med-td text-[13px]" style="color:#5A6282;">{{ b.genericName || '—' }}</td>
              <td class="med-td text-[13px]" style="color:#9AA0B8;">{{ b.companyName || '—' }}</td>
              <td class="med-td">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold" style="background:rgba(46,107,139,0.1); color:#2E6B8B;">{{ b.form }}</span>
              </td>
              <td class="med-td text-[13px]" style="color:#9AA0B8;">{{ b.strength || '—' }}</td>
              <td class="med-td text-[13px] font-bold" style="color:#EE8875;">{{ b.price ? `৳${b.price}` : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── GENERICS TAB ── -->
    <div v-if="activeTab === 'generics'" class="space-y-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style="color:#9AA0B8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="genericSearch" type="text" placeholder="Search generic name..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] outline-none transition-all"
          style="border-color:rgba(30,42,74,0.14); color:#1E2A4A;"
          @focus="e=>e.target.style.borderColor='#EE8875'"
          @blur="e=>e.target.style.borderColor='rgba(30,42,74,0.14)'" />
      </div>
      <div class="rounded-2xl overflow-hidden" style="background:white; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 12px rgba(0,0,0,0.04);">
        <div v-if="store.loading" class="text-center py-12 text-[13px]" style="color:#9AA0B8;">Loading...</div>
        <div v-else-if="filteredGenerics.length === 0" class="text-center py-12">
          <div class="text-3xl mb-2">🧪</div>
          <p class="text-[13px]" style="color:#9AA0B8;">No generics found</p>
        </div>
        <table v-else class="w-full">
          <thead>
            <tr style="background:rgba(238,136,117,0.07);">
              <th class="med-th">Generic Name</th>
              <th class="med-th">Indication</th>
              <th class="med-th">Dose</th>
              <th class="med-th">Pregnancy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in filteredGenerics" :key="g.genericId"
                class="border-b transition-colors"
                style="border-color:rgba(30,42,74,0.06);"
                @mouseover="e=>e.currentTarget.style.background='rgba(238,136,117,0.04)'"
                @mouseout="e=>e.currentTarget.style.background='transparent'">
              <td class="med-td font-bold text-[13px]" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">{{ g.genericName }}</td>
              <td class="med-td text-[12px]" style="color:#5A6282;">{{ g.indication || '—' }}</td>
              <td class="med-td text-[13px]" style="color:#9AA0B8;">{{ g.dose || '—' }}</td>
              <td class="med-td">
                <span v-if="g.pregnancyCategory" class="px-2 py-0.5 rounded-full text-[11px] font-bold" style="background:rgba(224,148,58,0.1); color:#E0943A;">Cat {{ g.pregnancyCategory }}</span>
                <span v-else style="color:#9AA0B8;">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useMedicinesStore } from '../stores/medicinesStore'

const store = useMedicinesStore()
const activeTab = ref('brands')
const brandSearch = ref('')
const genericSearch = ref('')
const showAddBrand = ref(false)

const tabs = [
  { id: 'brands',   label: '💊 Drug Brands' },
  { id: 'generics', label: '🧪 Generics' },
]

const newBrand = reactive({ brandName: '', genericId: '', companyId: '', form: 'Tablet', strength: '', price: '' })

const filteredBrands = computed(() =>
  (store.brands || []).filter(b => !brandSearch.value || b.brandName?.toLowerCase().includes(brandSearch.value.toLowerCase()) || b.genericName?.toLowerCase().includes(brandSearch.value.toLowerCase()))
)
const filteredGenerics = computed(() =>
  (store.generics || []).filter(g => !genericSearch.value || g.genericName?.toLowerCase().includes(genericSearch.value.toLowerCase()))
)

async function saveBrand() {
  if (!newBrand.brandName.trim()) { toast.error('Enter brand name'); return }
  try { await store.createBrand(newBrand); toast.success('Brand added!'); showAddBrand.value = false; Object.assign(newBrand, { brandName: '', genericId: '', companyId: '', form: 'Tablet', strength: '', price: '' }) }
  catch { toast.error('Failed to add brand') }
}

onMounted(async () => {
  await Promise.all([store.fetchBrands(), store.fetchGenerics()])
})
</script>

<style scoped>
.f-card { background:white; border-radius:20px; padding:24px; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 14px rgba(0,0,0,0.04); }
.f-group { display:flex; flex-direction:column; gap:5px; }
.f-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#9AA0B8; }
.f-control { padding:10px 14px; border-radius:12px; border:1.5px solid rgba(30,42,74,0.13); background:white; color:#1E2A4A; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; width:100%; transition:all 0.2s; }
.f-control:focus { border-color:#EE8875; box-shadow:0 0 0 3px rgba(238,136,117,0.1); }
.f-btn-ghost { background:transparent; border:1.5px solid rgba(30,42,74,0.15); color:#5A6282; padding:8px 16px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:12px; cursor:pointer; }
.f-btn-primary { background:linear-gradient(135deg,#EE8875,#2E6B8B); color:white; border:none; padding:9px 20px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:13px; cursor:pointer; }
.med-th { padding:11px 16px; text-align:left; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#EE8875; font-family:'Nunito',sans-serif; }
.med-td { padding:12px 16px; vertical-align:middle; }
</style>
