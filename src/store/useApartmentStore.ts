
import { create } from 'zustand';
import type { Apartment } from '@/types';
import { apartmentService } from '@/services/apartmentService';

interface ApartmentState {
    apartments: Apartment[];
    loading: boolean;
    error: string | null;
    filterResponsible: string;
    searchTerm: string;
    pendingIds: Set<string>; // Track operations to fix Issue B (Flickering)

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
    pendingIds: new Set(),

    fetchApartments: async () => {
        set({ loading: true, error: null });
        try {
            const apartments = await apartmentService.getApartments();
            set({ apartments, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    subscribeToApartments: (callback) => {
        return apartmentService.subscribeToApartments((newApartments) => {
            const { pendingIds, apartments: currentApartments } = get();

            // FIX ISSUE B: Merge strategy to prevent flickering
            // If an ID is pending (optimistic update), we keep the local version
            // until the server version catches up or we stop being pending.
            const merged = newApartments.map(newAp => {
                if (pendingIds.has(newAp.id)) {
                    const local = currentApartments.find(a => a.id === newAp.id);
                    return local || newAp;
                }
                return newAp;
            });

            set({ apartments: merged, loading: false });
            callback(merged);
        });
    },

    addApartment: async (apartment) => {
        const tempId = 'temp-' + Date.now();
        try {
            const tempApartment = { id: tempId, ...apartment } as Apartment;
            set(state => ({
                apartments: [...state.apartments, tempApartment],
                pendingIds: new Set(state.pendingIds).add(tempId)
            }));

            const newAp = await apartmentService.createApartment(apartment);

            set(state => {
                const nextPending = new Set(state.pendingIds);
                nextPending.delete(tempId);
                return {
                    apartments: state.apartments.map(a => a.id === tempId ? newAp : a),
                    pendingIds: nextPending
                };
            });
        } catch (err: any) {
            set(state => {
                const nextPending = new Set(state.pendingIds);
                nextPending.delete(tempId);
                return {
                    apartments: state.apartments.filter(a => a.id !== tempId),
                    pendingIds: nextPending,
                    error: err.message
                };
            });
            throw err;
        }
    },

    updateApartment: async (id, updates) => {
        const originalApartments = get().apartments;
        try {
            // Optimistic update + Add to pending
            set(state => ({
                apartments: state.apartments.map(a =>
                    a.id === id ? { ...a, ...updates } : a
                ),
                pendingIds: new Set(state.pendingIds).add(id)
            }));

            await apartmentService.updateApartment(id, updates);

            // Remove from pending after short delay to allow Firestore to sync
            setTimeout(() => {
                set(state => {
                    const nextPending = new Set(state.pendingIds);
                    nextPending.delete(id);
                    return { pendingIds: nextPending };
                });
            }, 1000);

        } catch (err: any) {
            set({
                apartments: originalApartments,
                error: err.message
            });
            set(state => {
                const nextPending = new Set(state.pendingIds);
                nextPending.delete(id);
                return { pendingIds: nextPending };
            });
        }
    },

    deleteApartment: async (id) => {
        const originalApartments = get().apartments;
        try {
            set(state => ({
                apartments: state.apartments.filter(a => a.id !== id),
                pendingIds: new Set(state.pendingIds).add(id)
            }));

            await apartmentService.deleteApartment(id);

            set(state => {
                const nextPending = new Set(state.pendingIds);
                nextPending.delete(id);
                return { pendingIds: nextPending };
            });
        } catch (err: any) {
            set({
                apartments: originalApartments,
                error: err.message
            });
            set(state => {
                const nextPending = new Set(state.pendingIds);
                nextPending.delete(id);
                return { pendingIds: nextPending };
            });
        }
    },

    setFilterResponsible: (responsible) => set({ filterResponsible: responsible }),
    setSearchTerm: (term) => set({ searchTerm: term }),
}));
