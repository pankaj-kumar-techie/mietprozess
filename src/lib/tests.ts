
import { isStatusComplete, shouldArchive, sortApartmentsByDate, getAutoNextStatus } from './logic';
import type { Apartment, ChecklistItem } from '@/types';

// Mock Data Generators
const createMockApartment = (overrides: Partial<Apartment> = {}): Apartment => ({
    id: 'test-1',
    address: 'Test Str 1',
    objectName: 'Obj 1',
    oldTenant: 'Tenant A',
    terminationDate: '2024-01-01',
    status: 'In Kündigung',
    responsible: 'Alice',
    relettingOption: 'Ja Weitervermietung',
    checklist: [],
    comments: [],
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: 'Tester',
    ...overrides
});

const createChecklist = (completed: boolean): ChecklistItem[] => [
    { type: 'header', text: 'In Kündigung' },
    { type: 'checkbox', text: 'Task 1', completed: completed },
    { type: 'checkbox', text: 'Task 2', completed: completed },
    { type: 'header', text: 'In Vermietung' }
];

// Test Suite
export interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

export const runBusinessLogicTests = (): TestResult[] => {
    const results: TestResult[] = [];

    // --- TEST 1: Forward Move Validation (Rule 1) ---
    try {
        const incompleteAp = createMockApartment({ checklist: createChecklist(false) });
        const canMove = isStatusComplete(incompleteAp, 'In Kündigung');
        results.push({
            name: 'Rule 1: Block Incomplete Status',
            passed: canMove === false,
            message: canMove ? 'Failed: Allowed move with incomplete checklist' : 'Passed: Blocked incomplete checklist'
        });

        const completeAp = createMockApartment({ checklist: createChecklist(true) });
        const canMove2 = isStatusComplete(completeAp, 'In Kündigung');
        results.push({
            name: 'Rule 1: Allow Complete Status',
            passed: canMove2 === true,
            message: canMove2 ? 'Passed: Allowed complete checklist' : 'Failed: Blocked complete checklist'
        });
    } catch (e: any) {
        results.push({ name: 'Rule 1 Validation', passed: false, message: 'Exception: ' + e.message });
    }

    // --- TEST 2: Automated Progression (Rule 2) ---
    try {
        // Case A: Complete 'In Kündigung' -> Should Suggest 'In Vermietung'
        const readyToAdvance = createMockApartment({
            status: 'In Kündigung',
            checklist: createChecklist(true)
        });
        const nextStatus = getAutoNextStatus(readyToAdvance);
        results.push({
            name: 'Rule 2: Auto-Advance Logic',
            passed: nextStatus === 'In Vermietung',
            message: nextStatus === 'In Vermietung'
                ? 'Passed: Correctly identified next status'
                : `Failed: Expected 'In Vermietung', got '${nextStatus}'`
        });

        // Case B: Incomplete -> Should stay null
        const stuck = createMockApartment({
            status: 'In Kündigung',
            checklist: createChecklist(false)
        });
        const nextStatusStuck = getAutoNextStatus(stuck);
        results.push({
            name: 'Rule 2: No Auto-Advance if Incomplete',
            passed: nextStatusStuck === null,
            message: nextStatusStuck === null
                ? 'Passed: Did not advance incomplete status'
                : `Failed: Advanced incorrectly to ${nextStatusStuck}`
        });

    } catch (e: any) {
        results.push({ name: 'Rule 2 Validation', passed: false, message: 'Exception: ' + e.message });
    }


    // --- TEST 3: Archiving Logic (Rule 3) ---
    try {
        const freshComplete = createMockApartment({
            status: 'Abgeschlossen',
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        });
        const staleComplete = createMockApartment({
            status: 'Abgeschlossen',
            completedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() // 35 days ago
        });

        // Legacy Test (No completedAt, only lastActivity)
        const legacyStale = createMockApartment({
            status: 'Abgeschlossen',
            lastActivity: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: undefined
        });

        const shouldHideFresh = shouldArchive(freshComplete);
        results.push({
            name: 'Rule 3: Keep Fresh Completions Visible',
            passed: shouldHideFresh === false,
            message: shouldHideFresh ? 'Failed: Archived a generic record too early' : 'Passed: Kept record visible (<30 days)'
        });

        const shouldHideStale = shouldArchive(staleComplete);
        results.push({
            name: 'Rule 3: Auto-Archive Old Completions',
            passed: shouldHideStale === true,
            message: shouldHideStale ? 'Passed: Archived old record (>30 days)' : 'Failed: Did not archive old record'
        });

        const shouldHideLegacy = shouldArchive(legacyStale);
        results.push({
            name: 'Rule 3: Auto-Archive Legacy Data',
            passed: shouldHideLegacy === true,
            message: shouldHideLegacy ? 'Passed: Archived legacy record using fallback date' : 'Failed: Legacy record not archived'
        });


    } catch (e: any) {
        results.push({ name: 'Rule 3 Validation', passed: false, message: 'Exception: ' + e.message });
    }

    // --- TEST 4: Sorting Logic (Rule 5) ---
    try {
        const ap1 = createMockApartment({ terminationDate: '2024-12-01' }); // Last
        const ap2 = createMockApartment({ terminationDate: '2024-01-01' }); // First
        const ap3 = createMockApartment({ terminationDate: '2024-06-01' }); // Middle

        const sorted = sortApartmentsByDate([ap1, ap2, ap3]);
        const passed = sorted[0].terminationDate === '2024-01-01' && sorted[2].terminationDate === '2024-12-01';

        results.push({
            name: 'Rule 5: Chronological Sorting',
            passed: passed,
            message: passed ? 'Passed: Dates sorted correctly' : 'Failed: Sorting order incorrect'
        });
    } catch (e: any) {
        results.push({ name: 'Rule 5 Validation', passed: false, message: 'Exception: ' + e.message });
    }

    return results;
};
