<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Status } from '../../../types/orders'
import BaseDialog from '../../ui/BaseDialog.vue'
import BaseInput from '../../ui/BaseInput.vue'
import BaseButton from '../../ui/BaseButton.vue'
import { useAuthStore } from '../../../stores/auth'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const authStore = useAuthStore()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', value: {
    name: string
    address: string
    date: string
    status: Status
    comment?: string
  }): void
}>()

const form = reactive({
  name: authStore.user?.name || '',
  address: '',
  comment: '',
})

const isValid = computed(() => form.name.trim() && form.address.trim())

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      resetForm()
    }
  },
)

function resetForm() {
  form.name = authStore.user?.name || ''
  form.address = ''
  form.comment = ''
}

function closeDialog() {
  emit('update:modelValue', false)
}

function onSubmitClick() {
  if (!isValid.value) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    address: form.address.trim(),
    date: new Date().toLocaleDateString('ru-RU'),
    status: 'Новый' as Status,
    comment: form.comment.trim() || undefined,
  })

  closeDialog()
}
</script>

<template>
  <BaseDialog
    :model-value="props.modelValue"
    title="Новый заказ"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <form
      class="add-order-dialog__form"
      @submit.prevent="onSubmitClick"
    >
      <label class="add-order-dialog__field">
        <span>Имя клиента</span>
        <BaseInput
          v-model="form.name"
          placeholder="Введите имя"
        />
      </label>

      <label class="add-order-dialog__field">
        <span>Адрес</span>
        <BaseInput
          v-model="form.address"
          placeholder="Введите адрес"
        />
      </label>

      <label class="add-order-dialog__field">
        <span>Комментарий</span>
        <textarea
          v-model="form.comment"
          rows="3"
          placeholder="Комментарий"
          class="add-order-dialog__textarea"
        />
      </label>

      <div class="add-order-dialog__actions">
        <BaseButton
          variant="secondary"
          @click="closeDialog"
        >
          Отмена
        </BaseButton>
        <BaseButton
          type="submit"
          :disabled="!isValid"
        >
          Добавить
        </BaseButton>
      </div>
    </form>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.add-order-dialog {
  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
    color: $color-text-primary;
    font-size: 14px;
    font-weight: 600;
  }

  &__textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid $color-border-subtle;
    border-radius: $radius-sm;
    background: $color-surface-input;
    color: $color-text-primary;
    font: inherit;
    resize: vertical;

    &:focus {
      outline: 2px solid $color-brand-tint;
      border-color: $color-brand-primary;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $space-md;
    margin-top: $space-md;
  }
}
</style>
