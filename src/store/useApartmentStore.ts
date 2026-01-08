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
    addApartment: (apartment: Omit<Apartment, 'id'>) => Promise<void>;
    updateApartment: (id: string, updates: Partial<Apartment>) => Promise<void>;
    deleteApartment: (id: string) => Promise<void>;
    setFilterResponsible: (responsible: string) => void;
    setSearchTerm: (term: string) => void;
}

export const useApartmentStore = create<ApartmentState>((set) => ({
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

    addApartment: async (apartment) => {
        try {
            const newAp = await apartmentService.createApartment(apartment);
            set(state => ({ apartments: [...state.apartments, newAp] }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    updateApartment: async (id, updates) => {
        try {
            const updatedAp = await apartmentService.updateApartment(id, updates);
            set(state => ({
                apartments: state.apartments.map(a => a.id === id ? updatedAp : a)
            }));
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    deleteApartment: async (id) => {
        try {
            await apartmentService.deleteApartment(id);
            set(state => ({
                apartments: state.apartments.filter(a => a.id !== id)
            }));
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    setFilterResponsible: (responsible) => set({ filterResponsible: responsible }),
    setSearchTerm: (term) => set({ searchTerm: term }),
}));
