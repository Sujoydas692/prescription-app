# Prescription App – Frontend

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
cd prescription-app
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_API_BASE_URL=your_api_url_here
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Run development server
```bash
npm run dev
```
App runs at: **http://localhost:5173**

## 4. Build for Production
```bash
npm run build
```
Output in `dist/` folder. Serve with any static file server or nginx.
