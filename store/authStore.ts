// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: { phone: string } | null;
  setUser: (user: { phone: string } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));