<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-[16px] font-extrabold" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">Your Chambers</h2>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90"
        style="background:linear-gradient(135deg,#EE8875,#2E6B8B); font-family:'Nunito',sans-serif; box-shadow:0 3px 14px rgba(238,136,117,0.35);">
        {{ showForm ? '✕ Cancel' : '+ Add Chamber' }}
      </button>
    </div>

    <!-- Add form -->
    <div v-if="showForm" class="f-card space-y-4">
      <h4 class="font-extrabold text-[14px]" style="font-family:'Nunito',sans-serif; color:#1E2A4A;">New Chamber</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="f-group">
          <label class="f-label">Chamber Name *</label>
          <input v-model="form.name" class="f-control" placeholder="e.g. Dhanmondi Chamber" />
        </div>
        <div class="f-group">
          <label class="f-label">Address</label>
          <input v-model="form.address" class="f-control" placeholder="Full address" />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <button @click="showForm=false" class="f-btn-ghost">Cancel</button>
        <button @click="save" :disabled="store.loading" class="f-btn-primary">
          {{ store.loading ? 'Saving...' : 'Save Chamber ✓' }}
        </button>
      </div>
    </div>

    <!-- Chambers grid -->
    <div v-if="store.loading && !store.chambers.length" class="text-center py-16 text-[13px]" style="color:#9AA0B8;">Loading...</div>
    <div v-else-if="store.chambers.length === 0" class="text-center py-16">
      <div class="text-4xl mb-3">🏥</div>
      <p class="text-[14px] font-bold mb-1" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">No chambers yet</p>
      <p class="text-[13px]" style="color:#9AA0B8;">Add your practice locations</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="c in store.chambers" :key="c.chamberId"
           class="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
           style="background:white; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 12px rgba(0,0,0,0.04);">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                 style="background:linear-gradient(135deg,rgba(238,136,117,0.15),rgba(46,107,139,0.1));">
              🏥
            </div>
            <h4 class="font-extrabold text-[14px]" style="color:#1E2A4A; font-family:'Nunito',sans-serif;">{{ c.name }}</h4>
            <p class="text-[12px] mt-1" style="color:#9AA0B8;">{{ c.address || 'No address' }}</p>
          </div>
          <button @click="del(c)" class="text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all" style="background:rgba(224,82,82,0.08); color:#e05252;" @mouseover="e=>e.currentTarget.style.background='rgba(224,82,82,0.15)'" @mouseout="e=>e.currentTarget.style.background='rgba(224,82,82,0.08)'">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useChambersStore } from '../stores/chambersStore'
const store = useChambersStore()
const showForm = ref(false)
const form = reactive({ name: '', address: '' })
async function save() {
  if (!form.name.trim()) { toast.error('Enter chamber name'); return }
  try { await store.createChamber(form); toast.success('Chamber added!'); showForm.value = false; Object.assign(form, { name: '', address: '' }) }
  catch { toast.error(store.error || 'Failed') }
}
async function del(c) {
  if (!confirm(`Delete "${c.name}"?`)) return
  try { await store.deleteChamber(c.chamberId); toast.success('Deleted') }
  catch { toast.error('Failed') }
}
onMounted(() => store.fetchAll())
</script>

<style scoped>
.f-card { background:white; border-radius:20px; padding:24px; border:1px solid rgba(30,42,74,0.07); box-shadow:0 2px 14px rgba(0,0,0,0.04); }
.f-group { display:flex; flex-direction:column; gap:5px; }
.f-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#9AA0B8; }
.f-control { padding:10px 14px; border-radius:12px; border:1.5px solid rgba(30,42,74,0.13); background:white; color:#1E2A4A; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; width:100%; transition:all 0.2s; }
.f-control:focus { border-color:#EE8875; box-shadow:0 0 0 3px rgba(238,136,117,0.1); }
.f-btn-ghost { background:transparent; border:1.5px solid rgba(30,42,74,0.15); color:#5A6282; padding:8px 16px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:12px; cursor:pointer; }
.f-btn-primary { background:linear-gradient(135deg,#EE8875,#2E6B8B); color:white; border:none; padding:9px 20px; border-radius:10px; font-family:'Nunito',sans-serif; font-weight:700; font-size:13px; cursor:pointer; }
</style>
