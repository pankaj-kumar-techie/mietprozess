import { create } from 'zustand';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CONTENT } from '@/lib/content';

interface UISettingsState {
    settings: typeof CONTENT;
    isLoading: boolean;
    updateSetting: (path: string, value: string) => Promise<void>;
    resetToDefaults: () => Promise<void>;
    initialize: () => void;
}

export const DEFAULT_SETTINGS = {
    header: {
        title: 'HIT Flow',
        newTermination: 'Neue Kündigung erfassen',
        export: 'Daten Export',
        help: 'Hilfe',
        admin: 'Admin',
        logout: 'Abmelden'
    },
    login: {
        title: 'Willkommen bei HIT Flow',
        subtitle: 'Melden Sie sich an, um fortzufahren',
        emailPlaceholder: 'E-Mail-Adresse',
        passwordPlaceholder: 'Passwort',
        loginButton: 'Anmelden'
    }
};

export const useUISettings = create<UISettingsState>((set, get) => ({
    settings: CONTENT,
    isLoading: true,

    initialize: () => {
        if (!db) {
            set({ isLoading: false });
            return;
        }

        const docRef = doc(db, 'config', 'ui');
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                set({ settings: { ...CONTENT, ...docSnap.data() }, isLoading: false });
            } else {
                set({ settings: CONTENT, isLoading: false });
            }
        });
    },

    updateSetting: async (path, value) => {
        if (!db) return;

        const currentSettings = { ...get().settings };
        const keys = path.split('.');
        let current: any = currentSettings;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        const docRef = doc(db, 'config', 'ui');
        await setDoc(docRef, currentSettings, { merge: true });
    },

    resetToDefaults: async () => {
        if (!db) return;
        const docRef = doc(db, 'config', 'ui');
        await setDoc(docRef, CONTENT);
    }
}));
