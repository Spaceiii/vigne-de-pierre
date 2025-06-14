import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/domain',
      name: 'domain',
      component: () => import('@/views/DomainView.vue'),
    },
    {
      path: '/wine',
      name: 'wine',
      component: () => import('@/views/WineView.vue'),
    },
    {
      path: '/wine/:id',
      name: 'wine-detail',
      component: () => import('@/views/WineDetailView.vue'),
      props: true,
    },
    {
      path: '/accommodation',
      name: 'accommodation',
      component: () => import('@/views/AccommodationView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
