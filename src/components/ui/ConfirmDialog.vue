<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import BaseButton from './BaseButton.vue'

interface Props {
  modelValue?: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: 'Подтвердите действие',
  message: 'Вы уверены?',
  confirmText: 'Подтвердить',
  cancelText: 'Отмена',
  confirmVariant: 'danger',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

function closeDialog() {
  emit('update:modelValue', false)
}

function handleConfirm() {
  emit('confirm')
  closeDialog()
}

function handleCancel() {
  emit('cancel')
  closeDialog()
}
</script>

<template>
  <BaseDialog
    :model-value="props.modelValue"
    :title="props.title"
    width="420px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="confirm-dialog__content">
      <p
        v-if="props.message"
        class="confirm-dialog__message"
      >
        {{ props.message }}
      </p>

      <div class="confirm-dialog__actions">
        <BaseButton
          variant="secondary"
          @click="handleCancel"
        >
          {{ props.cancelText }}
        </BaseButton>
        <BaseButton
          :variant="props.confirmVariant"
          @click="handleConfirm"
        >
          {{ props.confirmText }}
        </BaseButton>
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.confirm-dialog {
  &__content {
    display: grid;
    gap: $space-xl;
  }

  &__message {
    margin: 0;
    color: $color-text-secondary;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $space-md;
  }

}
</style>
