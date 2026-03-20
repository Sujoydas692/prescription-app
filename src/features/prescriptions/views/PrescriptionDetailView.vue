<template>
  <div class="max-w-3xl space-y-4">

    <!-- Top nav -->
    <div class="flex items-center justify-between">
      <button @click="$router.back()"
        class="flex items-center gap-2 text-[13px] font-semibold transition-colors"
        style="color:#9AA0B8;"
        @mouseover="e=>e.currentTarget.style.color='#1E2A4A'"
        @mouseout="e=>e.currentTarget.style.color='#9AA0B8'">
        ← Back
      </button>
      <div class="flex gap-2" v-if="rx">
        <RouterLink :to="`/prescriptions/${$route.params.id}/edit`"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
          style="background:transparent; border:1.5px solid rgba(30,42,74,0.15); color:#5A6282; font-family:'Nunito',sans-serif;">
          ✏️ Edit
        </RouterLink>
        <button @click="printRx"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90"
          style="background:linear-gradient(135deg,#EE8875,#2E6B8B); font-family:'Nunito',sans-serif;">
          🖨️ Print
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-20 text-[13px]" style="color:#9AA0B8;">Loading prescription...</div>
    <div v-else-if="!rx" class="text-center py-20">
      <p class="text-4xl mb-3">📋</p>
      <p class="text-[14px] font-bold" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">Prescription not found</p>
      <RouterLink to="/prescriptions" class="text-[13px] font-bold mt-2 inline-block" style="color:#EE8875;">← Go back</RouterLink>
    </div>

    <!-- The prescription card (print-ready) -->
    <div v-else id="rx-print" class="rx-paper">

      <!-- Header band -->
      <div class="rx-paper-header">
        <div>
          <p class="rx-doc-name">Dr. {{ authStore.doctorName }}</p>
          <p class="rx-doc-sub">{{ rx.chamberName }}</p>
        </div>
        <div class="text-right">
          <p class="rx-doc-sub">{{ fmtDate(rx.visitDate) }}</p>
          <p v-if="rx.nextVisitDate" class="rx-doc-sub mt-1" style="color:rgba(238,136,117,0.9);">
            Next visit: {{ fmtDate(rx.nextVisitDate) }}
          </p>
        </div>
      </div>
      <div class="rx-stripe"></div>

      <div class="rx-paper-body">

        <!-- Patient strip -->
        <div class="rx-patient-strip">
          <div v-for="f in patientFields" :key="f.label" class="rx-pfield" v-show="f.value">
            <span>{{ f.label }}</span>
            <strong>{{ f.value }}</strong>
          </div>
        </div>

        <!-- Vitals row (if present) -->
        <div v-if="rx.vitals && hasVitals" class="flex flex-wrap gap-3 mb-5">
          <div v-for="v in vitalDisplay" :key="v.label" v-show="v.value"
               class="px-3 py-2 rounded-xl text-center"
               style="background:rgba(30,42,74,0.04); border:1px solid rgba(30,42,74,0.08);">
            <p class="text-[10px] font-bold uppercase tracking-wider" style="color:#9AA0B8;">{{ v.label }}</p>
            <p class="text-[14px] font-bold mt-0.5" style="font-family:'DM Mono',monospace; color:#1E2A4A;">{{ v.value }}</p>
            <p class="text-[10px]" style="color:#EE8875;">{{ v.unit }}</p>
          </div>
        </div>

        <!-- Chief complaints -->
        <div v-if="rx.chiefComplaints" class="mb-4">
          <p class="rx-section-label">Chief Complaints</p>
          <p class="text-[13px] leading-relaxed" style="color:#4a5568;">{{ rx.chiefComplaints }}</p>
        </div>

        <!-- Diagnosis -->
        <div v-if="rx.diagnosis" class="mb-5">
          <p class="rx-section-label">Diagnosis</p>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold"
                style="background:rgba(238,136,117,0.12); color:#C05030;">
            {{ rx.diagnosis }}
          </span>
        </div>

        <!-- Rx symbol -->
        <div class="rx-symbol">℞</div>

        <!-- Medicines -->
        <div v-if="!rx.medicines?.length" class="py-4 text-[13px] italic" style="color:#9AA0B8;">No medicines prescribed</div>
        <div v-else class="space-y-3 mb-6">
          <div v-for="(med, i) in rx.medicines" :key="i"
               class="flex gap-4 pb-3"
               style="border-bottom:1px dashed rgba(30,42,74,0.1);">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5"
                 style="background:linear-gradient(135deg,#EE8875,#2E6B8B); min-width:28px;">
              {{ i + 1 }}
            </div>
            <div class="flex-1">
              <p class="font-extrabold text-[15px]" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">
                {{ med.brandName }}
                <span class="text-[12px] font-normal ml-1" style="color:#9AA0B8;">({{ med.type || 'Tablet' }})</span>
              </p>
              <p class="text-[12px] mt-0.5" style="color:#9AA0B8;">{{ med.genericName }}<span v-if="med.form"> · {{ med.form }}</span><span v-if="med.strength"> {{ med.strength }}</span></p>
              <p class="text-[13px] mt-1 font-medium" style="color:#5A6282;">
                {{ med.dosage }}<span v-if="med.frequency"> · {{ med.frequency }}</span> · {{ med.duration }}<span v-if="med.instruction"> · {{ med.instruction }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Tests -->
        <div v-if="rx.tests?.length" class="mb-4 p-4 rounded-xl" style="background:#fff8f0; border-left:3px solid #E0943A;">
          <p class="text-[10px] font-black uppercase tracking-widest mb-3" style="color:#E0943A;">Investigations Advised</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="t in rx.tests" :key="t.testName"
              class="px-3 py-1 rounded-full text-[12px] font-bold"
              style="background:rgba(224,148,58,0.12); color:#E0943A;">
              {{ t.testName }}
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="rx.notes" class="p-4 rounded-xl" style="background:rgba(238,136,117,0.07);">
          <p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:#EE8875;">Notes</p>
          <p class="text-[13px] leading-relaxed" style="color:#5A6282;">{{ rx.notes }}</p>
        </div>
      </div>

      <!-- Signature footer -->
      <div class="flex justify-end px-8 pb-8 pt-2">
        <div class="text-center">
          <div class="w-36 border-t mb-2" style="border-color:#1E2A4A;"></div>
          <p class="text-[12px] font-bold" style="color:#5A6282; font-family:'Nunito',sans-serif;">Dr. {{ authStore.doctorName }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { usePrescriptionsStore } from '../stores/prescriptionsStore'
import { useAuthStore } from '@/features/auth/stores/authStore'

const route = useRoute()
const store = usePrescriptionsStore()
const authStore = useAuthStore()
const rx = computed(() => store.currentPrescription)
const fmtDate = d => d ? dayjs(d).format('MMM D, YYYY') : '—'

const patientFields = computed(() => rx.value ? [
  { label: 'Name',   value: rx.value.patientName },
  { label: 'Age',    value: rx.value.patientAge ? `${rx.value.patientAge} yrs` : null },
  { label: 'Mobile', value: rx.value.patientMobile },
] : [])

const hasVitals = computed(() => rx.value?.vitals && Object.values(rx.value.vitals).some(v => !!v))
const vitalDisplay = computed(() => rx.value?.vitals ? [
  { label: 'BP',   value: rx.value.vitals.bp,    unit: 'mmHg' },
  { label: 'Pulse',value: rx.value.vitals.pulse, unit: 'bpm'  },
  { label: 'Temp', value: rx.value.vitals.temp,  unit: '°F'   },
  { label: 'SpO₂', value: rx.value.vitals.spo2,  unit: '%'    },
] : [])

function printRx() { window.print() }
onMounted(() => store.fetchById(route.params.id))
</script>

<style scoped>
.rx-paper { background:white; border-radius:20px; overflow:hidden; border:1px solid rgba(30,42,74,0.08); box-shadow:0 8px 40px rgba(0,0,0,0.08); }
.rx-paper-header { background:linear-gradient(135deg,#1E2A4A,#243258); color:white; padding:24px 32px; display:flex; justify-content:space-between; align-items:flex-start; }
.rx-doc-name { font-family:'Nunito',sans-serif; font-size:20px; font-weight:800; }
.rx-doc-sub { font-size:12px; opacity:0.65; margin-top:3px; }
.rx-stripe { height:3px; background:linear-gradient(90deg,#EE8875,#2E6B8B,transparent); }
.rx-paper-body { padding:24px 32px; }
.rx-patient-strip { display:flex; flex-wrap:wrap; gap:24px; background:rgba(238,136,117,0.07); border-radius:14px; padding:14px 18px; margin-bottom:20px; }
.rx-pfield { display:flex; flex-direction:column; gap:2px; }
.rx-pfield span { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#9AA0B8; }
.rx-pfield strong { font-size:13px; color:#1E2A4A; font-family:'Nunito',sans-serif; font-weight:700; }
.rx-section-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#9AA0B8; margin-bottom:7px; }
.rx-symbol { font-family:'Playfair Display',Georgia,serif; font-size:42px; font-weight:700; color:#EE8875; line-height:1; margin-bottom:16px; }
@media print {
  .rx-paper { box-shadow:none; border:1px solid #ccc; }
  button, a[href] { display:none !important; }
}
</style>
