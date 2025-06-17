import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';

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
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrderHistoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/:id',
      name: 'order-detail',
      component: () => import('@/views/OrderDetailView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('@/views/AdminOrdersView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/wines',
      name: 'admin-wines',
      component: () => import('@/views/Admin/WineAdmin.vue'),
      meta: { requiresAuth: true, adminOnly: true },
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

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.user) {
    return next('/login');
  }

  if (to.meta.adminOnly && !auth.user?.isAdmin) {
    return next('/');
  }

  next();
});

export default router
