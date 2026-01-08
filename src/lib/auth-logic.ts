import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

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
 * Basic production login flow (Mocked until real Auth methods are enabled)
 */
export const attemptProductionLogin = async (email: string) => {
    const isAuthorized = await verifyWhitelist(email);
    if (!isAuthorized) {
        throw new Error("Zugriff verweigert: Email nicht auf der Whitelist.");
    }
    return { email, name: email.split('@')[0] };
};
