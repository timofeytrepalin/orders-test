<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useOrdersStore } from '../../../stores/orders'
import ActionButton from '../../ui/ActionButton.vue'
import ConfirmDialog from '../../ui/ConfirmDialog.vue'
import { parseDate } from '../../../utils/parse'
import type { Status } from '../../../types/orders'

interface OrderItem {
  id: number
  name: string
  address: string
  date: string
  status: string
  comment?: string
}

interface Props {
  items: OrderItem[]
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const showConfirmDialog = ref(false)
const selectedOrderId = ref<number | null>(null)
const sortKey = ref<'address' | 'date' | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const headers = [
  { text: '№', value: 'number' },
  { text: 'Имя клиента', value: 'clientName' },
  { text: 'Адрес', value: 'address' },
  { text: 'Дата заказа', value: 'date' },
  { text: 'Статус', value: 'status' },
  { text: 'Комментарий', value: 'comment' },
]

if (authStore.isAdmin) {
  headers.push({ text: '', value: 'actions' })
}

const sortedItems = computed(() => {
  return !sortKey.value ? props.items : [...props.items].sort((a, b) => {
    if (sortKey.value === 'address') {
      return stringSort(a.address, b.address)
    } else if (sortKey.value === 'date') {
      return dateSort(a.date, b.date)
    }
    return 0
  })
})

function toggleSort(key: 'address' | 'date') {
  if (sortKey.value !== key) {
    sortKey.value = key
    sortDirection.value = 'asc'
    return
  }

  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

function stringSort(a: string, b: string): number {
  return sortDirection.value === 'asc' ? a.localeCompare(b, 'ru', { sensitivity: 'base' }) : b.localeCompare(a, 'ru', { sensitivity: 'base' })
}

function dateSort(a: string, b: string): number {
  const dateA = parseDate(a)
  const dateB = parseDate(b)

  return sortDirection.value === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
}

function onDeleteButtonClick(orderId: number) {
  selectedOrderId.value = orderId
  showConfirmDialog.value = true
}

function deleteOrder() {
  if (selectedOrderId.value === null) {
    return
  }

  ordersStore.deleteOrder(selectedOrderId.value)
  selectedOrderId.value = null
  showConfirmDialog.value = false
}

function onCompleteOrderButtonClick(orderId: number) {
  ordersStore.editOrder(orderId, { status: 'Выполнен' as Status })
}
</script>

<template>
  <div class="orders-table">
    <table class="orders-table__table">
      <thead class="orders-table__header">
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            class="orders-table__cell-header"
            :class="{ 'orders-table__cell-header--sortable': header.value === 'address' || header.value === 'date' }"
            @click="header.value === 'address' || header.value === 'date' ? toggleSort(header.value) : null"
          >
            <span>{{ header.text }}</span>
            <span
              v-if="header.value === 'address' || header.value === 'date'"
              class="orders-table__sort-indicator"
            >
              {{ sortKey === header.value ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="orders-table__body">
        <tr
          v-for="order in sortedItems"
          :key="order.id"
          class="orders-table__row"
          :class="order.status === 'Выполнен' ? 'orders-table__row-completed' : ''"
        >
          <td class="orders-table__cell">
            {{ order.id }}
          </td>
          <td class="orders-table__cell">
            {{ order.name }}
          </td>
          <td class="orders-table__cell">
            {{ order.address }}
          </td>
          <td class="orders-table__cell">
            {{ order.date }}
          </td>
          <td class="orders-table__cell">
            {{ order.status }}
          </td>
          <td class="orders-table__cell">
            {{ order.comment }}
          </td>
          <td
            v-if="authStore.isAdmin"
            class="orders-table__cell-actions"
          >
            <ActionButton
              v-if="order.status !== 'Выполнен'"
              type="approve"
              @click="onCompleteOrderButtonClick(order.id)"
            >
              ✓
            </ActionButton>
            <ActionButton
              type="delete"
              aria-label="Удалить заказ"
              @click="onDeleteButtonClick(order.id)"
            >
              ✗
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Подтвердите удаление"
      message="Вы уверены, что хотите удалить этот заказ?"
      confirm-text="Удалить"
      cancel-text="Отмена"
      confirm-variant="danger"
      @confirm="deleteOrder"
    />
  </div>
</template>

<style lang="scss" scoped>
.orders-table {
  overflow-x: auto;
  border: 1px solid $color-border-subtle;
  border-radius: $radius-md;
  background: $color-surface-card;

  &__table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    table-layout: fixed;
    text-align: left;
  }

  &__header {
    background: $color-surface-page;
  }

  &__cell-header {
    padding: 14px 16px;
    color: $color-text-secondary;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: left;

    &--sortable {
      cursor: pointer;
      user-select: none;
    }
  }

  &__sort-indicator {
    display: inline-block;
    margin-left: $space-xs;
    font-size: 12px;
  }

  &__row {
    border-bottom: 1px solid $color-border-subtle;

    &-completed {
      background: $color-surface-success;
    }
  }

  &__cell {
    padding: 12px 16px;
    color: $color-text-primary;
    font-size: 14px;
    font-weight: 500;
    vertical-align: middle;
    border-bottom: 1px solid $color-border-subtle;
  }

  &__cell-actions {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: $space-sm;
    padding: 12px 16px;
  }

  @media (max-width: 768px) {
    &__table {
      min-width: 700px;
    }

    &__cell,
    &__cell-header {
      padding-right: 12px;
      padding-left: 12px;
    }
  }
}
</style>
