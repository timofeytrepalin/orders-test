<script setup lang="ts">
interface Props {
  type?: 'approve' | 'delete'
  label?: string
}

withDefaults(defineProps<Props>(), {
  type: 'approve',
  label: '✓',
})
</script>

<template>
  <button
    class="action-button"
    :class="[`action-button_${type}`]"
    type="button"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.action-button {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transition: opacity 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }

  &_approve {
    color: $color-surface-card;
    background: $color-brand-primary;
    border-color: $color-brand-primary;
  }

  &_delete {
    color: $color-surface-card;
    background: $color-feedback-danger;
    border-color: $color-feedback-danger;
  }
}
</style>
