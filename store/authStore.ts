import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) =>
        set({
          user: { ...userData, role: userData.role.toUpperCase() as User['role'] },
          isAuthenticated: true,
        }),
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'global-baniya-session=; Max-Age=0; path=/; SameSite=Lax';
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'global-baniya-auth',
    }
  )
);
