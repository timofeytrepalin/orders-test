<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import BaseButton from '../../ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="orders-header">
    <RouterLink
      :to="{ name: 'orders' }"
      class="orders-header__brand"
    >
      Заказы
    </RouterLink>
    <div class="orders-header__user">
      <span>{{ authStore.user?.name }}</span>
      <BaseButton
        variant="text"
        @click="logout"
      >
        Выйти
      </BaseButton>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.orders-header {
  height: $size-header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 max($space-lg, calc((100vw - $size-content) / 2));
  border-bottom: 1px solid $color-border-subtle;
  background: $color-surface-card;

  &__brand,
  &__user {
    display: flex;
    align-items: center;
    gap: $space-md;
    font-weight: 750;
  }

  &__brand {
    color: $color-text-primary;
    text-decoration: none;
  }

  &__user {
    color: $color-text-secondary;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    height: auto;
    min-height: 68px;
    padding: $space-md 20px;

    &__user {
      flex-direction: column;
      align-items: end;
      gap: $space-xs;
    }
  }
}
</style>
