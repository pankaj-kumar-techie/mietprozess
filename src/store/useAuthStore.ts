import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    role: 'admin' | 'viewer';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (name: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (name: string) => set({
        user: { id: '1', name, role: 'admin' },
        isAuthenticated: true
    }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
