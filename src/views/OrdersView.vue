<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import OrdersHeader from '../components/app/orders/OrdersHeader.vue'
import OrdersTable from '../components/app/orders/OrdersTable.vue'
import AddOrderDialog from '../components/app/orders/AddOrderDialog.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import type { Order } from '../types/orders'
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()
const showAddOrderDialog = ref(false)

const orders = computed(() => ordersStore.orders)

onMounted(() => {
  ordersStore.loadOrders()
})

async function handleAddOrder(newOrder: Omit<Order, 'id'>) {
  await ordersStore.createOrder({
    ...newOrder
  })
}
</script>

<template>
  <main class="orders">
    <OrdersHeader />
    <section class="orders__content">
      <div class="orders__heading">
        <div>
          <p class="orders__eyebrow">
            Рабочая область
          </p>
          <h1>Все заказы</h1>
        </div>
        <BaseButton
          variant="primary"
          @click="showAddOrderDialog = true"
        >
          Добавить заказ
        </BaseButton>
      </div>
      <OrdersTable
        v-if="orders.length"
        :items="orders"
      />
      <div
        v-else
        class="orders__empty"
      >
        <span class="orders__empty-icon">+</span>
        <h2>Заказы появятся здесь</h2>
      </div>
      <AddOrderDialog
        v-model="showAddOrderDialog"
        @submit="handleAddOrder"
      />
    </section>
  </main>
</template>

<style lang="scss" scoped>
.orders {
  min-height: 100vh;
  background: $color-surface-page;
}

.orders {
  &__content {
    width: min(calc(100% - #{$space-lg * 2}), $size-content);
    margin: 0 auto;
    padding: $space-page 0;
  }

  &__eyebrow {
    margin: 0 0 10px;
    color: $color-brand-primary;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: $space-lg;
    margin-bottom: 28px;

    h1 {
      margin-bottom: 0;
    }
  }

  &__empty {
    padding: 80px $space-lg;
    border: 1px dashed $color-border-empty;
    border-radius: 14px;
    text-align: center;
    background: $color-surface-empty;

    p {
      margin-bottom: 0;
      color: $color-text-secondary;
    }
  }

  &__empty-icon {
    width: $size-icon;
    height: $size-icon;
    display: grid;
    place-items: center;
    margin: 0 auto 18px;
    border-radius: 50%;
    color: $color-brand-primary;
    background: $color-brand-tint;
    font-size: 26px;
  }
}

@media (max-width: 600px) {
  .orders {
    &__content {
      width: min(calc(100% - #{$space-md * 2}), $size-content);
      padding: 40px 0;
    }

    &__heading {
      align-items: start;
      flex-direction: column;
    }
  }
}
</style>