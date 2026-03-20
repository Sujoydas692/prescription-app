<template>
  <div class="space-y-5 max-w-5xl">

    <!-- ═══ PATIENT INFO ═══ -->
    <div class="f-card">
      <div class="f-card-head">
        <h3 class="f-card-title"><span class="f-icon">👤</span> Patient Information</h3>
        <button @click="clearForm" class="f-btn-ghost">🔄 Clear</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="f-group">
          <label class="f-label">Patient *</label>
          <select v-model="form.patientId" class="f-control">
            <option value="">Select patient</option>
            <option v-for="p in patientsStore.patients" :key="p.patientId" :value="p.patientId">
              {{ p.fullName }} · {{ p.mobileNumber }}
            </option>
          </select>
        </div>
        <div class="f-group">
          <label class="f-label">Chamber *</label>
          <select v-model="form.chamberId" class="f-control">
            <option value="">Select chamber</option>
            <option v-for="c in chambersStore.chambers" :key="c.chamberId" :value="c.chamberId">{{ c.name }}</option>
          </select>
        </div>
        <div class="f-group">
          <label class="f-label">Visit Date *</label>
          <input v-model="form.visitDate" type="datetime-local" class="f-control" />
        </div>
        <div class="f-group">
          <label class="f-label">Next Visit Date</label>
          <input v-model="form.nextVisitDate" type="date" class="f-control" />
        </div>
      </div>
    </div>

    <!-- ═══ VITALS ═══ -->
    <div class="f-card">
      <div class="f-card-head">
        <h3 class="f-card-title"><span class="f-icon">❤️</span> Vitals</h3>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="v in vitalFields" :key="v.key" class="vital-box">
          <div class="vital-label">{{ v.label }}</div>
          <input v-model="vitals[v.key]" :placeholder="v.placeholder" class="vital-input" />
          <div class="vital-unit">{{ v.unit }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ DIAGNOSIS ═══ -->
    <div class="f-card">
      <div class="f-card-head">
        <h3 class="f-card-title"><span class="f-icon">🔬</span> Diagnosis & Complaints</h3>
      </div>
      <div class="f-group mb-4">
        <label class="f-label">Chief Complaints</label>
        <textarea v-model="form.chiefComplaints" rows="2" class="f-control resize-none" placeholder="Patient's main complaints..."></textarea>
      </div>
      <div class="f-group mb-4">
        <label class="f-label">Diagnosis</label>
        <div class="flex gap-2">
          <input v-model="form.diagnosis" type="text" class="f-control flex-1" placeholder="Type or click tag below..." />
        </div>
      </div>
      <!-- Diagnosis tags -->
      <div class="flex flex-wrap gap-2">
        <button v-for="d in diagnosisTags" :key="d"
          @click="form.diagnosis = d"
          class="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:scale-105"
          :style="form.diagnosis === d
            ? 'background:#EE8875; color:white; box-shadow:0 2px 8px rgba(238,136,117,0.4);'
            : 'background:rgba(238,136,117,0.1); color:#C05030; border:1px solid rgba(238,136,117,0.2);'">
          {{ form.diagnosis === d ? '✓ ' : '' }}{{ d }}
        </button>
      </div>
    </div>

    <!-- ═══ MEDICINES ═══ -->
    <div class="f-card">
      <div class="f-card-head">
        <h3 class="f-card-title"><span class="f-icon">💊</span> Medicines <span class="ml-1 text-[13px] font-normal" style="color:#9AA0B8;">({{ form.medicines.length }})</span></h3>
        <div class="flex gap-2">
          <button v-if="form.medicines.length" @click="sortMeds" class="f-btn-ghost">⇅ Sort</button>
          <button @click="showAddMed = !showAddMed" class="f-btn-accent">+ Add Medicine</button>
        </div>
      </div>

      <div v-if="form.medicines.length === 0 && !showAddMed" class="text-center py-10">
        <div class="text-4xl mb-2">💊</div>
        <p class="text-[13px]" style="color:#9AA0B8;">No medicines added yet</p>
      </div>

      <div v-if="form.medicines.length" class="overflow-x-auto -mx-1">
        <table class="w-full">
          <thead>
            <tr style="background:rgba(238,136,117,0.07);">
              <th class="rx-th">#</th>
              <th class="rx-th">Medicine</th>
              <th class="rx-th">Dosage</th>
              <th class="rx-th">Frequency</th>
              <th class="rx-th">Duration</th>
              <th class="rx-th">Instruction</th>
              <th class="rx-th"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(med, i) in form.medicines" :key="i"
                class="border-b transition-colors"
                style="border-color:rgba(30,42,74,0.06);"
                @mouseover="e=>e.currentTarget.style.background='rgba(238,136,117,0.03)'"
                @mouseout="e=>e.currentTarget.style.background='transparent'">
              <td class="rx-td font-mono text-[12px]" style="color:#9AA0B8; width:36px;">{{ String(i+1).padStart(2,'0') }}</td>
              <td class="rx-td">
                <p class="font-bold text-[13px]" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">{{ med.brandSearch }}</p>
                <p class="text-[11px]" style="color:#9AA0B8;">{{ med.type }}</p>
              </td>
              <td class="rx-td">
                <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold" style="background:rgba(46,107,139,0.1); color:#2E6B8B;">{{ med.dosage || '—' }}</span>
              </td>
              <td class="rx-td">
                <select v-model="med.frequency" class="f-control-sm">
                  <option>1+0+0</option><option>0+1+0</option><option>0+0+1</option>
                  <option>1+1+0</option><option>1+0+1</option><option>0+1+1</option>
                  <option>1+1+1</option><option>SOS</option>
                </select>
              </td>
              <td class="rx-td"><input v-model="med.duration" class="f-control-sm" placeholder="7 days" /></td>
              <td class="rx-td"><input v-model="med.instruction" class="f-control-sm" placeholder="After meal" /></td>
              <td class="rx-td">
                <button @click="form.medicines.splice(i,1)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] transition-all"
                  style="background:rgba(224,82,82,0.1); color:#e05252;"
                  @mouseover="e=>e.currentTarget.style.background='rgba(224,82,82,0.2)'"
                  @mouseout="e=>e.currentTarget.style.background='rgba(224,82,82,0.1)'">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add medicine row -->
      <div v-if="showAddMed" class="mt-4 p-4 rounded-xl"
           style="background:rgba(238,136,117,0.05); border:1.5px dashed rgba(238,136,117,0.3);">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div class="f-group md:col-span-2">
            <label class="f-label">Brand Name *</label>
            <div class="relative">
              <input v-model="newMed.brandSearch"
                @input="onBrandSearch"
                type="text" class="f-control" placeholder="Search brand..." />
              <div v-if="brandResults.length" class="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl z-30 max-h-44 overflow-y-auto mt-1"
                   style="border:1px solid rgba(30,42,74,0.1);">
                <button v-for="b in brandResults" :key="b.brandId"
                  @click="selectBrand(b)"
                  class="w-full text-left px-3 py-2.5 text-[12px] border-b last:border-0 transition-colors"
                  style="border-color:rgba(30,42,74,0.06);"
                  @mouseover="e=>e.currentTarget.style.background='rgba(238,136,117,0.06)'"
                  @mouseout="e=>e.currentTarget.style.background='transparent'">
                  <span class="font-bold" style="color:#1E2A4A;">{{ b.brandName }}</span>
                  <span class="ml-2 text-[11px]" style="color:#9AA0B8;">{{ b.genericName }} · {{ b.form }} {{ b.strength }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="f-group">
            <label class="f-label">Type</label>
            <select v-model="newMed.type" class="f-control">
              <option>Tablet</option><option>Capsule</option><option>Syrup</option>
              <option>Injection</option><option>Cream</option><option>Drops</option>
            </select>
          </div>
          <div class="f-group">
            <label class="f-label">Dosage</label>
            <input v-model="newMed.dosage" class="f-control" placeholder="500mg" />
          </div>
          <div class="f-group">
            <label class="f-label">Duration</label>
            <input v-model="newMed.duration" class="f-control" placeholder="7 days" />
          </div>
        </div>
        <div class="flex gap-2 mt-3 justify-end">
          <button @click="showAddMed=false" class="f-btn-ghost">Cancel</button>
          <button @click="addMedicine" class="f-btn-primary">Add Medicine ✓</button>
        </div>
      </div>
    </div>

    <!-- ═══ NOTES + TESTS ═══ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="f-card">
        <h3 class="f-card-title mb-4"><span class="f-icon">📝</span> Doctor's Notes</h3>
        <textarea v-model="form.notes" rows="4" class="f-control resize-none w-full" placeholder="Additional instructions, notes..."></textarea>
      </div>
      <div class="f-card">
        <h3 class="f-card-title mb-4"><span class="f-icon">📅</span> Tests & Follow-up</h3>
        <div class="space-y-3">
          <div class="f-group">
            <label class="f-label">Tests Advised</label>
            <div class="flex gap-2">
              <input v-model="testsInput" type="text" class="f-control flex-1" placeholder="e.g. CBC, LFT, ECG"
                @keyup.enter="addTest" />
              <button @click="addTest" class="f-btn-accent">+ Add</button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 min-h-8">
            <span v-for="(t, i) in form.tests" :key="i"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
              style="background:rgba(46,107,139,0.1); color:#2E6B8B;">
              {{ t.testName }}
              <button @click="form.tests.splice(i,1)" class="opacity-60 hover:opacity-100 text-[13px]">✕</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ ACTIONS ═══ -->
    <div class="flex items-center justify-end gap-3 pb-4">
      <RouterLink to="/prescriptions" class="f-btn-ghost px-5 py-2.5">Cancel</RouterLink>
      <button @click="goPreview"
        class="px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all"
        style="background:rgba(238,136,117,0.12); color:#C05030; border:1.5px solid rgba(238,136,117,0.3); font-family:'Nunito',sans-serif;">
        👁 Preview →
      </button>
      <button @click="onSubmit" :disabled="store.loading"
        class="px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50"
        style="background:linear-gradient(135deg,#EE8875,#2E6B8B); font-family:'Nunito',sans-serif; box-shadow:0 3px 14px rgba(238,136,117,0.35);">
        {{ store.loading ? 'Saving...' : isEdit ? '✓ Update' : '✓ Save Prescription' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { toast } from 'vue3-toastify'
import { usePrescriptionsStore } from '../stores/prescriptionsStore'
import { usePatientsStore } from '@/features/patients/stores/patientsStore'
import { useChambersStore } from '@/features/chambers/stores/chambersStore'
import { medicinesApi } from '@/features/medicines/api/medicinesApi'

const route = useRoute()
const router = useRouter()
const store = usePrescriptionsStore()
const patientsStore = usePatientsStore()
const chambersStore = useChambersStore()
const isEdit = computed(() => !!route.params.id)

const showAddMed = ref(false)
const brandResults = ref([])
const testsInput = ref('')

const vitalFields = [
  { key: 'bp',    label: 'Blood Pressure', placeholder: '120/80', unit: 'mmHg' },
  { key: 'pulse', label: 'Pulse',           placeholder: '72',     unit: 'bpm'  },
  { key: 'temp',  label: 'Temperature',     placeholder: '98.6',   unit: '°F'   },
  { key: 'spo2',  label: 'SpO₂',            placeholder: '98',     unit: '%'    },
]

const vitals = reactive({ bp: '', pulse: '', temp: '', spo2: '' })

const diagnosisTags = [
  'Hypertension', 'Type 2 Diabetes', 'Fever', 'URI', 'Dyspepsia',
  'Allergic Rhinitis', 'Asthma', 'Gastritis', 'Bronchitis', 'Migraine',
  'UTI', 'IBS', 'Anemia', 'Hypothyroidism', 'Arthritis',
]

const form = reactive({
  patientId: route.query.patientId || '',
  chamberId: '',
  visitDate: dayjs().format('YYYY-MM-DDTHH:mm'),
  nextVisitDate: '',
  chiefComplaints: '',
  diagnosis: route.query.dx || '',
  notes: '',
  medicines: [],
  tests: [],
})

const newMed = reactive({ brandId: null, brandSearch: '', type: 'Tablet', dosage: '', duration: '7 days', frequency: '1+1+1', instruction: '' })

const onBrandSearch = useDebounceFn(async () => {
  if (newMed.brandSearch.length < 2) { brandResults.value = []; return }
  try {
    const { data } = await medicinesApi.searchBrands({ q: newMed.brandSearch })
    brandResults.value = data.brands || []
  } catch { brandResults.value = [] }
}, 300)

function selectBrand(b) {
  newMed.brandId = b.brandId
  newMed.brandSearch = b.brandName
  brandResults.value = []
}

function addMedicine() {
  if (!newMed.brandSearch.trim()) { toast.error('Enter brand name'); return }
  form.medicines.push({ ...newMed })
  Object.assign(newMed, { brandId: null, brandSearch: '', type: 'Tablet', dosage: '', duration: '7 days', frequency: '1+1+1', instruction: '' })
  showAddMed.value = false
  toast.success('Medicine added')
}

function sortMeds() {
  form.medicines.sort((a, b) => a.brandSearch.localeCompare(b.brandSearch))
  toast.success('Sorted!')
}

function addTest() {
  if (testsInput.value.trim()) {
    form.tests.push({ testName: testsInput.value.trim() })
    testsInput.value = ''
  }
}

function clearForm() {
  Object.assign(form, { patientId: '', chamberId: '', chiefComplaints: '', diagnosis: '', notes: '', medicines: [], tests: [] })
  Object.assign(vitals, { bp: '', pulse: '', temp: '', spo2: '' })
}

function goPreview() {
  store.draftForm = { ...form, vitals: { ...vitals } }
  router.push('/prescriptions/preview')
}

async function onSubmit() {
  if (!form.patientId) { toast.error('Select a patient'); return }
  if (!form.chamberId) { toast.error('Select a chamber'); return }
  try {
    const payload = {
      ...form,
      vitals: { ...vitals },
      medicines: form.medicines.filter(m => m.brandSearch),
    }
    if (isEdit.value) {
      await store.updatePrescription(route.params.id, payload)
      toast.success('Prescription updated!')
    } else {
      await store.createPrescription(payload)
      toast.success('Prescription saved!')
    }
    router.push('/prescriptions')
  } catch { toast.error(store.error || 'Failed to save') }
}

onMounted(async () => {
  await Promise.all([patientsStore.fetchAll(), chambersStore.fetchAll()])
  if (isEdit.value) {
    const rx = await store.fetchById(route.params.id)
    if (rx) {
      Object.assign(form, {
        patientId: rx.patientId, chamberId: rx.chamberId,
        visitDate: dayjs(rx.visitDate).format('YYYY-MM-DDTHH:mm'),
        nextVisitDate: rx.nextVisitDate ? dayjs(rx.nextVisitDate).format('YYYY-MM-DD') : '',
        chiefComplaints: rx.chiefComplaints || '',
        diagnosis: rx.diagnosis || '',
        notes: rx.notes || '',
        medicines: rx.medicines?.map(m => ({
          brandId: m.brandId, brandSearch: m.brandName, type: m.type || 'Tablet',
          dosage: m.dosage || '', duration: m.duration || '7 days',
          frequency: m.frequency || '1+1+1', instruction: m.instruction || '',
        })) || [],
        tests: rx.tests?.map(t => ({ testName: t.testName })) || [],
      })
    }
  }
})
</script>

<style scoped>
.f-card { background:white; border-radius:20px; padding:24px; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 14px rgba(0,0,0,0.04); }
.f-card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.f-card-title { font-family:'Nunito',sans-serif; font-weight:800; font-size:15px; color:#1E2A4A; display:flex; align-items:center; gap:8px; }
.f-icon { width:28px; height:28px; background:rgba(238,136,117,0.12); border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-size:14px; }
.f-group { display:flex; flex-direction:column; gap:5px; }
.f-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#9AA0B8; }
.f-control { padding:10px 14px; border-radius:12px; border:1.5px solid rgba(30,42,74,0.13); background:white; color:#1E2A4A; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; width:100%; transition:all 0.2s; }
.f-control:focus { border-color:#EE8875; box-shadow:0 0 0 3px rgba(238,136,117,0.1); }
.f-control-sm { padding:6px 10px; border-radius:8px; border:1.5px solid rgba(30,42,74,0.12); font-size:12px; color:#1E2A4A; font-family:'DM Sans',sans-serif; outline:none; width:100%; min-width:90px; transition:border-color 0.2s; }
.f-control-sm:focus { border-color:#EE8875; }
.f-btn-ghost { background:transparent; border:1.5px solid rgba(30,42,74,0.15); color:#5A6282; padding:8px 16px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:12px; cursor:pointer; transition:all 0.2s; }
.f-btn-ghost:hover { border-color:#EE8875; color:#C05030; }
.f-btn-accent { background:rgba(238,136,117,0.12); color:#C05030; border:1px solid rgba(238,136,117,0.3); padding:8px 16px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:12px; cursor:pointer; transition:all 0.2s; }
.f-btn-accent:hover { background:rgba(238,136,117,0.22); }
.f-btn-primary { background:linear-gradient(135deg,#EE8875,#2E6B8B); color:white; border:none; padding:9px 20px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:13px; cursor:pointer; }
.rx-th { padding:10px 14px; text-align:left; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#EE8875; font-family:'Nunito',sans-serif; }
.rx-td { padding:11px 14px; vertical-align:middle; }
/* Vitals */
.vital-box { padding:14px; border-radius:12px; border:1.5px solid rgba(30,42,74,0.1); background:#FAFCFF; transition:all 0.2s; display:flex; flex-direction:column; gap:4px; }
.vital-box:focus-within { border-color:#EE8875; background:white; box-shadow:0 0 0 3px rgba(238,136,117,0.08); }
.vital-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#9AA0B8; }
.vital-input { border:none; background:transparent; font-family:'DM Mono','JetBrains Mono',monospace; font-size:18px; font-weight:700; color:#1E2A4A; outline:none; width:100%; }
.vital-unit { font-size:11px; font-weight:700; color:#EE8875; }
</style>
