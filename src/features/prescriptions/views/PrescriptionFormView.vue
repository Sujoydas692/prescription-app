<template>
  <div class="prescription-container fade-in-up">
    <!-- Form Section (Left) -->
    <div class="form-section">
      <div class="space-y-5 max-w-5xl">
        <!-- ═══ PATIENT INFO ═══ -->
        <div class="f-card">
          <div class="f-card-head">
            <h3 class="f-card-title">
              <span class="f-icon">👤</span> Patient Information
            </h3>
            <button @click="clearForm" class="f-btn-ghost">🔄 Clear</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="f-group">
              <label class="f-label">Patient *</label>
              <select v-model="form.patientId" class="f-control">
                <option value="">Select patient</option>
                <option
                  v-for="p in patientsStore.patients"
                  :key="p.patientId"
                  :value="p.patientId"
                >
                  {{ p.fullName }} · {{ p.mobileNumber }}
                </option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-label">Chamber *</label>
              <select v-model="form.chamberId" class="f-control">
                <option value="">Select chamber</option>
                <option
                  v-for="c in chambersStore.chambers"
                  :key="c.chamberId"
                  :value="c.chamberId"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-label">Visit Date *</label>
              <input
                v-model="form.visitDate"
                type="datetime-local"
                class="f-control"
              />
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
              <input
                v-model="vitals[v.key]"
                :placeholder="v.placeholder"
                class="vital-input"
              />
              <div class="vital-unit">{{ v.unit }}</div>
            </div>
          </div>
        </div>

        <!-- ═══ DIAGNOSIS ═══ -->
        <div class="f-card">
          <div class="f-card-head">
            <h3 class="f-card-title">
              <span class="f-icon">🔬</span> Diagnosis & Complaints
            </h3>
          </div>
          <div class="f-group mb-4">
            <label class="f-label">Chief Complaints</label>
            <textarea
              v-model="form.chiefComplaints"
              rows="2"
              class="f-control resize-none"
              placeholder="Patient's main complaints..."
            ></textarea>
          </div>
          <div class="f-group mb-4">
            <label class="f-label">Diagnosis</label>
            <div class="flex gap-2">
              <input
                v-model="form.diagnosis"
                type="text"
                class="f-control flex-1"
                placeholder="Type or click tag below..."
              />
            </div>
          </div>
          <!-- Diagnosis tags -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="d in diagnosisTags"
              :key="d"
              @click="form.diagnosis = d"
              class="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:scale-105"
              :style="
                form.diagnosis === d
                  ? 'background:#EE8875; color:white; box-shadow:0 2px 8px rgba(238,136,117,0.4);'
                  : 'background:rgba(238,136,117,0.1); color:#C05030; border:1px solid rgba(238,136,117,0.2);'
              "
            >
              {{ form.diagnosis === d ? "✓ " : "" }}{{ d }}
            </button>
          </div>
        </div>

        <!-- ═══ MEDICINES ═══ -->
        <div class="f-card">
          <div class="f-card-head">
            <h3 class="f-card-title">
              <span class="f-icon">💊</span> Medicines
              <span class="ml-1 text-[13px] font-normal" style="color: #9aa0b8"
                >({{ form.medicines.length }})</span
              >
            </h3>
            <div class="flex gap-2">
              <button
                v-if="form.medicines.length"
                @click="sortMeds"
                class="f-btn-ghost"
              >
                ⇅ Sort
              </button>
              <button @click="showAddMed = !showAddMed" class="f-btn-accent">
                + Add Medicine
              </button>
            </div>
          </div>

          <div
            v-if="form.medicines.length === 0 && !showAddMed"
            class="text-center py-10"
          >
            <div class="text-4xl mb-2">💊</div>
            <p class="text-[13px]" style="color: #9aa0b8">
              No medicines added yet
            </p>
          </div>

          <div v-if="form.medicines.length" class="overflow-x-auto -mx-1">
            <table class="w-full">
              <thead>
                <tr style="background: rgba(238, 136, 117, 0.07)">
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
                <tr
                  v-for="(med, i) in form.medicines"
                  :key="i"
                  class="border-b transition-colors"
                  style="border-color: rgba(30, 42, 74, 0.06)"
                >
                  <td
                    class="rx-td font-mono text-[12px]"
                    style="color: #9aa0b8; width: 36px"
                  >
                    {{ String(i + 1).padStart(2, "0") }}
                  </td>
                  <td class="rx-td">
                    <p
                      class="font-bold text-[13px]"
                      style="
                        color: #1e2a4a;
                        font-family: &quot;Nunito&quot;, sans-serif;
                      "
                    >
                      {{ med.brandSearch }}
                    </p>
                    <p class="text-[11px]" style="color: #9aa0b8">
                      {{ med.type }}
                    </p>
                  </td>
                  <td class="rx-td">
                    <span
                      class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style="
                        background: rgba(46, 107, 139, 0.1);
                        color: #2e6b8b;
                      "
                      >{{ med.dosage || "—" }}</span
                    >
                  </td>
                  <td class="rx-td">
                    <select v-model="med.frequency" class="f-control-sm">
                      <option>1+0+0</option>
                      <option>0+1+0</option>
                      <option>0+0+1</option>
                      <option>1+1+0</option>
                      <option>1+0+1</option>
                      <option>0+1+1</option>
                      <option>1+1+1</option>
                      <option>SOS</option>
                    </select>
                  </td>
                  <td class="rx-td">
                    <input
                      v-model="med.duration"
                      class="f-control-sm"
                      placeholder="7 days"
                    />
                  </td>
                  <td class="rx-td">
                    <input
                      v-model="med.instruction"
                      class="f-control-sm"
                      placeholder="After meal"
                    />
                  </td>
                  <td class="rx-td">
                    <button
                      @click="form.medicines.splice(i, 1)"
                      class="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] transition-all"
                      style="background: rgba(224, 82, 82, 0.1); color: #e05252"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Add medicine row -->
          <div
            v-if="showAddMed"
            class="mt-4 p-4 rounded-xl"
            style="
              background: rgba(238, 136, 117, 0.05);
              border: 1.5px dashed rgba(238, 136, 117, 0.3);
            "
          >
            <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div class="f-group md:col-span-2">
                <label class="f-label">Brand Name *</label>
                <div class="relative">
                  <input
                    v-model="newMed.brandSearch"
                    @input="onBrandSearch"
                    type="text"
                    class="f-control"
                    placeholder="Search brand..."
                  />
                  <div
                    v-if="brandResults.length"
                    class="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl z-30 max-h-44 overflow-y-auto mt-1"
                    style="border: 1px solid rgba(30, 42, 74, 0.1)"
                  >
                    <button
                      v-for="b in brandResults"
                      :key="b.brandId"
                      @click="selectBrand(b)"
                      class="w-full text-left px-3 py-2.5 text-[12px] border-b last:border-0 transition-colors"
                      style="border-color: rgba(30, 42, 74, 0.06)"
                    >
                      <span class="font-bold" style="color: #1e2a4a">{{
                        b.brandName
                      }}</span>
                      <span class="ml-2 text-[11px]" style="color: #9aa0b8"
                        >{{ b.genericName }} · {{ b.form }}
                        {{ b.strength }}</span
                      >
                    </button>
                  </div>
                </div>
              </div>
              <div class="f-group">
                <label class="f-label">Type</label>
                <select v-model="newMed.type" class="f-control">
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Injection</option>
                  <option>Cream</option>
                  <option>Drops</option>
                </select>
              </div>
              <div class="f-group">
                <label class="f-label">Dosage</label>
                <input
                  v-model="newMed.dosage"
                  class="f-control"
                  placeholder="500mg"
                />
              </div>
              <div class="f-group">
                <label class="f-label">Duration</label>
                <input
                  v-model="newMed.duration"
                  class="f-control"
                  placeholder="7 days"
                />
              </div>
            </div>
            <div class="flex gap-2 mt-3 justify-end">
              <button @click="showAddMed = false" class="f-btn-ghost">
                Cancel
              </button>
              <button @click="addMedicine" class="f-btn-primary">
                Add Medicine
              </button>
            </div>
          </div>
        </div>

        <!-- ═══ NOTES + TESTS ═══ -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="f-card">
            <h3 class="f-card-title mb-4">
              <span class="f-icon">📝</span> Doctor's Notes
            </h3>
            <textarea
              v-model="form.notes"
              rows="4"
              class="f-control resize-none w-full"
              placeholder="Additional instructions, notes..."
            ></textarea>
          </div>

          <div class="f-card">
            <h3 class="f-card-title mb-4">
              <span class="f-icon">📅</span> Tests & Follow-up
            </h3>
            <div class="space-y-4">
              <!-- Tests Advised -->
              <div class="f-group">
                <label class="f-label">Tests Advised</label>
                <div class="flex gap-2">
                  <input
                    v-model="testsInput"
                    type="text"
                    class="f-control flex-1"
                    placeholder="e.g. CBC, LFT, ECG"
                    @keyup.enter="addTest"
                  />
                  <button @click="addTest" class="f-btn-accent">+ Add</button>
                </div>
              </div>

              <!-- Test Tags -->
              <div class="flex flex-wrap gap-2 min-h-8">
                <span
                  v-for="(t, i) in form.tests"
                  :key="i"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
                  style="background: rgba(46, 107, 139, 0.1); color: #2e6b8b"
                >
                  {{ t.testName }}
                  <button
                    @click="form.tests.splice(i, 1)"
                    class="opacity-60 hover:opacity-100 text-[13px]"
                  >
                    ✕
                  </button>
                </span>
              </div>

              <!-- Separator Line -->
              <div class="relative my-2">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-xs">
                  <span class="bg-white px-2 text-gray-400">Follow-up</span>
                </div>
              </div>

              <!-- Next Visit Date -->
              <div class="f-group">
                <label class="f-label">Follow-up Date</label>
                <input
                  v-model="form.nextVisitDate"
                  type="date"
                  class="f-control"
                />
                <p class="text-[10px] text-gray-400 mt-1">
                  Optional - recommended date for follow-up
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ ACTIONS ═══ -->
        <div class="flex items-center justify-end gap-3 pb-4">
          <RouterLink to="/prescriptions" class="f-btn-ghost px-5 py-2.5"
            >Cancel</RouterLink
          >
          <button
            @click="onSubmit"
            :disabled="store.loading"
            class="f-btn-primary"
          >
            {{
              store.loading
                ? "Saving..."
                : isEdit
                  ? "Update"
                  : "Save Prescription"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Live Preview Section (Right) -->
    <div class="preview-section">
      <div class="preview-header">
        <h3 class="preview-title">
          <span class="preview-icon">📄</span> Live Preview
        </h3>
        <button @click="printPreview" class="print-btn">
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
          Print
        </button>
      </div>

      <!-- ══ PRESCRIPTION PREVIEW — image style ══ -->
      <div id="prescription-preview" class="rx-paper">
        <!-- Doctor Header -->
        <div class="rx-header">
          <div class="rx-doctor-block">
            <h1 class="rx-doc-name">
              Dr. {{ authStore.doctorName || "Md. Mahbubul Islam" }}
            </h1>
            <p class="rx-doc-line">
              {{ authStore.doctorDesignation || "MBBS, BCS" }}
            </p>
            <p class="rx-doc-line">
              {{
                authStore.doctorSpeciality ||
                "General Physician, ENT, Covid Unit"
              }}
            </p>
            <p class="rx-doc-line">
              Indoor Medical Officer ( ENT &amp; Head Neck Surgery )
            </p>
            <p class="rx-doc-line">ENT &amp; Head Neck Surgery</p>
            <p class="rx-doc-line">
              {{
                authStore.hospital ||
                "Shaheed Suhrawardy Medical College Hospital, Dhaka"
              }}
            </p>
            <p class="rx-doc-line">
              BMDC Reg. No - {{ authStore.regNo || "A62931" }}
            </p>
          </div>
          <div class="rx-date-block">
            <p class="rx-date-line">
              <strong>Date:</strong> {{ formatDate(form.visitDate) }}
            </p>
            <p class="rx-date-line" v-if="form.nextVisitDate">
              <strong>Ref:</strong> —
            </p>
          </div>
        </div>

        <!-- Patient Strip -->
        <div class="rx-patient-strip">
          <span class="rx-pfield" v-if="selectedPatient?.fullName">
            <strong>Patient Name:</strong> {{ selectedPatient.fullName }}
          </span>
          <span class="rx-pfield" v-if="selectedPatient?.gender">
            <strong>Gender:</strong> {{ selectedPatient.gender }}
          </span>
          <span class="rx-pfield" v-if="selectedPatient?.age">
            <strong>Age:</strong> {{ selectedPatient.age }} yrs
          </span>
          <span class="rx-pfield" v-if="selectedPatient?.weight">
            <strong>Weight:</strong> {{ selectedPatient.weight }} kg
          </span>
          <span class="rx-pfield" v-if="!selectedPatient">
            <strong>Patient Name:</strong> —
          </span>
        </div>

        <!-- Vitals Strip -->
        <div v-if="hasVitals" class="rx-vitals-strip">
          <span v-if="vitals.bp" class="rx-vital-pill"
            ><strong>BP:</strong> {{ vitals.bp }} mmHg</span
          >
          <span v-if="vitals.pulse" class="rx-vital-pill"
            ><strong>Pulse:</strong> {{ vitals.pulse }} bpm</span
          >
          <span v-if="vitals.temp" class="rx-vital-pill"
            ><strong>Temp:</strong> {{ vitals.temp }} °F</span
          >
          <span v-if="vitals.spo2" class="rx-vital-pill"
            ><strong>SpO₂:</strong> {{ vitals.spo2 }} %</span
          >
        </div>

        <!-- Two-column body -->
        <div class="rx-body">
          <!-- LEFT COLUMN -->
          <div class="rx-left">
            <div v-if="form.chiefComplaints" class="rx-left-section">
              <h3 class="rx-left-title">Chief Complaints:</h3>
              <ul class="rx-complaint-list">
                <li
                  v-for="line in form.chiefComplaints
                    .split('\n')
                    .filter((l) => l.trim())"
                  :key="line"
                >
                  {{ line.trim() }}
                </li>
              </ul>
            </div>

            <div
              class="rx-left-divider"
              v-if="
                form.chiefComplaints && (form.tests.length || form.diagnosis)
              "
            ></div>

            <div v-if="form.tests.length" class="rx-left-section">
              <h3 class="rx-left-title">Investigation:</h3>
              <ul class="rx-complaint-list">
                <li v-for="t in form.tests" :key="t.testName">
                  {{ t.testName }}
                </li>
              </ul>
            </div>

            <div v-if="form.diagnosis" class="rx-left-section">
              <h3 class="rx-left-title">Diagnosis:</h3>
              <p class="rx-complaint-para">{{ form.diagnosis }}</p>
            </div>

            <div v-if="form.notes" class="rx-left-section">
              <h3 class="rx-left-title">Notes:</h3>
              <p class="rx-complaint-para">{{ form.notes }}</p>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="rx-right">
            <div class="rx-symbol">R<sub>x</sub></div>

            <div v-if="!form.medicines.length" class="rx-no-meds">
              No medicines prescribed.
            </div>
            <div v-else class="rx-medicines-list">
              <div
                v-for="(med, i) in form.medicines"
                :key="i"
                class="rx-medicine-item"
              >
                <p class="rx-med-name">
                  <span class="rx-med-num">{{ i + 1 }}.</span>
                  <strong
                    >{{ med.type || "Tab" }}. {{ med.brandSearch }}</strong
                  >
                  <span v-if="med.dosage" class="rx-med-strength">
                    {{ med.dosage }}</span
                  >
                </p>
                <p class="rx-med-instruction">
                  <span class="rx-med-dosage">{{ med.frequency || "—" }}</span>
                  <span v-if="med.instruction" class="rx-med-note">{{
                    med.instruction
                  }}</span>
                  <span v-if="med.duration" class="rx-med-duration">{{
                    med.duration
                  }}</span>
                </p>
              </div>
            </div>

            <div v-if="form.nextVisitDate" class="rx-followup">
              <strong>Follow-up Date:</strong>
              {{ formatDateForFollowUp(form.nextVisitDate) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import { usePrescriptionsStore } from "../stores/prescriptionsStore";
import { usePatientsStore } from "@/features/patients/stores/patientsStore";
import { useChambersStore } from "@/features/chambers/stores/chambersStore";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { medicinesApi } from "@/features/medicines/api/medicinesApi";

const route = useRoute();
const router = useRouter();
const store = usePrescriptionsStore();
const patientsStore = usePatientsStore();
const chambersStore = useChambersStore();
const authStore = useAuthStore();
const isEdit = computed(() => !!route.params.id);

const showAddMed = ref(false);
const brandResults = ref([]);
const testsInput = ref("");

const vitalFields = [
  { key: "bp", label: "Blood Pressure", placeholder: "120/80", unit: "mmHg" },
  { key: "pulse", label: "Pulse", placeholder: "72", unit: "bpm" },
  { key: "temp", label: "Temperature", placeholder: "98.6", unit: "°F" },
  { key: "spo2", label: "SpO₂", placeholder: "98", unit: "%" },
];

const vitals = reactive({ bp: "", pulse: "", temp: "", spo2: "" });

const selectedPatient = computed(() => {
  return patientsStore.patients?.find((p) => p.patientId === form.patientId);
});

const hasVitals = computed(() => {
  return vitals.bp || vitals.pulse || vitals.temp || vitals.spo2;
});

const formatDate = (date) => {
  if (!date) return "—";
  return dayjs(date).format("DD MMM YYYY");
};

const formatDateForFollowUp = (date) => {
  if (!date) return "—";
  return dayjs(date).format("DD MMM YYYY");
};

const diagnosisTags = [
  "Hypertension",
  "Type 2 Diabetes",
  "Fever",
  "URI",
  "Dyspepsia",
  "Allergic Rhinitis",
  "Asthma",
  "Gastritis",
  "Bronchitis",
  "Migraine",
  "UTI",
  "IBS",
  "Anemia",
  "Hypothyroidism",
  "Arthritis",
];

const form = reactive({
  patientId: route.query.patientId || "",
  chamberId: "",
  visitDate: dayjs().format("YYYY-MM-DDTHH:mm"),
  nextVisitDate: "",
  chiefComplaints: "",
  diagnosis: route.query.dx || "",
  notes: "",
  medicines: [],
  tests: [],
});

const newMed = reactive({
  brandId: null,
  brandSearch: "",
  type: "Tablet",
  dosage: "",
  duration: "7 days",
  frequency: "1+1+1",
  instruction: "",
});

const onBrandSearch = useDebounceFn(async () => {
  if (newMed.brandSearch.length < 2) {
    brandResults.value = [];
    return;
  }
  try {
    const { data } = await medicinesApi.searchBrands({ q: newMed.brandSearch });
    brandResults.value = data.brands || [];
  } catch {
    brandResults.value = [];
  }
}, 300);

function selectBrand(b) {
  newMed.brandId = b.brandId;
  newMed.brandSearch = b.brandName;
  brandResults.value = [];
}

function addMedicine() {
  if (!newMed.brandSearch.trim()) {
    toast.error("Enter brand name");
    return;
  }
  form.medicines.push({ ...newMed });
  Object.assign(newMed, {
    brandId: null,
    brandSearch: "",
    type: "Tablet",
    dosage: "",
    duration: "7 days",
    frequency: "1+1+1",
    instruction: "",
  });
  showAddMed.value = false;
  toast.success("Medicine added");
}

function sortMeds() {
  form.medicines.sort((a, b) => a.brandSearch.localeCompare(b.brandSearch));
  toast.success("Sorted!");
}

function addTest() {
  if (testsInput.value.trim()) {
    form.tests.push({ testName: testsInput.value.trim() });
    testsInput.value = "";
  }
}

function clearForm() {
  Object.assign(form, {
    patientId: "",
    chamberId: "",
    chiefComplaints: "",
    diagnosis: "",
    notes: "",
    medicines: [],
    tests: [],
    nextVisitDate: "",
  });
  Object.assign(vitals, { bp: "", pulse: "", temp: "", spo2: "" });
}

function printPreview() {
  const printContent = document.getElementById("prescription-preview");
  const printWindow = window.open("", "_blank", "width=800,height=600");

  const contentClone = printContent.cloneNode(true);

  const unwantedElements = contentClone.querySelectorAll(
    ".no-print, .preview-header, .print-btn",
  );
  unwantedElements.forEach((el) => el.remove());

  // Calculate total pages for CSS
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.visibility = "hidden";
  tempDiv.style.width = "800px";
  tempDiv.innerHTML = contentClone.outerHTML;
  document.body.appendChild(tempDiv);
  const contentHeight = tempDiv.scrollHeight;
  const pageHeight = 1123;
  const totalPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
  document.body.removeChild(tempDiv);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Prescription</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: "Nunito", sans-serif;
          background: white;
          padding: 20px;
          color: #111;
          font-size: 12px;
          margin: 0;
        }
        
        /* Hide any default browser header/footer */
        @page {
          margin: 1.5cm;
          size: auto;
        }
        
        /* Prescription Paper Styles */
        .rx-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 12px;
          border-bottom: 2px solid #111;
          margin-bottom: 8px;
        }
        
        .rx-doc-name {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .rx-doc-line {
          font-size: 11px;
          line-height: 1.65;
          color: #222;
        }
        
        .rx-date-block {
          text-align: right;
          font-size: 11px;
          line-height: 2;
        }
        
        .rx-date-line {
          display: block;
        }
        
        .rx-patient-strip {
          display: flex;
          gap: 24px;
          border-bottom: 1px solid #ccc;
          padding: 7px 0;
          flex-wrap: wrap;
        }
        
        .rx-pfield strong {
          font-weight: 700;
        }
        
        .rx-vitals-strip {
          display: flex;
          gap: 20px;
          padding: 6px 0;
          border-bottom: 1px dashed #ccc;
        }
        
        .rx-vital-pill strong {
          font-weight: 700;
        }
        
        .rx-body {
          display: flex;
          min-height: 280px;
        }
        
        .rx-left {
          width: 200px;
          flex-shrink: 0;
          padding: 14px 16px 14px 0;
        }
        
        .rx-right {
          flex: 1;
          padding: 14px 0 14px 20px;
        }
        
        .rx-left-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        
        .rx-left-divider {
          border-bottom: 1px solid #ddd;
          margin: 10px 0;
        }
        
        .rx-left-section {
          margin-bottom: 14px;
        }
        
        .rx-complaint-list {
          list-style: disc;
          padding-left: 18px;
          font-size: 12px;
          line-height: 2.1;
        }
        
        .rx-complaint-para {
          font-size: 12px;
          line-height: 1.6;
        }
        
        .rx-symbol {
          font-size: 36px;
          font-weight: 700;
          font-family: "Nunito", sans-serif;
          margin-bottom: 12px;
          line-height: 1;
        }
        
        .rx-medicine-item {
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #ddd;
        }
        
        .rx-medicine-item:last-child {
          border-bottom: none;
        }
        
        .rx-med-name {
          font-size: 13px;
          margin-bottom: 4px;
        }
        
        .rx-med-strength {
          font-size: 11px;
          color: #444;
        }
        
        .rx-med-instruction {
          display: flex;
          gap: 18px;
          padding-left: 14px;
          font-size: 11px;
          color: #333;
          flex-wrap: wrap;
        }
        
        .rx-med-dosage {
          font-weight: 600;
        }
        
        .rx-followup {
          margin-top: 20px;
          font-size: 13px;
          font-weight: 700;
        }
        
        /* Footer with Page Number and Powered By */
        .rx-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #ccc;
          padding: 8px 20px;
          margin-top: 16px;
          font-size: 10px;
          color: #666;
          background: white;
        }
        
        .rx-powered {
          font-size: 10px;
          color: #666;
        }
        
        .rx-powered strong {
          font-weight: 700;
          color: #111;
        }
        
        .rx-page-number {
          font-size: 10px;
          color: #666;
        }
        
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
            @bottom-left {
              content: "Powered by Prescription App";
              font-size: 13px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 8px;
            }
            @bottom-right {
              content: "Page " counter(page) " of ${totalPages}";
              font-size: 13px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 8px;
            }
          }
          
          .rx-footer {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        ${contentClone.outerHTML}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  }, 300);
}

async function onSubmit() {
  if (!form.patientId) {
    toast.error("Select a patient");
    return;
  }
  if (!form.chamberId) {
    toast.error("Select a chamber");
    return;
  }
  try {
    const payload = {
      ...form,
      vitals: { ...vitals },
      medicines: form.medicines.filter((m) => m.brandSearch),
    };
    if (isEdit.value) {
      await store.updatePrescription(route.params.id, payload);
      toast.success("Prescription updated!");
    } else {
      await store.createPrescription(payload);
      toast.success("Prescription saved!");
    }
    router.push("/prescriptions");
  } catch {
    toast.error(store.error || "Failed to save");
  }
}

onMounted(async () => {
  await Promise.all([patientsStore.fetchAll(), chambersStore.fetchAll()]);
  if (isEdit.value) {
    const rx = await store.fetchById(route.params.id);
    if (rx) {
      Object.assign(form, {
        patientId: rx.patientId,
        chamberId: rx.chamberId,
        visitDate: dayjs(rx.visitDate).format("YYYY-MM-DDTHH:mm"),
        nextVisitDate: rx.nextVisitDate
          ? dayjs(rx.nextVisitDate).format("YYYY-MM-DD")
          : "",
        chiefComplaints: rx.chiefComplaints || "",
        diagnosis: rx.diagnosis || "",
        notes: rx.notes || "",
        medicines:
          rx.medicines?.map((m) => ({
            brandId: m.brandId,
            brandSearch: m.brandName,
            type: m.type || "Tablet",
            dosage: m.dosage || "",
            duration: m.duration || "7 days",
            frequency: m.frequency || "1+1+1",
            instruction: m.instruction || "",
          })) || [],
        tests: rx.tests?.map((t) => ({ testName: t.testName })) || [],
      });
    }
  }
});
</script>

<style scoped>
/* Two Column Layout */
.prescription-container {
  display: flex;
  gap: 24px;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.form-section {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  max-height: calc(100vh - 40px);
}

.preview-section {
  width: 500px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-radius: 24px 24px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: 12px;
}

.preview-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e2a4a;
  font-family: "Nunito", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.print-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(238, 136, 117, 0.1);
  color: #c05030;
  font-weight: 600;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.print-btn:hover {
  background: rgba(238, 136, 117, 0.2);
  transform: translateY(-1px);
}

/* ══════════════════════════════════ */
/* PRESCRIPTION PREVIEW — image style */
/* ══════════════════════════════════ */
.rx-paper {
  background: white;
  overflow: hidden;
  border: 1px solid rgba(30, 42, 74, 0.08);
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  color: #111;
}

/* Doctor header */
.rx-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 22px 14px;
  border-bottom: 2px solid #111;
  flex-wrap: wrap;
  gap: 10px;
}
.rx-doc-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 3px;
  color: #000;
}
.rx-doc-line {
  font-size: 10.5px;
  line-height: 1.65;
  color: #222;
}
.rx-date-block {
  text-align: right;
  font-size: 11px;
  line-height: 2;
  white-space: nowrap;
}
.rx-date-line {
  display: block;
}
.rx-date-line strong {
  font-weight: 700;
}

/* Patient strip */
.rx-patient-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
  border-bottom: 1px solid #ccc;
  padding: 7px 22px;
  font-size: 11.5px;
}
.rx-pfield {
  white-space: nowrap;
}
.rx-pfield strong {
  font-weight: 700;
}

/* Vitals */
.rx-vitals-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 6px 22px;
  font-size: 11px;
  border-bottom: 1px dashed #ccc;
}
.rx-vital-pill strong {
  font-weight: 700;
}

/* Two-column body */
.rx-body {
  display: flex;
  min-height: 280px;
}

/* Left column */
.rx-left {
  width: 175px;
  flex-shrink: 0;
  padding: 14px 14px 14px 22px;
}
.rx-left-section {
  margin-bottom: 14px;
}
.rx-left-title {
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #000;
}
.rx-left-divider {
  border-bottom: 1px solid #ddd;
  margin: 10px 0;
}
.rx-complaint-list {
  list-style: disc;
  padding-left: 16px;
  font-size: 11.5px;
  line-height: 2.1;
  color: #222;
}
.rx-complaint-para {
  font-size: 11.5px;
  line-height: 1.6;
  color: #222;
}

/* Right column */
.rx-right {
  flex: 1;
  padding: 14px 22px 14px 18px;
}
.rx-symbol {
  font-size: 34px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  color: #111;
  margin-bottom: 12px;
  line-height: 1;
}
.rx-symbol sub {
  font-size: 18px;
  vertical-align: sub;
}

.rx-no-meds {
  font-size: 12px;
  color: #999;
}

.rx-medicines-list {
  display: flex;
  flex-direction: column;
}
.rx-medicine-item {
  padding-bottom: 10px;
  margin-bottom: 2px;
  border-bottom: 1px dashed #ddd;
}
.rx-medicine-item:last-child {
  border-bottom: none;
}
.rx-med-name {
  font-size: 12.5px;
  margin-bottom: 3px;
  color: #000;
}
.rx-med-name strong {
  font-weight: 700;
}
.rx-med-num {
  color: #555;
  margin-right: 1px;
}
.rx-med-strength {
  font-size: 11px;
  color: #333;
}
.rx-med-instruction {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding-left: 14px;
  font-size: 11px;
  color: #333;
}
.rx-med-dosage {
  font-weight: 600;
}
.rx-med-note {
  color: #555;
}
.rx-med-duration {
  color: #555;
}

.rx-followup {
  margin-top: 18px;
  font-size: 12.5px;
  font-weight: 700;
  color: #000;
}

/* ══════════════════════════════════ */
/* FORM STYLES — unchanged           */
/* ══════════════════════════════════ */
.f-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(30, 42, 74, 0.07);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.04);
}
.f-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.f-card-title {
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  font-size: 14px;
  color: #1e2a4a;
  display: flex;
  align-items: center;
  gap: 8px;
}
.f-icon {
  width: 28px;
  height: 28px;
  background: rgba(238, 136, 117, 0.12);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.f-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.f-label {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9aa0b8;
}
.f-control {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1.5px solid rgba(30, 42, 74, 0.13);
  background: white;
  color: #1e2a4a;
  font-family: "DM Sans", sans-serif;
  font-size: 12px;
  outline: none;
  width: 100%;
  transition: all 0.2s;
}
.f-control:focus {
  border-color: #ee8875;
  box-shadow: 0 0 0 3px rgba(238, 136, 117, 0.1);
}
.f-control-sm {
  padding: 5px 8px;
  border-radius: 8px;
  border: 1.5px solid rgba(30, 42, 74, 0.12);
  font-size: 11px;
  color: #1e2a4a;
  font-family: "DM Sans", sans-serif;
  outline: none;
  width: 100%;
  min-width: 80px;
}
.f-btn-ghost {
  background: transparent;
  border: 1.5px solid rgba(30, 42, 74, 0.15);
  color: #5a6282;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.f-btn-ghost:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}
.f-btn-accent {
  background: rgba(238, 136, 117, 0.12);
  color: #c05030;
  border: 1px solid rgba(238, 136, 117, 0.3);
  padding: 6px 12px;
  border-radius: 8px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.f-btn-accent:hover {
  transform: translateY(-2px);
}
.f-btn-primary {
  padding: 10px 24px;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: #1e2a4a;
  background: #f4a58a;
  box-shadow: 0 6px 14px rgba(238, 136, 117, 0.35);
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.f-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(238, 136, 117, 0.45);
}

.f-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.vital-box {
  padding: 10px;
  border-radius: 12px;
  border: 1.5px solid rgba(30, 42, 74, 0.1);
  background: #fafcff;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;
}
.vital-box:focus-within {
  border-color: #ee8875;
  box-shadow: 0 0 0 3px rgba(238, 136, 117, 0.1);
}
.vital-label {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9aa0b8;
}
.vital-input {
  border: none;
  background: transparent;
  font-family: "DM Mono", monospace;
  font-size: 16px;
  font-weight: 700;
  color: #1e2a4a;
  outline: none;
  width: 100%;
}
.vital-unit {
  font-size: 10px;
  font-weight: 700;
  color: #ee8875;
}
.rx-th {
  padding: 8px 10px;
  text-align: left;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  color: #ee8875;
}
.rx-td {
  padding: 8px 10px;
  vertical-align: middle;
}

/* Responsive */
@media (max-width: 1024px) {
  .prescription-container {
    flex-direction: column;
    padding: 16px;
  }
  .preview-section {
    width: 100%;
    position: static;
    margin-top: 20px;
  }
  .form-section {
    max-height: none;
  }
}
</style>
