import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { httpService } from '../services/httpService';
import type { Order } from '../types/orders';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);
  const isLoading = ref(false);
  const ordersAreLoaded = computed(() => orders.value.length > 0);

  async function loadOrders() {
    isLoading.value = true;
    try {
        const response = await httpService.get('/events');
        orders.value = response.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function editOrder(orderId: number, updatedOrder: Partial<Order>) {
    const index = orders.value.findIndex(order => order.id === orderId);
    if (index !== -1) {
      await httpService.patch(`/events/${orderId}`, updatedOrder);
      orders.value[index] = { ...orders.value[index], ...updatedOrder };
    }
  }

  async function deleteOrder(orderId: number) {
    const index = orders.value.findIndex(order => order.id === orderId);
    if (index !== -1) {
      await httpService.delete(`/events/${orderId}`);
      await loadOrders();
    }
}

async function createOrder(newOrder: Omit<Order, 'id'>) {
    await httpService.post('/events', newOrder);
    await loadOrders();
  }

  return { orders, isLoading, ordersAreLoaded, loadOrders, editOrder, deleteOrder, createOrder }
})