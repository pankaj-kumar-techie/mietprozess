import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface CreateUserParams {
    email: string;
    password: string;
    displayName?: string;
    role: 'admin' | 'user';
}

/**
 * Admin function to create a new user in both Firebase Auth and Firestore
 * This creates a complete user account that can immediately log in
 */
export const createUserAccount = async (params: CreateUserParams): Promise<void> => {
    const { email, password, displayName, role } = params;

    if (!auth || !db) {
        throw new Error('Firebase not initialized');
    }

    try {
        // 1. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // 2. Create user document in Firestore authorized_users collection
        await addDoc(collection(db, 'authorized_users'), {
            email: email.toLowerCase(),
            displayName: displayName || email.split('@')[0],
            role: role,
            firebaseUid: firebaseUser.uid,
            createdAt: new Date().toISOString(),
            createdBy: auth.currentUser?.email || 'system'
        });

        // 3. Log activity
        await addDoc(collection(db, 'activity_log'), {
            timestamp: new Date().toISOString(),
            userId: auth.currentUser?.email || 'system',
            userName: auth.currentUser?.displayName || 'System',
            action: 'user_created',
            details: {
                newUserEmail: email,
                newUserRole: role
            }
        });

        console.log(`User ${email} created successfully in Auth and Firestore`);
    } catch (error: any) {
        console.error('Error creating user:', error);

        // Handle specific errors
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Diese E-Mail-Adresse wird bereits verwendet');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Passwort muss mindestens 6 Zeichen lang sein');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Ungültige E-Mail-Adresse');
        } else {
            throw new Error(`Fehler beim Erstellen des Benutzers: ${error.message}`);
        }
    }
};

/**
 * Log any activity to Firestore
 */
export const logActivity = async (action: string, details: any): Promise<void> => {
    if (!db || !auth.currentUser) return;

    try {
        await addDoc(collection(db, 'activity_log'), {
            timestamp: new Date().toISOString(),
            userId: auth.currentUser.email || 'unknown',
            userName: auth.currentUser.displayName || auth.currentUser.email || 'Unknown',
            action,
            details
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw - activity logging should not break the main flow
    }
};
