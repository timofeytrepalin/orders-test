export type UserRole = 'ADMIN' | 'USER'

export interface AuthUser {
  user: string
  name: string
  role: UserRole
}