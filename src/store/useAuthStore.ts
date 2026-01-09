import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    name: string; // email or username
    email: string;
    displayName?: string; // Full name
    role: 'admin' | 'user';
}

interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    login: (email: string, role?: 'admin' | 'user', displayName?: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (email: string, role: 'admin' | 'user' = 'user', displayName?: string) => set({
                isAuthenticated: true,
                user: {
                    name: email,
                    email,
                    displayName: displayName || email.split('@')[0],
                    role
                }
            }),
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'mietprozess-auth',
        }
    )
);
