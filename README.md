# Deen AI – Frontend

Vue 3 + Vite + Pinia frontend for the Deen AI prescription management system.

## Tech Stack
- **Vue 3** (Composition API)
- **Vite** (build tool)
- **Pinia** (state management)
- **TailwindCSS** (styling)
- **Axios** (HTTP client)
- **Vue Router 4** (routing)
- **VeeValidate + Yup** (form validation)
- **@vueuse/core** (composable utilities)
- **vue3-toastify** (notifications)
- **vue3-google-login** (Google OAuth)
- **dayjs** (date formatting)

---

## Quick Start

### 1. Install dependencies
```bash
cd deen-ai
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Get Google OAuth Client ID
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
4. Application type: **Web application**
5. Authorized JavaScript origins: `http://localhost:5173`
6. Authorized redirect URIs: `http://localhost:5173`
7. Copy the **Client ID** → paste in `.env`

### 4. Run development server
```bash
npm run dev
```
App runs at: **http://localhost:5173**

---

## Project Structure (Feature-Based Architecture)

```
src/
├── features/
│   ├── auth/
│   │   ├── api/authApi.js          # API calls
│   │   ├── stores/authStore.js     # Pinia store
│   │   └── views/LoginView.vue     # Login page
│   ├── patients/
│   │   ├── api/patientsApi.js
│   │   ├── stores/patientsStore.js
│   │   └── views/
│   │       ├── PatientsListView.vue
│   │       ├── PatientFormView.vue
│   │       └── PatientDetailView.vue
│   ├── prescriptions/
│   │   ├── api/prescriptionsApi.js
│   │   ├── stores/prescriptionsStore.js
│   │   └── views/
│   │       ├── PrescriptionsListView.vue
│   │       ├── PrescriptionFormView.vue
│   │       └── PrescriptionDetailView.vue
│   ├── medicines/
│   │   ├── api/medicinesApi.js
│   │   ├── stores/medicinesStore.js
│   │   └── views/MedicinesView.vue
│   ├── chambers/
│   │   ├── api/chambersApi.js
│   │   ├── stores/chambersStore.js
│   │   └── views/ChambersView.vue
│   └── dashboard/
│       └── views/DashboardView.vue
├── shared/
│   ├── layouts/AppLayout.vue       # Main sidebar layout
│   └── utils/http.js               # Axios instance
├── router/index.js                 # Vue Router
├── assets/styles/main.css          # Global CSS + Tailwind
├── App.vue
└── main.js
```

---

## Backend API Contract (.NET Developer Guide)

All endpoints require `Authorization: Bearer <jwt_token>` header **except** auth endpoints.

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/google-login` | `{ googleToken }` | `{ token, doctor }` |
| POST | `/api/auth/google-register` | `{ googleToken }` | `{ token, doctor }` |
| GET | `/api/auth/me` | – | `{ doctor }` |
| POST | `/api/auth/logout` | – | `{}` |

Doctor object: `{ doctorId, fullName, email, isVerified }`

### Patients
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/patients` | Returns `{ patients, total }` |
| GET | `/api/patients/:id` | Returns `{ patient }` |
| POST | `/api/patients` | Body: `{ mobileNumber, fullName, age }` |
| PUT | `/api/patients/:id` | Same body |
| DELETE | `/api/patients/:id` | – |
| GET | `/api/patients/search?q=` | Returns `{ patients }` |

### Prescriptions
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/prescriptions` | Query: `patientId?, chamberId?, page?, limit?` → `{ prescriptions, total }` |
| GET | `/api/prescriptions/:id` | Returns full prescription with medicines+tests |
| POST | `/api/prescriptions` | See body below |
| PUT | `/api/prescriptions/:id` | Same |
| DELETE | `/api/prescriptions/:id` | – |
| GET | `/api/prescriptions/patient/:patientId` | Returns `{ prescriptions }` |

Prescription body:
```json
{
  "chamberId": 1,
  "patientId": 1,
  "visitDate": "2026-03-08T10:00",
  "chiefComplaints": "...",
  "diagnosis": "...",
  "nextVisitDate": "2026-03-15",
  "medicines": [{ "brandId": 1, "dosage": "1+0+1", "duration": "7 days", "instruction": "After meal" }],
  "tests": [{ "testName": "CBC" }]
}
```

Prescription response includes: `patientName, patientMobile, patientAge, chamberName, medicines[]{brandName, genericName, form, strength, ...}, tests[]`

### Medicines (Brands)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/medicines/brands` | Query: `q?, genericId?` → `{ brands }` |
| GET | `/api/medicines/brands/:id` | `{ brand }` |
| POST | `/api/medicines/brands` | Body: `{ genericId, companyId, brandName, form, strength, price, packsize }` |
| PUT | `/api/medicines/brands/:id` | Same |
| DELETE | `/api/medicines/brands/:id` | – |

Brand response fields: `brandId, brandName, genericName, genericId, companyName, form, strength, price, packsize`

### Medicines (Generics)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/medicines/generics` | Query: `q?` → `{ generics }` |
| GET | `/api/medicines/generics/:id` | – |
| POST | `/api/medicines/generics` | Body: `{ genericName, precaution, indication, contraIndication, dose, sideEffect, pregnancyCategoryId, modeOfAction, interaction }` |
| PUT | `/api/medicines/generics/:id` | Same |
| DELETE | `/api/medicines/generics/:id` | – |

### Companies
| GET | `/api/medicines/companies` | Returns `{ companies: [{ companyId, companyName }] }` |

### Indications
| GET | `/api/medicines/indications` | Returns `{ indications: [{ indicationId, indicationName }] }` |

### Therapeutic Classes
| GET | `/api/medicines/therapeutic-classes` | Returns `{ therapeuticClasses: [{ therapeuticId, therapeuticName }] }` |

### Chambers
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/chambers` | Returns `{ chambers }` (filtered by doctor from JWT) |
| GET | `/api/chambers/:id` | `{ chamber }` |
| POST | `/api/chambers` | Body: `{ name, address, thana_id? }` |
| PUT | `/api/chambers/:id` | Same |
| DELETE | `/api/chambers/:id` | – |

---

## Build for Production
```bash
npm run build
```
Output in `dist/` folder. Serve with any static file server or nginx.
