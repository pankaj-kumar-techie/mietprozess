// Firestore Connection Optimization
// This file configures Firestore settings for better performance and stability

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getApp } from 'firebase/app';

/**
 * Initialize Firestore with optimized settings
 * - Enables offline persistence
 * - Supports multiple tabs
 * - Reduces unnecessary network requests
 */
export const initializeOptimizedFirestore = () => {
    try {
        const app = getApp();

        return initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });
    } catch (error) {
        console.warn('Firestore optimization failed, using default settings:', error);
        return null;
    }
};
