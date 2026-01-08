import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    user: { name: string; role: 'admin' | 'user' } | null;
    login: (name: string, role?: 'admin' | 'user') => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (name: string, role: 'admin' | 'user' = 'user') => set({
                isAuthenticated: true,
                user: { name, role }
            }),
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'mietprozess-auth',
        }
    )
);
