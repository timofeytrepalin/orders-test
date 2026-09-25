import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { httpService } from '../services/httpService'
import type { AuthUser } from '../types/auth'

interface UserRecord extends AuthUser {
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const users = ref<UserRecord[]>([])
  let usersLoadPromise: Promise<void> | null = null

  async function login({ username, password }: { username: string; password: string }) { // авторизация на клиенте, тк mock-сервер не поддерживает авторизацию
    if (!users.value.length) {
      await loadUsers()
    }

    const record = users.value.find((item) => item.user === username && item.password === password)

    if (!record) {
      return false
    }

    user.value = {
      user: username,
      name: record.name,
      role: record.role,
    }

    return true
  }

  async function loadUsers() {
    if (usersLoadPromise) {
      return usersLoadPromise
    }

    usersLoadPromise = (async () => {
      isLoading.value = true
      try {
        const response = await httpService.get('/users')
        users.value = response.data || []
      } finally {
        isLoading.value = false
        usersLoadPromise = null
      }
    })()

    return usersLoadPromise
  }

  function logout() {
    user.value = null
  }

  const isAdmin = computed(() => {
    return user.value?.role === 'ADMIN'
  })

  return { user, isAuthenticated, isAdmin, login, logout, loadUsers }
})