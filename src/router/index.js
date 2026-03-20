import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'

const LoginView           = () => import('@/features/auth/views/LoginView.vue')
const AppLayout           = () => import('@/shared/layouts/AppLayout.vue')
const DashboardView       = () => import('@/features/dashboard/views/DashboardView.vue')
const PatientsListView    = () => import('@/features/patients/views/PatientsListView.vue')
const PatientFormView     = () => import('@/features/patients/views/PatientFormView.vue')
const PatientDetailView   = () => import('@/features/patients/views/PatientDetailView.vue')
const PrescriptionsListView  = () => import('@/features/prescriptions/views/PrescriptionsListView.vue')
const PrescriptionFormView   = () => import('@/features/prescriptions/views/PrescriptionFormView.vue')
const PrescriptionDetailView = () => import('@/features/prescriptions/views/PrescriptionDetailView.vue')
const MedicinesView       = () => import('@/features/medicines/views/MedicinesView.vue')
const ChambersView        = () => import('@/features/chambers/views/ChambersView.vue')
const ProfileView         = () => import('@/features/profile/views/ProfileView.vue')

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard',                         name: 'dashboard',           component: DashboardView },
      { path: 'patients',                          name: 'patients',            component: PatientsListView },
      { path: 'patients/new',                      name: 'patients-new',        component: PatientFormView },
      { path: 'patients/:id',                      name: 'patient-detail',      component: PatientDetailView },
      { path: 'patients/:id/edit',                 name: 'patient-edit',        component: PatientFormView },
      { path: 'prescriptions',                     name: 'prescriptions',       component: PrescriptionsListView },
      { path: 'prescriptions/new',                 name: 'prescriptions-new',   component: PrescriptionFormView },
      { path: 'prescriptions/:id',                 name: 'prescription-detail', component: PrescriptionDetailView },
      { path: 'prescriptions/:id/edit',            name: 'prescription-edit',   component: PrescriptionFormView },
      { path: 'medicines',                         name: 'medicines',           component: MedicinesView },
      { path: 'chambers',                          name: 'chambers',            component: ChambersView },
      { path: 'chambers/new',                      name: 'chambers-new',        component: ChambersView },
      { path: 'profile',                           name: 'profile',             component: ProfileView },
      { path: 'settings',                          redirect: '/profile' },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// router.beforeEach((to) => {
//   const authStore = useAuthStore()
//   if (!to.meta.public && !authStore.isAuthenticated) return { path: '/login' }
//   if (to.path === '/login' && authStore.isAuthenticated) return { path: '/dashboard' }
// })

export default router
