import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      admin: null,
      token: null,
      setAdmin: (admin, token) => set({ isLoggedIn: true, admin, token }),
      logout: () => set({ isLoggedIn: false, admin: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)