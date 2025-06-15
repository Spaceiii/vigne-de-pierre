<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { fetchUserOrders } from '@/services/orderService.ts'
import type { Order } from '@/types/order'

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'EUR'
  }).format(price / 100);
};

const getStatusLabel = (status: string) => {
  return t(`order.status.${status}`);
};

const viewOrderDetails = (orderId: number) => {
  router.push(`/order/${orderId}`);
};

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!authStore.user) {
      router.push('/login');
      return;
    }

    orders.value = await fetchUserOrders();
  } catch (err) {
    error.value = t('order.fetchError');
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="order-history-container">
    <h1>{{ t('order.history') }}</h1>

    <div v-if="loading" class="loading">
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchOrders">{{ t('common.retry') }}</button>
    </div>

    <div v-else-if="orders.length === 0" class="no-orders">
      <p>{{ t('order.noOrders') }}</p>
      <router-link to="/wine" class="shop-link">{{ t('order.shopNow') }}</router-link>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h3>{{ t('order.number', { id: order.id }) }}</h3>
            <p class="order-date">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="order-status" :class="order.status">
            {{ getStatusLabel(order.status) }}
          </div>
        </div>

        <div class="order-summary">
          <p>{{ t('order.totalItems', { count: order.items?.length || 0 }) }}</p>
          <p class="order-total">{{ formatPrice(order.totalPrice) }}</p>
        </div>

        <button
          class="view-details-btn"
          @click="viewOrderDetails(order.id!)"
        >
          {{ t('order.viewDetails') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: var(--primary-bg-start);
}

.loading, .error, .no-orders {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
}

.shop-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-bg-start);
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.order-info h3 {
  margin: 0;
  font-size: 1.2rem;
}

.order-date {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.order-status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.pending {
  background-color: #fff3cd;
  color: #856404;
}

.confirmed {
  background-color: #cce5ff;
  color: #004085;
}

.ready_for_pickup {
  background-color: #d4edda;
  color: #155724;
}

.delivered {
  background-color: #d1e7dd;
  color: #0f5132;
}

.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.order-total {
  font-weight: bold;
  color: var(--primary-bg-start);
}

.view-details-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--primary-bg-start);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.view-details-btn:hover {
  background-color: var(--primary-bg-end);
}

@media (max-width: 768px) {
  .orders-list {
    grid-template-columns: 1fr;
  }
}
</style>
