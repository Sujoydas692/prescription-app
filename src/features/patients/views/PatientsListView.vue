<template>
  <div class="space-y-5 fade-in-up">
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-52">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style="color: #9aa0b8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or mobile..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] outline-none transition-all"
          style="
            border-color: rgba(30, 42, 74, 0.14);
            color: #1e2a4a;
            font-family: &quot;DM Sans&quot;, sans-serif;
          "
          @focus="(e) => (e.target.style.borderColor = '#EE8875')"
          @blur="(e) => (e.target.style.borderColor = 'rgba(30,42,74,0.14)')"
        />
      </div>
      <RouterLink
        to="/patients/new"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90"
        style="
          background: linear-gradient(135deg, #ee8875, #2e6b8b);
          font-family: &quot;Nunito&quot;, sans-serif;
          box-shadow: 0 3px 14px rgba(238, 136, 117, 0.35);
        "
      >
        + Add Patient
      </RouterLink>
    </div>

    <div class="rounded-2xl overflow-hidden card">
      <!-- <div v-if="store.loading" class="text-center py-16">
        <p class="text-[13px]" style="color: #9aa0b8">Loading...</p>
      </div>
      <div v-else-if="filtered.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">👥</div>
        <p
          class="text-[14px] font-bold mb-1"
          style="color: #1e2a4a; font-family: &quot;Nunito&quot;, sans-serif"
        >
          No patients found
        </p>
        <RouterLink
          to="/patients/new"
          class="text-[13px] font-bold"
          style="color: #ee8875"
          >Add your first patient →</RouterLink
        >
      </div> -->
      <table class="w-full">
        <thead>
          <tr style="background: rgba(238, 136, 117, 0.07)">
            <th class="pt-th">Name</th>
            <th class="pt-th">Mobile</th>
            <th class="pt-th">Age</th>
            <th class="pt-th text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b cursor-pointer transition-colors"
            style="border-color: rgba(30, 42, 74, 0.06)"
            @mouseover="
              (e) =>
                (e.currentTarget.style.background = 'rgba(238,136,117,0.04)')
            "
            @mouseout="
              (e) => (e.currentTarget.style.background = 'transparent')
            "
          >
            <td class="pt-td">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                  style="background: linear-gradient(135deg, #ee8875, #2e6b8b)"
                >
                  S
                </div>
                <span
                  class="font-bold text-[13px]"
                  style="
                    color: #1e2a4a;
                    font-family: &quot;Nunito&quot;, sans-serif;
                  "
                  >Sujoy Das</span
                >
              </div>
            </td>
            <td class="pt-td text-[13px]" style="color: #9aa0b8">
              01521110903
            </td>
            <td class="pt-td text-[13px]" style="color: #9aa0b8">
              29 yrs
            </td>
            <td class="pt-td text-right" @click.stop>
              <div class="flex items-center justify-end gap-1.5">
                <RouterLink
                  :to="`/patients/1`"
                  class="act-btn"
                  style="background: rgba(46, 107, 139, 0.1); color: #2e6b8b"
                  >View</RouterLink
                >
                <RouterLink
                  :to="`/patients/1/edit`"
                  class="act-btn"
                  style="background: rgba(238, 136, 117, 0.1); color: #c05030"
                  >Edit</RouterLink
                >
                <button
                  @click="del(p)"
                  class="act-btn"
                  style="background: rgba(224, 82, 82, 0.08); color: #e05252"
                >
                  Delete
                </button>
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
.card {
  position: relative;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(238, 136, 117, 0.35),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  filter: blur(35px);
  pointer-events: none;
}

.card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card:hover::before {
  opacity: 0.35;
}
.pt-th {
  padding: 11px 16px;
  text-align: left;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ee8875;
  font-family: "Nunito", sans-serif;
}
.pt-td {
  padding: 13px 16px;
  vertical-align: middle;
}
.act-btn {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  cursor: pointer;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.15s;
}
.act-btn:hover {
  opacity: 0.7;
}
</style>
