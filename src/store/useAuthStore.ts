import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
    name: string; // email or username
    email: string | null;
    displayName?: string | null;
    role?: 'admin' | 'user';
    createdAt?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    login: (userProfile: UserProfile) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (userProfile) => set({ isAuthenticated: true, user: userProfile }),
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
