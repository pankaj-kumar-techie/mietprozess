import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';

const WHITELIST_COLLECTION = 'authorized_users';

export interface UserProfile {
    email: string;
    role: 'admin' | 'user';
}

/**
 * Checks if a user's email is present in the Firestore whitelist.
 * Returns the user's document data if found.
 */
export const verifyWhitelist = async (email: string): Promise<UserProfile | null> => {
    if (!db) return { email, role: 'admin' }; // Fail-safe for mock mode

    try {
        const q = query(collection(db, WHITELIST_COLLECTION), where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            return {
                email: data.email || email,
                role: data.role || 'user'
            } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Whitelist check failed:", error);
        return null;
    }
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
        const profile: UserProfile = {
            email: user.email || email,
            role: 'user'
        };

        await addDoc(collection(db, WHITELIST_COLLECTION), profile);

        return profile;
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
        // Fallback for mock mode
        const profile = await verifyWhitelist(email);
        if (!profile) throw new Error("Mock-Login fehlgeschlagen.");
        return profile;
    }

    try {
        // 1. Authenticate with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Verify against Firestore Whitelist
        const profile = await verifyWhitelist(user.email || '');
        if (!profile) {
            await signOut(auth); // Sign out if not whitelisted
            throw new Error("Ihre Email ist nicht autorisiert. Bitte Administrator kontaktieren.");
        }

        return profile;
    } catch (error: any) {
        console.error("Firebase Login failed:", error);

        // Comprehensive error handling
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                throw new Error("Ungültige Email oder Passwort. Bitte überprüfen Sie Ihre Eingaben.");
            case 'auth/too-many-requests':
                throw new Error("Zu viele fehlgeschlagene Versuche. Bitte versuchen Sie es später erneut.");
            case 'auth/user-disabled':
                throw new Error("Dieses Konto wurde deaktiviert. Bitte kontaktieren Sie den Administrator.");
            case 'auth/configuration-not-found':
                throw new Error("Firebase Auth ist nicht konfiguriert. Bitte aktivieren Sie 'Email/Passwort' im Firebase Console.");
            case 'auth/network-request-failed':
                throw new Error("Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.");
            default:
                if (error.message && !error.code) {
                    throw error; // Re-throw custom errors (like whitelist check)
                }
                throw new Error("Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
        }
    }
};

/**
 * Production logout flow.
 */
export const logoutFromFirebase = async () => {
    if (auth) {
        await signOut(auth);
    }
};
