import { defineStore } from 'pinia'
import type { CartEntry, CartItem } from '@/types/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
  }),
  actions: {
    addItem(item: CartEntry) {
      const existingItem = this.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }
      console.log(`Item added to cart: ${item.name} (ID: ${item.id})`);
      console.log(`Current cart items:`, this.items);
    },
    removeItem(id: string) {
      const index = this.items.findIndex(i => i.id === id);
      if (index !== -1) {
        this.items[index].quantity--;
        if (this.items[index].quantity <= 0) {
          this.items.splice(index, 1);
        }
      } else {
        console.warn(`Item with id ${id} not found in cart.`);
      }
    },
    toggleCart() { this.isOpen = !this.isOpen }
  }
});
