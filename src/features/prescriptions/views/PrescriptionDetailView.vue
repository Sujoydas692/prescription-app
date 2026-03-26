<template>
  <div class="max-w-3xl space-y-4 fade-in-up" style="margin: 0 auto">
    <!-- Top nav -->
    <div class="flex items-center justify-between no-print">
      <button @click="$router.back()" class="back-button">
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back</span>
      </button>
      <div class="flex gap-3" v-if="rx">
        <RouterLink
          :to="`/prescriptions/${$route.params.id}/edit`"
          class="edit-button"
        >
          <svg
            width="16"
            height="16"
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
          <span>Edit</span>
        </RouterLink>
        <button @click="printRx" class="print-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>Print</span>
        </button>
      </div>
    </div>

    <!-- The prescription card (print-ready) -->
    <div id="rx-print" class="rx-paper">
      <!-- Loading State -->
      <div v-if="store.loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading prescription...</p>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!rx" class="not-found-state">
        <div class="not-found-icon">📋</div>
        <h3 class="not-found-title">Prescription not found</h3>
        <p class="not-found-text">
          The prescription you're looking for doesn't exist or has been removed.
        </p>
        <RouterLink to="/prescriptions" class="back-link"
          >← Go back to prescriptions</RouterLink
        >
      </div>

      <template v-else>
        <!-- Doctor Header -->
        <div class="rx-header">
          <div class="doctor-block">
            <h1 class="doctor-name">
              Dr. {{ authStore.doctorName || "Md. Mahbubul Islam" }}
            </h1>
            <p class="doctor-line">
              {{ authStore.doctorDesignation || "MBBS, BCS" }}
            </p>
            <p class="doctor-line">
              {{
                authStore.doctorSpeciality ||
                "General Physician, ENT, Covid Unit"
              }}
            </p>
            <p class="doctor-line">
              Indoor Medical Officer ( ENT &amp; Head Neck Surgery )
            </p>
            <p class="doctor-line">ENT &amp; Head Neck Surgery</p>
            <p class="doctor-line">
              {{
                authStore.hospital ||
                "Shaheed Suhrawardy Medical College Hospital, Dhaka"
              }}
            </p>
            <p class="doctor-line">
              BMDC Reg. No - {{ authStore.regNo || "A62931" }}
            </p>
          </div>
          <div class="date-block">
            <p class="date-line">
              <strong>Date:</strong> {{ fmtDate(rx.visitDate) }}
            </p>
            <p class="date-line" v-if="rx.refNo">
              <strong>Ref:</strong> {{ rx.refNo }}
            </p>
          </div>
        </div>

        <!-- Patient Strip -->
        <div class="patient-strip">
          <span class="pfield" v-if="rx.patientName"
            ><strong>Patient Name:</strong> {{ rx.patientName }}</span
          >
          <span class="pfield" v-if="rx.patientGender"
            ><strong>Gender:</strong> {{ rx.patientGender }}</span
          >
          <span class="pfield" v-if="rx.patientAge"
            ><strong>Age:</strong> {{ rx.patientAge }} yrs</span
          >
          <span class="pfield" v-if="rx.patientWeight"
            ><strong>Weight:</strong> {{ rx.patientWeight }} kg</span
          >
          <span class="pfield" v-if="rx.patientMobile"
            ><strong>Mobile:</strong> {{ rx.patientMobile }}</span
          >
        </div>

        <!-- Vitals Row -->
        <div v-if="hasVitals" class="vitals-strip">
          <span v-for="v in vitalDisplay" :key="v.label" class="vital-pill">
            <strong>{{ v.label }}:</strong> {{ v.value }} {{ v.unit }}
          </span>
        </div>

        <!-- Two-column body -->
        <div class="rx-body">
          <!-- LEFT COLUMN -->
          <div class="rx-left">
            <div
              v-if="rx.chiefComplaints || rx.chiefComplaintsList?.length"
              class="left-section"
            >
              <h3 class="left-title">Chief Complaints:</h3>
              <ul v-if="rx.chiefComplaintsList?.length" class="complaint-list">
                <li v-for="c in rx.chiefComplaintsList" :key="c">{{ c }}</li>
              </ul>
              <p v-else class="complaint-para">{{ rx.chiefComplaints }}</p>
            </div>

            <div class="left-divider"></div>

            <div v-if="rx.tests?.length" class="left-section">
              <h3 class="left-title">Investigation:</h3>
              <ul class="complaint-list">
                <li v-for="t in rx.tests" :key="t.testName">
                  {{ t.testName }}
                </li>
              </ul>
            </div>

            <div v-if="rx.diagnosis" class="left-section">
              <h3 class="left-title">Diagnosis:</h3>
              <p class="complaint-para">{{ rx.diagnosis }}</p>
            </div>

            <div v-if="rx.notes" class="left-section">
              <h3 class="left-title">Notes:</h3>
              <p class="complaint-para">{{ rx.notes }}</p>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="rx-right">
            <div class="rx-symbol">R<sub>x</sub></div>

            <div v-if="!rx.medicines?.length" class="no-meds">
              No medicines prescribed.
            </div>
            <div v-else class="medicines-list">
              <div
                v-for="(med, i) in rx.medicines"
                :key="i"
                class="medicine-item"
              >
                <p class="med-name">
                  <span class="med-num">{{ i + 1 }}.</span>
                  <strong>{{ med.type || "Tab" }}. {{ med.brandName }}</strong>
                  <span v-if="med.strength" class="med-strength">
                    {{ med.strength }}</span
                  >
                  <span v-if="med.genericName" class="med-generic">
                    ({{ med.genericName }})</span
                  >
                </p>
                <p class="med-instruction">
                  <span class="med-dosage">{{ med.dosage || "—" }}</span>
                  <span v-if="med.instruction" class="med-note">{{
                    med.instruction
                  }}</span>
                  <span v-if="med.duration" class="med-duration">{{
                    med.duration
                  }}</span>
                </p>
              </div>
            </div>

            <div v-if="rx.nextVisitDate" class="followup-line">
              <strong>Follow-up within:</strong> {{ rx.nextVisitDate }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="rx-footer">
          <p class="powered-by">Powered by <strong>Doctime Limited</strong></p>
          <p class="page-num">Page 1 of 1</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { usePrescriptionsStore } from "../stores/prescriptionsStore";
import { useAuthStore } from "@/features/auth/stores/authStore";

const route = useRoute();
const store = usePrescriptionsStore();
const authStore = useAuthStore();
const rx = computed(() => store.currentPrescription);
const fmtDate = (d) => (d ? dayjs(d).format("DD MMM YYYY") : "—");

const hasVitals = computed(
  () => rx.value?.vitals && Object.values(rx.value.vitals).some((v) => !!v),
);
const vitalDisplay = computed(() =>
  rx.value?.vitals
    ? [
        { label: "BP", value: rx.value.vitals.bp, unit: "mmHg" },
        { label: "Pulse", value: rx.value.vitals.pulse, unit: "bpm" },
        { label: "Temp", value: rx.value.vitals.temp, unit: "°F" },
        { label: "SpO₂", value: rx.value.vitals.spo2, unit: "%" },
      ].filter((v) => v.value)
    : [],
);

function printRx() {
  const printContent = document.getElementById("rx-print");
  const originalTitle = document.title;
  document.title = `Prescription - ${rx.value?.patientName || "Patient"}`;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head><title>Prescription</title><meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; background: white; padding: 32px 40px; color: #111; font-size: 12px; }
      .rx-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 2px solid #111; }
      .doctor-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
      .doctor-line { font-size: 11px; line-height: 1.65; color: #222; }
      .date-block { text-align: right; font-size: 11px; line-height: 2; }
      .date-line { display: block; }
      .patient-strip { display: flex; gap: 24px; border-bottom: 1px solid #ccc; padding: 7px 0; flex-wrap: wrap; }
      .pfield strong { font-weight: 700; }
      .vitals-strip { display: flex; gap: 20px; padding: 6px 0; border-bottom: 1px dashed #ccc; }
      .vital-pill strong { font-weight: 700; }
      .rx-body { display: flex; min-height: 280px; }
      .rx-left { width: 200px; flex-shrink: 0; padding: 14px 16px 14px 0; border-right: 1px solid #999; }
      .rx-right { flex: 1; padding: 14px 0 14px 20px; }
      .left-title { font-size: 13px; font-weight: 700; margin-bottom: 6px; }
      .left-divider { border-bottom: 1px solid #ddd; margin: 10px 0; }
      .left-section { margin-bottom: 14px; }
      .complaint-list { list-style: disc; padding-left: 18px; font-size: 12px; line-height: 2.1; }
      .complaint-para { font-size: 12px; line-height: 1.6; }
      .rx-symbol { font-size: 36px; font-weight: 700; font-family: 'Times New Roman', serif; margin-bottom: 12px; line-height: 1; }
      .medicine-item { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed #ddd; }
      .medicine-item:last-child { border-bottom: none; }
      .med-name { font-size: 13px; margin-bottom: 4px; }
      .med-generic { font-size: 11px; color: #666; }
      .med-strength { font-size: 11px; color: #444; }
      .med-instruction { display: flex; gap: 18px; padding-left: 14px; font-size: 11px; color: #333; flex-wrap: wrap; }
      .med-dosage { font-weight: 600; }
      .followup-line { margin-top: 20px; font-size: 13px; font-weight: 700; }
      .rx-footer { display: flex; justify-content: space-between; border-top: 1px solid #ccc; padding-top: 8px; margin-top: 16px; font-size: 10px; color: #666; }
      .powered-by strong { color: #111; }
      @media print { body { padding: 0; } }
    </style>
    </head><body>${printContent.outerHTML}</body></html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
  document.title = originalTitle;
}

onMounted(() => store.fetchById(route.params.id));
</script>

<style scoped>
/* ============================= */
/* UNCHANGED — Buttons           */
/* ============================= */
.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.1);
  color: #5a6282;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.back-button:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.1);
  color: #1e2a4a;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}
.edit-button:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

.print-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 12px;
  background: rgba(238, 136, 117, 0.1);
  color: #c05030;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.print-button:hover {
  background: rgba(238, 136, 117, 0.2);
  transform: translateY(-1px);
}

/* ============================= */
/* UNCHANGED — Loading Spinner   */
/* ============================= */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 20px;
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
  font-weight: 500;
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

/* ============================= */
/* UNCHANGED — Not Found State   */
/* ============================= */
.not-found-state {
  text-align: center;
  padding: 60px 40px;
}
.not-found-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
.not-found-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e2a4a;
  margin-bottom: 8px;
}
.not-found-text {
  font-size: 13px;
  color: #9aa0b8;
  margin-bottom: 24px;
}
.back-link {
  font-size: 13px;
  font-weight: 700;
  color: #ee8875;
  text-decoration: none;
}

/* ============================= */
/* PRESCRIPTION — image style    */
/* ============================= */
.rx-paper {
  position: relative;
  background: white;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: 0.3s;
  margin-top: 20px;
}

.rx-paper::before {
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

.rx-paper:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.rx-paper:hover::before {
  opacity: 0.35;
}

/* Doctor header */
.rx-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 22px 28px 16px;
  border-bottom: 2px solid #111;
  flex-wrap: wrap;
  gap: 12px;
}
.doctor-name {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #000;
}
.doctor-line {
  font-size: 11.5px;
  line-height: 1.65;
  color: #222;
}
.date-block {
  text-align: right;
  font-size: 12px;
  line-height: 2;
  white-space: nowrap;
}
.date-line {
  display: block;
}
.date-line strong {
  font-weight: 700;
}

/* Patient strip */
.patient-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0 28px;
  border-bottom: 1px solid #ccc;
  padding: 8px 28px;
  font-size: 12.5px;
}
.pfield {
  white-space: nowrap;
}
.pfield strong {
  font-weight: 700;
}

/* Vitals */
.vitals-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 7px 28px;
  font-size: 12px;
  border-bottom: 1px dashed #ccc;
}
.vital-pill strong {
  font-weight: 700;
}

/* Two-column body */
.rx-body {
  display: flex;
  min-height: 320px;
}

/* Left column */
.rx-left {
  width: 215px;
  flex-shrink: 0;
  padding: 18px 18px 18px 28px;
  border-right: 1px solid #bbb;
}
.left-section {
  margin-bottom: 16px;
}
.left-title {
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #000;
}
.left-divider {
  border-bottom: 1px solid #ddd;
  margin: 12px 0;
}
.complaint-list {
  list-style: disc;
  padding-left: 18px;
  font-size: 12.5px;
  line-height: 2.1;
  color: #222;
}
.complaint-para {
  font-size: 12.5px;
  line-height: 1.6;
  color: #222;
}

/* Right column */
.rx-right {
  flex: 1;
  padding: 18px 28px 18px 22px;
}
.rx-symbol {
  font-size: 38px;
  font-weight: 700;
  font-family: "Times New Roman", Georgia, serif;
  color: #111;
  margin-bottom: 14px;
  line-height: 1;
}
.rx-symbol sub {
  font-size: 20px;
  vertical-align: sub;
}

.no-meds {
  font-size: 13px;
  color: #999;
}

.medicines-list {
  display: flex;
  flex-direction: column;
}
.medicine-item {
  padding-bottom: 12px;
  margin-bottom: 2px;
  border-bottom: 1px dashed #ddd;
}
.medicine-item:last-child {
  border-bottom: none;
}
.med-name {
  font-size: 13.5px;
  margin-bottom: 4px;
  color: #000;
}
.med-name strong {
  font-weight: 700;
}
.med-num {
  color: #555;
  margin-right: 1px;
}
.med-strength {
  font-size: 12px;
  color: #333;
}
.med-generic {
  font-size: 11.5px;
  color: #666;
}
.med-instruction {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding-left: 16px;
  font-size: 12px;
  color: #333;
}
.med-dosage {
  font-weight: 600;
}
.med-note {
  color: #555;
}
.med-duration {
  color: #555;
}

.followup-line {
  margin-top: 22px;
  font-size: 13.5px;
  font-weight: 700;
  color: #000;
}

/* Footer */
.rx-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  padding: 8px 28px;
  font-size: 10.5px;
  color: #666;
}
.powered-by strong {
  font-weight: 700;
  color: #111;
}

/* Responsive */
@media (max-width: 640px) {
  .rx-body {
    flex-direction: column;
  }
  .rx-left {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #bbb;
    padding: 14px 20px;
  }
  .rx-right {
    padding: 14px 20px;
  }
  .rx-header {
    flex-direction: column;
  }
  .date-block {
    text-align: left;
  }
  .patient-strip {
    padding: 8px 20px;
  }
  .vitals-strip {
    padding: 7px 20px;
  }
}

/* Print */
@media print {
  .no-print {
    display: none !important;
  }
  .rx-paper {
    box-shadow: none;
    border-radius: 0;
    border: none;
  }
}

.fade-in-up {
  animation: fadeInUp 0.4s ease;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
