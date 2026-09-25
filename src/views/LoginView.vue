<script setup lang="ts">
import { computed, ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const router = useRouter()
const authStore = useAuthStore()
const authError = ref('')

const form = reactive({
  username: '',
  password: ''
})

const isUsernameValid = computed(() => !!form.username.trim())
const isPasswordValid = computed(() => form.password.length >= 8)
const canSubmit = computed(() => isUsernameValid.value && isPasswordValid.value)

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'orders' })
  }

  authStore.loadUsers().catch(() => undefined)
})

async function submit() {
  authError.value = ''

  if (!canSubmit.value) {
    return
  }

  if (!await authStore.login(form)) {
    authError.value = 'Неверный логин/пароль'
    return
  }

  router.push({ name: 'orders' })
}
</script>

<template>
  <main class="auth">
    <section class="auth__card">
      <h1
        id="login-title"
        class="auth__title"
      >
        Вход в систему
      </h1>
      <p class="auth__description">
        Введите данные пользователя, чтобы продолжить работу.
      </p>

      <form
        class="auth__form"
        novalidate
        @submit.prevent="submit"
      >
        <label class="auth__field">
          <span>Имя пользователя</span>
          <BaseInput
            v-model="form.username"
            type="text"
            name="username"
            autocomplete="username"
            :aria-invalid="!!form.username && !isUsernameValid"
            placeholder="Введите логин"
          />
        </label>

        <label class="auth__field">
          <span>Пароль</span>
          <BaseInput
            v-model="form.password"
            type="password"
            name="password"
            autocomplete="current-password"
            :minlength="8"
            :aria-invalid="!!form.password && !isPasswordValid"
            placeholder="Введите пароль"
          />
        </label>

        <p
          v-if="authError"
          class="auth__error"
        >
          {{ authError }}
        </p>
        <BaseButton
          type="submit"
          :disabled="!canSubmit"
        >
          Войти
        </BaseButton>
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: $space-lg;
  background: $color-surface-page;
}

.auth {
  &__card {
    width: min(100%, $size-auth-card);
    padding: $space-2xl;
    background: $color-surface-card;
    border: 1px solid $color-border-subtle;
    border-radius: $radius-lg;
    box-shadow: 0 $space-lg 70px $color-shadow-card;
  }

  &__description {
    margin-bottom: $space-2xl;
    color: $color-text-secondary;
    line-height: 1.6;
  }

  &__form {
    display: grid;
    gap: $space-lg;
  }

  &__field {
    display: grid;
    gap: $space-sm;
    color: $color-text-primary;
    font-size: 13px;
    font-weight: 700;
  }

  &__error {
    margin: -4px 0 0;
    color: $color-feedback-danger;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .auth {
    &__card {
      padding: $space-xl $space-lg;
    }
  }
}
</style>