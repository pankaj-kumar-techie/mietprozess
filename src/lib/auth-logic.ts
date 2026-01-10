
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db, auth } from './firebase';
import type { UserProfile } from '@/store/useAuthStore';
import APP_CONFIG from '@/config/app.config';

const WHITELIST_COLLECTION = 'authorized_users';

/**
 * Checks if a user's email is present in the Firestore user collection.
 * Returns the user's document data if found.
 * Auto-creates first admin if email matches APP_CONFIG.features.firstAdminEmail.
 */
export const verifyWhitelist = async (email: string): Promise<UserProfile | null> => {
    if (!db) {
        console.warn('Firestore not initialized');
        return null;
    }

    try {
        // Check if user exists in authorized_users
        const userDoc = await getDoc(doc(db, WHITELIST_COLLECTION, email));

        if (userDoc.exists()) {
            const data = userDoc.data();
            return {
                email,
                name: data.displayName || email.split('@')[0],
                role: data.role || 'user',
                displayName: data.displayName || email.split('@')[0],
                createdAt: data.createdAt || new Date().toISOString()
            };
        }

        // First admin auto-creation
        if (email.toLowerCase() === APP_CONFIG.features.firstAdminEmail.toLowerCase()) {
            console.log('🎉 Creating first admin user:', email);
            const adminProfile: UserProfile = {
                email,
                name: 'Administrator',
                role: 'admin',
                displayName: 'Administrator',
                createdAt: new Date().toISOString()
            };

            // Create admin user in Firestore
            await setDoc(doc(db, WHITELIST_COLLECTION, email), {
                email: email.toLowerCase(),
                role: 'admin',
                displayName: 'Administrator',
                createdAt: new Date().toISOString()
            });

            return adminProfile;
        }

        return null;
    } catch (error) {
        console.error('Error verifying whitelist:', error);
        return null;
    }
};

/**
 * Ensures a user document exists in Firestore.
 */
export const autoCreateUser = async (email: string, displayName?: string): Promise<UserProfile> => {
    if (!db) throw new Error("Firestore not initialized");

    const existing = await verifyWhitelist(email);
    if (existing) return existing;

    const newProfile: UserProfile = {
        email: email.toLowerCase(),
        name: displayName || email.split('@')[0],
        role: 'user',
        displayName: displayName || email.split('@')[0],
        createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, WHITELIST_COLLECTION, email.toLowerCase()), {
        email: email.toLowerCase(),
        role: 'user',
        displayName: newProfile.displayName,
        createdAt: newProfile.createdAt
    });

    return newProfile;
};

/**
 * Production registration flow.
 */
export const registerWithFirebase = async (email: string, password: string): Promise<UserProfile> => {
    if (!auth || !db) throw new Error("Firebase ist nicht konfiguriert.");

    try {
        // 1. Create account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Create profile in Firestore
        return await autoCreateUser(user.email || email, user.displayName || undefined);
    } catch (error: any) {
        console.error("Firebase Registration failed:", error);
        if (error.code === 'auth/email-already-in-use') {
            throw new Error("Diese Email-Adresse wird bereits verwendet.");
        }
        if (error.code === 'auth/weak-password') {
            throw new Error("Das Passwort ist zu schwach (min. 6 Zeichen).");
        }
        throw new Error(error.message || "Registrierung fehlgeschlagen.");
    }
};

/**
 * Production login flow using Firebase Authentication.
 */
export const loginWithFirebase = async (email: string, password: string): Promise<UserProfile> => {
    if (!auth) {
        throw new Error("Firebase Auth ist nicht konfiguriert.");
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.email) {
            throw new Error("Keine Email-Adresse gefunden.");
        }

        return await autoCreateUser(user.email, user.displayName || undefined);
    } catch (error: any) {
        console.error("Firebase Login failed:", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error("Ungültige Email-Adresse oder Passwort.");
        }
        if (error.code === 'auth/too-many-requests') {
            throw new Error("Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.");
        }
        throw new Error(error.message || "Anmeldung fehlgeschlagen.");
    }
};

/**
 * Google Sign-In flow.
 */
export const signInWithGoogle = async (): Promise<UserProfile> => {
    if (!auth) throw new Error("Firebase Auth ist nicht konfiguriert.");

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (!user.email) throw new Error("Google Login fehlgeschlagen: Keine Email erhalten.");

        return await autoCreateUser(user.email, user.displayName || undefined);
    } catch (error: any) {
        console.error("Google Sign-In failed:", error);
        throw new Error(error.message || "Google Anmeldung fehlgeschlagen.");
    }
};

/**
 * Logout from Firebase
 */
export const logoutFromFirebase = async (): Promise<void> => {
    if (!auth) {
        console.warn("Firebase Auth ist nicht konfiguriert.");
        return;
    }

    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
        throw new Error("Abmeldung fehlgeschlagen.");
    }
};
