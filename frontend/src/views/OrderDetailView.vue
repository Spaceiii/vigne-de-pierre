<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getRequest } from '@/services/axios'
import { useAuthStore } from '@/stores/auth'
import type { Order } from '@/types/order'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Format date to a readable format
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format price in euros with currency symbol
const formatPrice = (price: number) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Get status label based on status code
const getStatusLabel = (status: string) => {
  return t(`order.status.${status}`)
}

// Fetch order details
const fetchOrderDetails = async () => {
  loading.value = true
  error.value = null

  try {
    // Check if user is authenticated
    if (!authStore.user) {
      router.push('/login')
      return
    }

    const orderId = route.params.id
    if (!orderId) {
      error.value = t('order.invalidId')
      loading.value = false
      return
    }

    const response = await getRequest(`/order/${orderId}`)

    if (response.error) {
      error.value = response.data
    } else {
      order.value = response.data
    }
  } catch (err) {
    error.value = t('order.fetchDetailError')
    console.error('Error fetching order details:', err)
  } finally {
    loading.value = false
  }
}

// Go back to order history
const goBack = () => {
  router.push('/orders')
}

onMounted(() => {
  fetchOrderDetails()
})
</script>

<template>
  <div class="order-detail-container">
    <button class="back-button" @click="goBack">
      &larr; {{ t('common.back') }}
    </button>

    <h1>{{ t('order.detail') }}</h1>

    <div v-if="loading" class="loading">
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchOrderDetails">{{ t('common.retry') }}</button>
    </div>

    <div v-else-if="!order" class="not-found">
      <p>{{ t('order.notFound') }}</p>
      <button @click="goBack">{{ t('order.backToHistory') }}</button>
    </div>

    <div v-else class="order-detail">
      <div class="order-header">
        <div class="order-info">
          <h2>{{ t('order.number', { id: order.id }) }}</h2>
          <p class="order-date">{{ formatDate(order.createdAt) }}</p>
        </div>
        <div class="order-status" :class="order.status">
          {{ getStatusLabel(order.status) }}
        </div>
      </div>

      <div class="order-section">
        <h3>{{ t('order.contactInfo') }}</h3>
        <div class="contact-info">
          <p><strong>{{ t('order.email') }}:</strong> {{ order.contactEmail }}</p>
          <p><strong>{{ t('order.phone') }}:</strong> {{ order.contactPhone }}</p>
        </div>
      </div>

      <div class="order-section">
        <h3>{{ t('order.pickupInfo') }}</h3>
        <p>{{ order.pickupInfo }}</p>
      </div>

      <div class="order-section">
        <h3>{{ t('order.items') }}</h3>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-slug">{{ item.wineSlug }}</p>
            </div>
            <div class="item-price">
              <p>{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
              <p class="item-total">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="order-total">
        <h3>{{ t('order.total') }}</h3>
        <p class="total-price">{{ formatPrice(order.totalPrice) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: var(--primary-bg-start);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
}

.back-button:hover {
  text-decoration: underline;
}

h1, h2, h3 {
  color: var(--primary-bg-start);
  margin-bottom: 1.5rem;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.order-info h2 {
  margin: 0;
  font-size: 1.5rem;
}

.order-date {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
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

.order-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.order-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.contact-info p {
  margin: 0.5rem 0;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.item-info h4 {
  margin: 0;
  font-size: 1.1rem;
}

.item-slug {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  color: #666;
}

.item-price {
  text-align: right;
}

.item-price p {
  margin: 0;
}

.item-total {
  font-weight: bold;
  color: var(--primary-bg-start);
  margin-top: 0.3rem !important;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid var(--primary-bg-start);
}

.order-total h3 {
  margin: 0;
}

.total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-bg-start);
  margin: 0;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
  }

  .order-status {
    margin-top: 1rem;
  }

  .order-item {
    flex-direction: column;
  }

  .item-price {
    text-align: left;
    margin-top: 0.5rem;
  }

  .order-total {
    flex-direction: column;
    align-items: flex-start;
  }

  .total-price {
    margin-top: 0.5rem;
  }
}
</style>
