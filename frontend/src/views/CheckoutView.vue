<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { createOrder } from '@/services/orderService';
import { useMessageStore } from '@/stores/message';
import type { OrderFormData } from '@/types/order';

const { t } = useI18n();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const isLoggedIn = computed(() => !!authStore.user);

const isSubmitting = ref(false);
const formData = ref({
  pickupInfo: '',
  contactPhone: '',
});

const validationErrors = ref({
  pickupInfo: '',
  contactPhone: '',
});

const cartItems = computed(() => cartStore.items);
const totalPrice = computed(() => {
  return cartStore.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

const isFormValid = computed(() => {
  return !validationErrors.value.pickupInfo &&
         !validationErrors.value.contactPhone &&
         formData.value.pickupInfo &&
         formData.value.contactPhone;
});

onMounted(() => {
  if (cartItems.value.length === 0) {
    messageStore.createWarning(t('checkout.empty_cart'));
    router.push('/');
  }

  // Check for stored token on page load
  authStore.checkStoredToken();
});

// Watch for changes in authentication state
watch(() => authStore.user, (newUser) => {
  console.log('Auth state changed:', newUser);
  // If user just logged in and form is valid, submit the order
  if (newUser && isFormValid.value && !isSubmitting.value) {
    submitOrder();
  }
});


function validateForm() {
  // Reset validation errors
  validationErrors.value = {
    pickupInfo: '',
    contactPhone: '',
  };

  // Validate pickup information
  if (!formData.value.pickupInfo) {
    validationErrors.value.pickupInfo = t('checkout.validation.address_required');
  }

  // Validate phone
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!formData.value.contactPhone) {
    validationErrors.value.contactPhone = t('checkout.validation.phone_required');
  } else if (!phoneRegex.test(formData.value.contactPhone)) {
    validationErrors.value.contactPhone = t('checkout.validation.phone_invalid');
  }


  return isFormValid.value;
}

async function submitOrder() {
  if (!validateForm()) {
    return;
  }

  // Check if user is logged in
  if (!authStore.user) {
    messageStore.createWarning(t('checkout.login_prompt'));
    return;
  }

  isSubmitting.value = true;

  try {
    // Ensure we have the latest authentication state
    authStore.checkStoredToken();

    // Double-check that user is still logged in
    if (!authStore.user) {
      messageStore.createWarning(t('checkout.login_prompt'));
      isSubmitting.value = false;
      return;
    }

    console.log('Submitting order with user:', authStore.user);

    const orderData: OrderFormData = {
      ...formData.value,
      contactEmail: authStore.user.email,
      items: cartItems.value.map(item => ({
        wineSlug: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    console.log('Order data:', orderData);
    const order = await createOrder(orderData);
    console.log('Order created successfully:', order);

    // Clear cart after successful order
    cartStore.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        cartStore.removeItem(item.id);
      }
    });

    messageStore.createInfo(t('checkout.success'));
    router.push('/');
  } catch (error) {
    console.error('Error creating order:', error);
    // Display a more detailed error message if available
    const errorMessage = error instanceof Error ? error.message : String(error);
    messageStore.createError(`${t('checkout.error')} ${errorMessage}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="checkout-container">
    <h1>{{ t('checkout.title') }}</h1>

    <div class="checkout-content">
      <div class="order-summary">
        <h2>{{ t('checkout.order_summary') }}</h2>

        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>{{ t('cart.empty') }}</p>
        </div>

        <div v-else>
          <div v-for="item in cartItems" :key="item.id" class="order-item">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p>{{ t('checkout.quantity') }}: {{ item.quantity }}</p>
              <p>{{ t('checkout.price') }}: {{ item.price.toFixed(2) }} €</p>
            </div>
            <div class="item-total">
              {{ (item.price * item.quantity).toFixed(2) }} €
            </div>
          </div>

          <div class="order-total">
            <h3>{{ t('checkout.total') }}</h3>
            <p class="total-price">{{ totalPrice.toFixed(2) }} €</p>
          </div>
        </div>
      </div>

      <div class="checkout-form">
        <h2>{{ t('checkout.shipping_info') }}</h2>

        <div class="form-group">
          <label for="pickupInfo">{{ t('checkout.address') }}</label>
          <textarea
            id="pickupInfo"
            v-model="formData.pickupInfo"
            :placeholder="t('checkout.address_placeholder')"
            rows="3"
          ></textarea>
          <p v-if="validationErrors.pickupInfo" class="error-message">
            {{ validationErrors.pickupInfo }}
          </p>
        </div>

        <div class="form-group">
          <label for="contactPhone">{{ t('checkout.phone') }}</label>
          <input
            type="tel"
            id="contactPhone"
            v-model="formData.contactPhone"
            :placeholder="t('checkout.phone_placeholder')"
          />
          <p v-if="validationErrors.contactPhone" class="error-message">
            {{ validationErrors.contactPhone }}
          </p>
        </div>


        <div v-if="!isLoggedIn" class="login-prompt">
          <p>{{ t('checkout.login_prompt') }}</p>
          <router-link to="/login" class="login-button">
            {{ t('auth.login') }}
          </router-link>
        </div>

        <button
          class="submit-button"
          @click="submitOrder"
          :disabled="!isFormValid || isSubmitting"
        >
          {{ isSubmitting ? t('checkout.processing') : t('checkout.place_order') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.checkout-container h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.checkout-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.order-summary, .checkout-form {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-summary h2, .checkout-form h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  color: #333;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.item-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.item-details p {
  margin: 0.2rem 0;
  color: #666;
}

.item-total {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #ddd;
}

.order-total h3 {
  margin: 0;
}

.total-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #297e00;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #e74c3c;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #297e00;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #1e5f00;
}

.submit-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .checkout-content {
    flex-direction: column;
  }
}

.login-prompt {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #297e00;
  text-align: center;
}

.login-prompt p {
  margin-bottom: 0.8rem;
  color: #333;
}

.login-button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: #297e00;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #1e5f00;
}
</style>
