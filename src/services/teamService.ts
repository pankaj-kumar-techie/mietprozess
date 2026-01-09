import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TeamMember {
    id: string;
    email: string;
    displayName: string;
    role: 'admin' | 'user';
}

/**
 * Fetch all authorized users from Firestore to populate dropdowns
 * Returns user display names for assignment/responsibility selection
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
    if (!db) {
        // Fallback for development without Firebase
        return [
            { id: '1', email: 'sarah@example.com', displayName: 'Sarah', role: 'user' },
            { id: '2', email: 'max@example.com', displayName: 'Max', role: 'user' },
            { id: '3', email: 'anna@example.com', displayName: 'Anna', role: 'admin' }
        ];
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'authorized_users'));
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                displayName: data.displayName || data.email.split('@')[0],
                role: data.role || 'user'
            };
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        return [];
    }
};
