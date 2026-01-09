/**
 * Calculate how many days ago an apartment was created
 * Returns formatted string like "0d", "1d", "5d", etc.
 */
export const getDaysOld = (createdAt: string): string => {
    if (!createdAt) return '0d';

    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays}d`;
};

/**
 * Get color class based on age
 * Newer = green, older = red
 */
export const getAgeColor = (days: number): string => {
    if (days === 0) return 'text-green-600 bg-green-50';
    if (days <= 3) return 'text-blue-600 bg-blue-50';
    if (days <= 7) return 'text-yellow-600 bg-yellow-50';
    if (days <= 14) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
};
