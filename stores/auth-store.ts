import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthStore extends AuthState {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,
      setHasHydrated: (hydrated: boolean) => {
        console.log('Auth hydration state:', hydrated);
        set({ hasHydrated: hydrated });
      },
      login: async (email: string, password: string) => {
        console.log('Login attempt for:', email);
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }
          const { user, token } = data;
          console.log('Login successful for user:', user.role);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw new Error(error.message || 'Login failed');
        }
      },
      register: async (userData: any) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.error || 'Registration failed');
        }
      },
      logout: () => {
        console.log('Logout called');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
        }
      },
      setToken: (token: string) => {
        set({ token });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrating...');
        if (state) {
          console.log('Auth state after rehydration:', {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            hasHydrated: state.hasHydrated
          });
          state.setHasHydrated(true);
        }
      },
    }
  )
); 