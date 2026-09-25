<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '460px',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

function closeDialog() {
  emit('update:modelValue', false)
}

function handleOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeDialog()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="props.modelValue"
        class="dialog"
        @click="handleOverlayClick"
      >
        <div
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="props.title ? 'dialog-title' : undefined"
          :style="{ maxWidth: props.width }"
        >
          <div
            v-if="props.title || $slots.header"
            class="dialog__header"
          >
            <slot name="header">
              <h2
                id="dialog-title"
                class="dialog__title"
              >
                {{ props.title }}
              </h2>
            </slot>
          </div>

          <div class="dialog__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-xl;
  background: $color-overlay-dialog;

  &__panel {
    width: min(100%, 460px);
    padding: $space-xl;
    border: 1px solid $color-border-subtle;
    border-radius: $radius-lg;
    background: $color-surface-card;
    box-shadow: 0 20px 40px $color-shadow-card;
  }

  &__header {
    margin-bottom: $space-lg;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.04em;
  }

  &__content {
    width: 100%;
  }
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
}
</style>
