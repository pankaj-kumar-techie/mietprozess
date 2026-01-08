import { create } from 'zustand';
import type { Apartment } from '@/types';
import { apartmentService } from '@/services/apartmentService';

interface ApartmentState {
    apartments: Apartment[];
    loading: boolean;
    error: string | null;
    filterResponsible: string;
    searchTerm: string;

    fetchApartments: () => Promise<void>;
    subscribeToApartments: (callback: (apartments: Apartment[]) => void) => () => void;
    addApartment: (apartment: Omit<Apartment, 'id'>) => Promise<void>;
    updateApartment: (id: string, updates: Partial<Apartment>) => Promise<void>;
    deleteApartment: (id: string) => Promise<void>;
    setFilterResponsible: (responsible: string) => void;
    setSearchTerm: (term: string) => void;
}

export const useApartmentStore = create<ApartmentState>((set, get) => ({
    apartments: [],
    loading: false,
    error: null,
    filterResponsible: 'Alle',
    searchTerm: '',

    fetchApartments: async () => {
        set({ loading: true, error: null });
        try {
            const apartments = await apartmentService.getApartments();
            set({ apartments, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    // Real-time subscription for instant updates
    subscribeToApartments: (callback) => {
        return apartmentService.subscribeToApartments((apartments) => {
            set({ apartments, loading: false });
            callback(apartments);
        });
    },

    addApartment: async (apartment) => {
        try {
            // Optimistic update
            const tempId = 'temp-' + Date.now();
            const tempApartment = { id: tempId, ...apartment } as Apartment;
            set(state => ({ apartments: [...state.apartments, tempApartment] }));

            // Real update
            const newAp = await apartmentService.createApartment(apartment);

            // Replace temp with real
            set(state => ({
                apartments: state.apartments.map(a => a.id === tempId ? newAp : a)
            }));
        } catch (err: any) {
            // Rollback on error
            set(state => ({
                apartments: state.apartments.filter(a => !a.id.startsWith('temp-')),
                error: err.message
            }));
            throw err;
        }
    },

    updateApartment: async (id, updates) => {
        try {
            // Optimistic update
            set(state => ({
                apartments: state.apartments.map(a =>
                    a.id === id ? { ...a, ...updates } : a
                )
            }));

            // Real update
            await apartmentService.updateApartment(id, updates);
        } catch (err: any) {
            // Rollback and refetch on error
            get().fetchApartments();
            set({ error: err.message });
        }
    },

    deleteApartment: async (id) => {
        try {
            // Optimistic delete
            set(state => ({
                apartments: state.apartments.filter(a => a.id !== id)
            }));

            // Real delete
            await apartmentService.deleteApartment(id);
        } catch (err: any) {
            // Rollback on error
            get().fetchApartments();
            set({ error: err.message });
        }
    },

    setFilterResponsible: (responsible) => set({ filterResponsible: responsible }),
    setSearchTerm: (term) => set({ searchTerm: term }),
}));

