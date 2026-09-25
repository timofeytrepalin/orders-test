<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'text' | 'danger'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    class="ui-button"
    :class="[`ui-button_${variant}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ui-button {
  border: 0;
  border-radius: $radius-sm;
  padding: 13px 18px;
  font-weight: 750;
  transition: background 0.2s ease, transform 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &_primary {
    color: $color-surface-card;
    background: $color-brand-primary;

    &:hover:not(:disabled) {
      background: $color-brand-primary-hover;
    }
  }

  &_secondary {
    color: $color-text-primary;
    background: $color-surface-page;
  }

  &_danger {
    color: $color-surface-card;
    background: $color-feedback-danger;
  }

  &_text {
    padding: 0;
    color: $color-brand-primary;
    background: transparent;
    font-size: 14px;
  }
}
</style>
