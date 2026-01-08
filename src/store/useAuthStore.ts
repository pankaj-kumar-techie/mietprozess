import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    user: { name: string; role: 'admin' | 'user' } | null;
    login: (name: string, role?: 'admin' | 'user') => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    login: (name: string, role: 'admin' | 'user' = 'user') => set({
        isAuthenticated: true,
        user: { name, role }
    }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));
