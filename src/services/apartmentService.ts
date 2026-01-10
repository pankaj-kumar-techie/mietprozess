
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Apartment } from "@/types";
import { getAuth } from 'firebase/auth';

const COLLECTION_NAME = 'apartments';
const ACTIVITY_LOGS_COLLECTION = 'activity_logs';

// Helper to log activities
const logActivity = async (
    type: 'create' | 'update' | 'delete' | 'comment' | 'status_change',
    message: string,
    details: string,
    apartmentId?: string,
    apartmentAddress?: string
) => {
    if (!db) return;
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        // Ensure NO undefined values are passed to Firestore
        const logData = {
            type,
            message,
            details,
            userName: user?.displayName || 'System',
            userEmail: user?.email || 'system@app.local',
            timestamp: new Date(),
            apartmentId: apartmentId || null,
            apartmentAddress: apartmentAddress || null
        };

        // Double check for any other undefined
        Object.keys(logData).forEach(key => (logData as any)[key] === undefined && delete (logData as any)[key]);

        await addDoc(collection(db, ACTIVITY_LOGS_COLLECTION), logData);
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

// Mock data for fallback when Firebase is not configured
const MOCK_DATA: Apartment[] = [
    {
        id: '1',
        address: 'Musterstraße 12, 80 Zurich',
        objectName: 'Whg 3.02',
        oldTenant: 'Hans Müller',
        terminationDate: '2024-03-31',
        status: 'In Kündigung',
        responsible: 'Sarah',
        relettingOption: 'Nein Nachmieter vorhanden',
        checklist: [],
        comments: [],
        lastActivity: new Date().toISOString()
    }
];

export const apartmentService = {
    getApartments: async (): Promise<Apartment[]> => {
        if (!db) {
            console.log("Using Mock Data (No Firebase Config)");
            return MOCK_DATA;
        }
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('lastActivity', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Apartment));
        } catch (error) {
            console.error("Error fetching apartments:", error);
            return [];
        }
    },

    // Real-time subscription for instant updates (no refresh needed!)
    subscribeToApartments: (callback: (apartments: Apartment[]) => void): (() => void) => {
        if (!db) {
            callback(MOCK_DATA);
            return () => { }; // No-op unsubscribe for mock
        }

        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('lastActivity', 'desc'));

            const unsubscribe = onSnapshot(q,
                (querySnapshot) => {
                    const apartments = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Apartment));
                    callback(apartments);
                },
                (error) => {
                    console.error("Error in real-time listener:", error);
                    callback([]);
                }
            );

            return unsubscribe;
        } catch (error) {
            console.error("Error setting up listener:", error);
            callback([]);
            return () => { };
        }
    },

    createApartment: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...apartment,
            lastActivity: new Date().toISOString()
        });

        await logActivity(
            'create',
            `Neue Kündigung: ${apartment.address}`,
            `Objekt: ${apartment.objectName}, Mieter: ${apartment.oldTenant}`,
            docRef.id,
            apartment.address
        );

        return { id: docRef.id, ...apartment } as Apartment;
    },

    updateApartment: async (id: string, updates: Partial<Apartment>): Promise<Apartment> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        const lastActivity = new Date().toISOString();
        const cleanUpdates = { ...updates };
        // Remove undefined fields if any to avoid Firestore errors
        Object.keys(cleanUpdates).forEach(key => (cleanUpdates as any)[key] === undefined && delete (cleanUpdates as any)[key]);

        await updateDoc(docRef, {
            ...cleanUpdates,
            lastActivity
        });

        // Determine activity type and message
        let type: 'update' | 'status_change' | 'comment' = 'update';
        let message = 'Änderungen gespeichert';
        let details = `Update ID: ${id}`;

        if (updates.status) {
            type = 'status_change';
            message = `Status geändert: ${updates.status}`;
            details = `Neuer Status für Objekt ${id}`;
        }

        // Log the activity
        // We explicitly pass undefined for address here because we don't have it handy
        // The logActivity function MUST convert this to null.
        await logActivity(
            type,
            message,
            details,
            id,
            undefined
        );

        return { id, ...updates, lastActivity } as any;
    },

    deleteApartment: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);

        // Ideally fetch data first to log detailed message
        try {
            // we could getDoc here but let's just log deletion
        } catch (e) { }

        await deleteDoc(docRef);

        await logActivity(
            'delete',
            'Datensatz gelöscht',
            `Kündigung/Objekt ${id} wurde entfernt`,
            id
        );
    }
};
