<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useI18n } from 'vue-i18n';

const cartStore = useCartStore();
const { t } = useI18n();

const totalPrice = computed(() => {
  return cartStore.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

const updateQuantity = (id: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeItem(id);
    return;
  }

  const item = cartStore.items.find(item => item.id === id);
  if (item) {
    const diff = newQuantity - item.quantity;
    for (let i = 0; i < Math.abs(diff); i++) {
      if (diff > 0) {
        cartStore.addItem({ id, name: item.name, price: item.price });
      } else {
        cartStore.removeItem(id);
      }
    }
  }
};

const removeItem = (id: string) => {
  const item = cartStore.items.find(item => item.id === id);
  if (item) {
    for (let i = 0; i < item.quantity; i++) {
      cartStore.removeItem(id);
    }
  }
};

const closeCart = () => {
  cartStore.isOpen = false;
};
</script>

<template>
  <div class="cart-drawer">
    <div class="cart-header">
      <h2>{{ t('cart.title') }}</h2>
      <button class="close-button" @click="closeCart">×</button>
    </div>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>{{ t('cart.empty') }}</p>
    </div>

    <div v-else class="cart-items">
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p class="item-price">{{ item.price.toFixed(2) }} €</p>
        </div>

        <div class="item-actions">
          <div class="quantity-controls">
            <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>

          <button class="remove-button" @click="removeItem(item.id)">
            {{ t('cart.remove') }}
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <p class="estimated-total">
          <span>{{ t('cart.estimated_total') }}:</span>
          <span class="total-price">{{ totalPrice.toFixed(2) }} €</span>
        </p>
        <router-link to="/checkout">
          <button class="checkout-button" @click="closeCart">{{ t('cart.checkout') }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 350px;
  height: calc(100% - var(--navbar-height));
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #666;
}

.empty-cart {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-style: italic;
}

.cart-items {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.item-details h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.item-price {
  margin: 0;
  color: #666;
  font-weight: bold;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-controls span {
  margin: 0 10px;
  font-weight: bold;
}

.remove-button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.cart-summary {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.estimated-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.total-price {
  font-weight: bold;
}

.checkout-button {
  width: 100%;
  padding: 12px;
  background-color: #297e00;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-button:hover {
  background-color: #1e5f00;
}
</style>
