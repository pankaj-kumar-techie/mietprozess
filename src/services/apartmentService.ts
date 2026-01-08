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

const COLLECTION_NAME = 'apartments';

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
        return { id, ...updates, lastActivity } as any;
    },

    deleteApartment: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};

