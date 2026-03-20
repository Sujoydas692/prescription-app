<template>
  <div class="space-y-5">

    <!-- Filters bar -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-52">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style="color:#9AA0B8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search by patient or diagnosis..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] outline-none transition-all"
          style="border-color:rgba(30,42,74,0.14); color:#1E2A4A; font-family:'DM Sans',sans-serif;"
          @focus="e=>e.target.style.borderColor='#EE8875'"
          @blur="e=>e.target.style.borderColor='rgba(30,42,74,0.14)'" />
      </div>
      <RouterLink to="/prescriptions/new"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90 flex-shrink-0"
        style="background:linear-gradient(135deg,#EE8875,#2E6B8B); font-family:'Nunito',sans-serif; box-shadow:0 3px 14px rgba(238,136,117,0.35);">
        + New Prescription
      </RouterLink>
    </div>

    <!-- Table -->
    <div class="rounded-2xl overflow-hidden" style="background:white; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 12px rgba(0,0,0,0.04);">
      <div v-if="store.loading" class="text-center py-16">
        <div class="text-3xl mb-3">⏳</div>
        <p class="text-[13px]" style="color:#9AA0B8;">Loading prescriptions...</p>
      </div>
      <div v-else-if="filtered.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-[14px] font-bold mb-1" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">No prescriptions found</p>
        <RouterLink to="/prescriptions/new" class="text-[13px] font-bold" style="color:#EE8875;">Create your first one →</RouterLink>
      </div>
      <table v-else class="w-full">
        <thead>
          <tr style="background:rgba(238,136,117,0.07);">
            <th class="rx-th">Patient</th>
            <th class="rx-th">Diagnosis</th>
            <th class="rx-th">Chamber</th>
            <th class="rx-th">Visit Date</th>
            <th class="rx-th">Next Visit</th>
            <th class="rx-th text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rx in filtered" :key="rx.prescriptionId"
              class="border-b cursor-pointer transition-colors"
              style="border-color:rgba(30,42,74,0.06);"
              @mouseover="e=>e.currentTarget.style.background='rgba(238,136,117,0.04)'"
              @mouseout="e=>e.currentTarget.style.background='transparent'"
              @click="$router.push(`/prescriptions/${rx.prescriptionId}`)">
            <td class="rx-td">
              <p class="font-bold text-[13px]" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">{{ rx.patientName || '—' }}</p>
            </td>
            <td class="rx-td">
              <span v-if="rx.diagnosis" class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style="background:rgba(238,136,117,0.1); color:#C05030;">{{ rx.diagnosis }}</span>
              <span v-else class="text-[13px]" style="color:#9AA0B8;">—</span>
            </td>
            <td class="rx-td text-[13px]" style="color:#9AA0B8;">{{ rx.chamberName || '—' }}</td>
            <td class="rx-td text-[13px]" style="color:#9AA0B8;">{{ fmtDate(rx.visitDate) }}</td>
            <td class="rx-td text-[13px]" style="color:#9AA0B8;">{{ rx.nextVisitDate ? fmtDate(rx.nextVisitDate) : '—' }}</td>
            <td class="rx-td text-right" @click.stop>
              <div class="flex items-center justify-end gap-1.5">
                <RouterLink :to="`/prescriptions/${rx.prescriptionId}`" class="act-btn" style="background:rgba(46,107,139,0.1); color:#2E6B8B;">View</RouterLink>
                <RouterLink :to="`/prescriptions/${rx.prescriptionId}/edit`" class="act-btn" style="background:rgba(238,136,117,0.1); color:#C05030;">Edit</RouterLink>
                <button @click="del(rx)" class="act-btn" style="background:rgba(224,82,82,0.08); color:#e05252;">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { toast } from 'vue3-toastify'
import { usePrescriptionsStore } from '../stores/prescriptionsStore'

const store = usePrescriptionsStore()
const search = ref('')
const fmtDate = d => d ? dayjs(d).format('MMM D, YYYY') : '—'
const filtered = computed(() =>
  store.prescriptions.filter(r =>
    !search.value ||
    r.patientName?.toLowerCase().includes(search.value.toLowerCase()) ||
    r.diagnosis?.toLowerCase().includes(search.value.toLowerCase())
  )
)
async function del(rx) {
  if (!confirm(`Delete prescription for ${rx.patientName}?`)) return
  try { await store.deletePrescription(rx.prescriptionId); toast.success('Deleted') }
  catch { toast.error('Failed to delete') }
}
onMounted(() => store.fetchAll())
</script>

<style scoped>
.rx-th { padding:11px 16px; text-align:left; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#EE8875; font-family:'Nunito',sans-serif; white-space:nowrap; }
.rx-td { padding:13px 16px; vertical-align:middle; }
.act-btn { padding:5px 12px; border-radius:8px; font-size:11px; font-weight:700; font-family:'Nunito',sans-serif; cursor:pointer; border:none; text-decoration:none; display:inline-flex; align-items:center; transition:opacity 0.15s; }
.act-btn:hover { opacity:0.7; }
</style>
