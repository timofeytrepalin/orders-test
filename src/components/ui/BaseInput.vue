<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: 'text' | 'password' | 'date' | 'email'
  placeholder?: string
  disabled?: boolean
  name?: string
  autocomplete?: string
  minlength?: number
  ariaInvalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  name: '',
  autocomplete: 'off',
  minlength: 0,
  ariaInvalid: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :name="props.name"
    :autocomplete="props.autocomplete"
    :minlength="props.minlength || undefined"
    :aria-invalid="props.ariaInvalid"
    class="base-input"
    @input="onInput"
  >
</template>

<style lang="scss" scoped>
.base-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid $color-border-subtle;
  border-radius: $radius-sm;
  background: $color-surface-input;
  color: $color-text-primary;
  font: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: 2px solid $color-brand-tint;
    border-color: $color-brand-primary;
  }
}
</style>
