<template>
  <div class="space-y-5 fade-in-up">
    <div class="f-card">
      <div class="f-card-head">
        <h3 class="f-card-title">
          <span class="f-icon">👤</span>
          {{ isEdit ? "Edit Patient" : "Add New Patient" }}
        </h3>
        <button @click="$router.back()" class="f-btn-ghost">← Back</button>
      </div>

      <div class="form-grid">
        <div class="form-group full-width">
          <label class="f-label">Full Name *</label>
          <input
            v-model="form.fullName"
            type="text"
            class="f-control"
            placeholder="Patient full name"
          />
        </div>
        <div class="form-group">
          <label class="f-label">Mobile Number *</label>
          <input
            v-model="form.mobileNumber"
            type="tel"
            class="f-control"
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div class="form-group">
          <label class="f-label">Age</label>
          <input
            v-model="form.age"
            type="number"
            class="f-control"
            placeholder="Years"
            min="0"
            max="150"
          />
        </div>
        <div class="form-group">
          <label class="f-label">Gender</label>
          <select v-model="form.gender" class="f-control">
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="f-label">Weight (kg)</label>
          <input
            v-model="form.weight"
            type="number"
            class="f-control"
            placeholder="kg"
          />
        </div>
        <div class="form-group full-width">
          <label class="f-label">Address</label>
          <textarea
            v-model="form.address"
            type="text"
            class="f-control"
            placeholder="Patient address"
          />
        </div>
      </div>

      <div class="button-section">
        <button @click="$router.back()" class="f-btn-ghost">Cancel</button>
        <button
          @click="onSubmit"
          :disabled="store.loading"
          class="f-btn-primary"
        >
          <div v-if="store.loading" class="btn-spinner"></div>
          <span>{{
            store.loading
              ? "Saving..."
              : isEdit
                ? "Update Patient"
                : "Add Patient"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { usePatientsStore } from "../stores/patientsStore";
const route = useRoute();
const router = useRouter();
const store = usePatientsStore();
const isEdit = computed(() => !!route.params.id);
const form = reactive({
  fullName: "",
  mobileNumber: "",
  age: "",
  gender: "",
  weight: "",
  address: "",
});
async function onSubmit() {
  if (!form.fullName.trim()) {
    toast.error("Enter patient name");
    return;
  }
  if (!form.mobileNumber.trim()) {
    toast.error("Enter mobile number");
    return;
  }
  try {
    if (isEdit.value) {
      await store.updatePatient(route.params.id, form);
      toast.success("Patient updated!");
    } else {
      await store.createPatient(form);
      toast.success("Patient added!");
    }
    router.push("/patients");
  } catch {
    toast.error(store.error || "Failed to save");
  }
}
onMounted(async () => {
  if (isEdit.value) {
    const p = await store.fetchById(route.params.id);
    if (p)
      Object.assign(form, {
        fullName: p.fullName,
        mobileNumber: p.mobileNumber,
        age: p.age || "",
        gender: p.gender || "",
        weight: p.weight || "",
        address: p.address || "",
      });
  }
});
</script>

<style scoped>
.f-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(30, 42, 74, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.f-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.f-card-title {
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  font-size: 15px;
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

/* Grid Layout for form fields */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: span 2;
}

.f-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9aa0b8;
}

.f-control {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(30, 42, 74, 0.13);
  background: white;
  color: #1e2a4a;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  outline: none;
  width: 100%;
  transition: all 0.2s;
  box-sizing: border-box;
}

.f-control:focus {
  border-color: #ee8875;
  box-shadow: 0 0 0 3px rgba(238, 136, 117, 0.1);
}

/* Button Section */
.button-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(30, 42, 74, 0.08);
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

.f-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: #1e2a4a;
  background: #f4a58a;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.f-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(238, 136, 117, 0.3);
}

.f-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .f-card {
    padding: 18px;
  }

  .button-section {
    flex-direction: column-reverse;
  }

  .f-btn-ghost,
  .f-btn-primary {
    display: block;
    width: 100%;
    text-align: center;
  }
}
</style>
