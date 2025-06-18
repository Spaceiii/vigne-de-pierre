<template>
  <div class="admin-orders">
    <h1>{{ t('admin.ordersTitle') }}</h1>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info" @click="goToOrderDetail(order.id)">
            <h3>{{ t('order.number', { id: order.id }) }}</h3>
            <p class="order-date">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span :class="['order-status', order.status]">
            {{ t(`order.status.${order.status}`) }}
          </span>
        </div>

        <div class="order-summary">
          <div>{{ t('order.total') }}</div>
          <div class="order-total">{{ formatPrice(order.totalPrice) }}</div>
        </div>

        <select v-model="order.status" @change="updateStatus(order)" class="status-selector">
          <option value="pending">{{ t('order.status.pending') }}</option>
          <option value="confirmed">{{ t('order.status.confirmed') }}</option>
          <option value="ready_for_pickup">{{ t('order.status.ready_for_pickup') }}</option>
          <option value="delivered">{{ t('order.status.delivered') }}</option>
          <option value="cancelled">{{ t('order.status.cancelled') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchAllOrders, updateOrderStatus } from '@/services/orderService.ts';
import type { Order } from '@/types/order';
import router from '@/router'

const { t } = useI18n();
const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(date));
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency', currency: 'EUR'
  }).format(price);
};

const goToOrderDetail = (orderId: number) => {
  router.push(`/order/${orderId}`);
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    orders.value = await fetchAllOrders();
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (order: Order) => {
  try {
    await updateOrderStatus(order.id!, order.status);
  } catch (err: any) {
    alert(t('admin.updateFailed'));
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.admin-orders {
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
}
.loading,
.error {
  text-align: center;
  padding: 1rem;
  color: var(--primary-bg-start);
}
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}
.status-selector {
  margin-top: 0.5rem;
  padding: 0.4rem;
}
</style>

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
