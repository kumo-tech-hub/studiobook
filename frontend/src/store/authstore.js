import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      admin: null,
      setAdmin: (admin) => set({ isLoggedIn: true, admin }),
      logout: () => set({ isLoggedIn: false, admin: null }),
    }),
    { name: 'auth-storage' }
  )
)