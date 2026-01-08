import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const WHITELIST_COLLECTION = 'authorized_users';

/**
 * Checks if a user's email is present in the Firestore whitelist.
 * This is used to restrict access to the dashboard during production.
 */
export const verifyWhitelist = async (email: string): Promise<boolean> => {
    if (!db) return true; // Fail-safe for mock mode

    try {
        const q = query(collection(db, WHITELIST_COLLECTION), where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Whitelist check failed:", error);
        return false;
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
