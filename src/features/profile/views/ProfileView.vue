<template>
  <div class="space-y-5 max-w-3xl">

    <!-- Profile banner -->
    <div class="relative overflow-hidden rounded-2xl px-8 py-6" style="background:linear-gradient(135deg,#1E2A4A,#243258);">
      <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full" style="background:rgba(238,136,117,0.13);"></div>
      <div class="flex items-center gap-5 relative z-10">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold"
             style="background:linear-gradient(135deg,#EE8875,#2E6B8B);">
          {{ authStore.doctorName?.charAt(0)?.toUpperCase() || 'D' }}
        </div>
        <div>
          <p class="text-[11px] font-black uppercase tracking-widest mb-1" style="color:rgba(238,136,117,0.8);">Doctor Profile</p>
          <h2 class="text-[22px] font-extrabold text-white" style="font-family:'Nunito',sans-serif;">{{ authStore.doctorName }}</h2>
          <p class="text-[13px] mt-0.5" style="color:rgba(255,255,255,0.5);">{{ authStore.doctor?.email }}</p>
        </div>
      </div>
    </div>

    <!-- Profile form -->
    <div class="f-card">
      <div class="f-card-head">
        <h3 class="f-card-title"><span class="f-icon">👨‍⚕️</span> Doctor Information</h3>
        <button @click="save" :disabled="saving"
          class="px-5 py-2 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90 disabled:opacity-50"
          style="background:linear-gradient(135deg,#EE8875,#2E6B8B); font-family:'Nunito',sans-serif;">
          {{ saving ? 'Saving...' : '✓ Save Changes' }}
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="f-group">
          <label class="f-label">Full Name</label>
          <input v-model="form.fullName" class="f-control" placeholder="Dr. Full Name" />
        </div>
        <div class="f-group">
          <label class="f-label">Degree / Qualifications</label>
          <input v-model="form.degree" class="f-control" placeholder="MBBS, FCPS (Medicine)" />
        </div>
        <div class="f-group">
          <label class="f-label">Specialization</label>
          <input v-model="form.specialization" class="f-control" placeholder="Internal Medicine" />
        </div>
        <div class="f-group">
          <label class="f-label">Registration No.</label>
          <input v-model="form.regNo" class="f-control" placeholder="A-XXXXX" />
        </div>
        <div class="f-group">
          <label class="f-label">Phone</label>
          <input v-model="form.phone" class="f-control" placeholder="01XXXXXXXXX" />
        </div>
        <div class="f-group">
          <label class="f-label">Email</label>
          <input :value="authStore.doctor?.email" class="f-control" disabled style="background:rgba(30,42,74,0.04); cursor:not-allowed;" />
        </div>
        <div class="f-group md:col-span-2">
          <label class="f-label">Clinic / Hospital</label>
          <input v-model="form.hospital" class="f-control" placeholder="City Medical Center, Dhaka" />
        </div>
        <div class="f-group md:col-span-2">
          <label class="f-label">Address</label>
          <input v-model="form.address" class="f-control" placeholder="House, Road, Area, City" />
        </div>
        <div class="f-group md:col-span-2">
          <label class="f-label">Chamber Schedule</label>
          <textarea v-model="form.schedule" rows="2" class="f-control resize-none" placeholder="Sat–Thu: 5PM–9PM, Fri: Closed"></textarea>
        </div>
      </div>
    </div>

    <!-- Preferences -->
    <div class="f-card">
      <h3 class="f-card-title mb-5"><span class="f-icon">⚙️</span> Preferences</h3>
      <div class="space-y-4">
        <div v-for="pref in prefItems" :key="pref.key" class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-[13px]" style="color:#1E2A4A;">{{ pref.label }}</p>
            <p class="text-[12px] mt-0.5" style="color:#9AA0B8;">{{ pref.desc }}</p>
          </div>
          <button @click="prefs[pref.key] = !prefs[pref.key]"
            class="w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 relative"
            :style="prefs[pref.key] ? 'background:#EE8875;' : 'background:rgba(30,42,74,0.15);'">
            <span class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                  :style="prefs[pref.key] ? 'left:22px;' : 'left:2px;'"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="f-card" style="border-color:rgba(224,82,82,0.15);">
      <h3 class="f-card-title mb-4" style="color:#e05252;"><span class="f-icon" style="background:rgba(224,82,82,0.1);">⚠️</span> Account</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-[13px]" style="color:#1E2A4A;">Sign Out</p>
          <p class="text-[12px] mt-0.5" style="color:#9AA0B8;">Sign out from this device</p>
        </div>
        <button @click="logout"
          class="px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
          style="background:rgba(224,82,82,0.1); color:#e05252; border:1px solid rgba(224,82,82,0.2); font-family:'Nunito',sans-serif;"
          @mouseover="e=>e.currentTarget.style.background='rgba(224,82,82,0.2)'"
          @mouseout="e=>e.currentTarget.style.background='rgba(224,82,82,0.1)'">
          Sign Out
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/features/auth/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const saving = ref(false)

const form = reactive({ fullName: '', degree: '', specialization: '', regNo: '', phone: '', hospital: '', address: '', schedule: '' })
const prefs = reactive({ showDate: true, showVitals: true, signature: true, showTests: true })

const prefItems = [
  { key: 'showDate',   label: 'Show date on prescription', desc: 'Print visit date on the Rx slip' },
  { key: 'showVitals', label: 'Include vitals',            desc: 'Show BP, pulse etc. on the Rx' },
  { key: 'signature',  label: 'Signature line',            desc: 'Show signature line at bottom' },
  { key: 'showTests',  label: 'Show test section',         desc: 'Include investigations section' },
]

async function save() {
  saving.value = true
  try {
    // Update in local store (backend API call would go here)
    authStore.doctor = { ...authStore.doctor, fullName: form.fullName }
    toast.success('Profile saved!')
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

function logout() {
  authStore.logout()
  toast.success('Signed out')
  router.push('/login')
}

onMounted(() => {
  if (authStore.doctor) {
    Object.assign(form, {
      fullName: authStore.doctor.fullName || authStore.doctorName || '',
      degree: authStore.doctor.degree || '',
      specialization: authStore.doctor.specialization || '',
      regNo: authStore.doctor.regNo || '',
      phone: authStore.doctor.phone || '',
      hospital: authStore.doctor.hospital || '',
      address: authStore.doctor.address || '',
      schedule: authStore.doctor.schedule || '',
    })
  }
})
</script>

<style scoped>
.f-card { background:white; border-radius:20px; padding:24px; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 14px rgba(0,0,0,0.04); }
.f-card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.f-card-title { font-family:'Nunito',sans-serif; font-weight:800; font-size:15px; color:#1E2A4A; display:flex; align-items:center; gap:8px; }
.f-icon { width:28px; height:28px; background:rgba(238,136,117,0.12); border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.f-group { display:flex; flex-direction:column; gap:5px; }
.f-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#9AA0B8; }
.f-control { padding:10px 14px; border-radius:12px; border:1.5px solid rgba(30,42,74,0.13); background:white; color:#1E2A4A; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; width:100%; transition:all 0.2s; }
.f-control:focus { border-color:#EE8875; box-shadow:0 0 0 3px rgba(238,136,117,0.1); }
</style>
