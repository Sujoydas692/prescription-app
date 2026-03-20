<template>
  <div class="max-w-3xl space-y-5 fade-in-up">
    <div class="flex items-center justify-between">
      <button
        @click="$router.back()"
        class="text-[13px] font-semibold"
        style="color: #9aa0b8"
        @mouseover="(e) => (e.currentTarget.style.color = '#1E2A4A')"
        @mouseout="(e) => (e.currentTarget.style.color = '#9AA0B8')"
      >
        ← Back
      </button>
      <div class="flex gap-2" v-if="patient">
        <RouterLink
          :to="`/patients/${$route.params.id}/edit`"
          class="act-btn-sm"
          style="border: 1.5px solid rgba(30, 42, 74, 0.15); color: #5a6282"
          >✏️ Edit</RouterLink
        >
        <RouterLink
          :to="`/prescriptions/new?patientId=${$route.params.id}`"
          class="act-btn-primary"
          >✍️ New Prescription</RouterLink
        >
      </div>
    </div>

    <div
      v-if="store.loading"
      class="text-center py-16 text-[13px]"
      style="color: #9aa0b8"
    >
      Loading...
    </div>
    <div v-else-if="!patient" class="text-center py-16">
      <p class="text-[14px] font-bold" style="color: #1e2a4a">
        Patient not found
      </p>
    </div>

    <template v-else>
      <!-- Patient card -->
      <div
        class="rounded-2xl overflow-hidden"
        style="
          background: white;
          border: 1px solid rgba(30, 42, 74, 0.07);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        "
      >
        <div
          class="px-7 py-6 flex items-center gap-5"
          style="
            background: linear-gradient(
              135deg,
              rgba(238, 136, 117, 0.1),
              rgba(46, 107, 139, 0.07)
            );
          "
        >
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0"
            style="background: linear-gradient(135deg, #ee8875, #2e6b8b)"
          >
            {{ patient.fullName?.charAt(0)?.toUpperCase() || "?" }}
          </div>
          <div>
            <h2
              class="text-[22px] font-extrabold"
              style="
                color: #1e2a4a;
                font-family: &quot;Nunito&quot;, sans-serif;
              "
            >
              {{ patient.fullName }}
            </h2>
            <p class="text-[13px] mt-0.5" style="color: #9aa0b8">
              {{ patient.mobileNumber }}
            </p>
          </div>
        </div>
        <div class="px-7 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="f in fields"
            :key="f.label"
            v-show="f.value"
            class="flex flex-col gap-1"
          >
            <span
              class="text-[10px] font-black uppercase tracking-wider"
              style="color: #9aa0b8"
              >{{ f.label }}</span
            >
            <span
              class="text-[14px] font-bold"
              style="
                color: #1e2a4a;
                font-family: &quot;Nunito&quot;, sans-serif;
              "
              >{{ f.value }}</span
            >
          </div>
        </div>
      </div>

      <!-- Prescriptions for this patient -->
      <div
        class="rounded-2xl overflow-hidden"
        style="
          background: white;
          border: 1px solid rgba(30, 42, 74, 0.07);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        "
      >
        <div
          class="px-6 py-4 flex items-center justify-between"
          style="border-bottom: 1px solid rgba(30, 42, 74, 0.07)"
        >
          <h3
            class="font-extrabold text-[15px]"
            style="color: #1e2a4a; font-family: &quot;Nunito&quot;, sans-serif"
          >
            Prescription History
          </h3>
          <span
            class="text-[12px] font-bold px-2.5 py-1 rounded-full"
            style="background: rgba(238, 136, 117, 0.1); color: #c05030"
            >{{ patientRx.length }} total</span
          >
        </div>
        <div v-if="!patientRx.length" class="text-center py-10">
          <div class="text-3xl mb-2">📋</div>
          <p class="text-[13px]" style="color: #9aa0b8">No prescriptions yet</p>
        </div>
        <div v-else>
          <div
            v-for="rx in patientRx"
            :key="rx.prescriptionId"
            class="flex items-center justify-between px-6 py-4 border-b cursor-pointer transition-colors"
            style="border-color: rgba(30, 42, 74, 0.06)"
            @mouseover="
              (e) =>
                (e.currentTarget.style.background = 'rgba(238,136,117,0.04)')
            "
            @mouseout="
              (e) => (e.currentTarget.style.background = 'transparent')
            "
            @click="$router.push(`/prescriptions/${rx.prescriptionId}`)"
          >
            <div>
              <p class="font-bold text-[13px]" style="color: #1e2a4a">
                {{ rx.diagnosis || "No diagnosis" }}
              </p>
              <p class="text-[12px] mt-0.5" style="color: #9aa0b8">
                {{ rx.chamberName }}
              </p>
            </div>
            <span
              class="text-[11px] px-2.5 py-1 rounded-full font-semibold"
              style="background: rgba(46, 107, 139, 0.1); color: #2e6b8b"
              >{{ fmtDate(rx.visitDate) }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { usePatientsStore } from "../stores/patientsStore";
import { usePrescriptionsStore } from "@/features/prescriptions/stores/prescriptionsStore";

const route = useRoute();
const store = usePatientsStore();
const rxStore = usePrescriptionsStore();
const patient = computed(() => store.currentPatient);
const patientRx = ref([]);
const fmtDate = (d) => (d ? dayjs(d).format("MMM D, YYYY") : "—");
const fields = computed(() =>
  patient.value
    ? [
        {
          label: "Age",
          value: patient.value.age ? `${patient.value.age} yrs` : null,
        },
        { label: "Gender", value: patient.value.gender },
        {
          label: "Weight",
          value: patient.value.weight ? `${patient.value.weight} kg` : null,
        },
        { label: "Address", value: patient.value.address },
      ]
    : [],
);
onMounted(async () => {
  await store.fetchById(route.params.id);
  patientRx.value = await rxStore.fetchByPatient(route.params.id);
});
</script>

<style scoped>
.act-btn-sm {
  padding: 8px 16px;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
}
.act-btn-primary {
  padding: 8px 16px;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #ee8875, #2e6b8b);
  color: white;
  box-shadow: 0 3px 14px rgba(238, 136, 117, 0.3);
}
</style>
