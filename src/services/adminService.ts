
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_OPTIONS, type Status, type Apartment } from '@/types';

// QA Test Dataset emphasizing different stages and edge cases
export const QA_TEST_DATA: Partial<Apartment>[] = [
    // 1. FRESH CASE (In Kündigung) - "The Newbie"
    // Tests: Creation, Initial Fields, Red Status
    {
        address: "Seestrasse 145, 8002 Zürich",
        objectName: "3.5 Zimmer, 2. OG Links",
        oldTenant: "Michael Weber",
        terminationDate: "2024-06-30",
        status: "In Kündigung",
        responsible: "Pahariyatri", // Assuming current user
        relettingOption: "Nachmieter gesucht",
        lastActivity: new Date().toISOString(), // Green Traffic Light
        checklist: [], // Will be initialized by service logic
        comments: []
    },

    // 2. STUCK CASE (In Vermietung) - "The Problem Child"
    // Tests: Yellow/Red Traffic Light (Older date), Comments indicator
    {
        address: "Bahnhofstrasse 10, 8001 Zürich",
        objectName: "Gewerbe 120m2",
        oldTenant: "TechStart AG",
        terminationDate: "2024-05-31",
        status: "In Vermietung",
        responsible: "Sarah",
        relettingOption: "Regulär",
        // Late update (simulating 10 days ago -> Yellow light)
        lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        checklist: [],
        comments: [
            {
                text: "Keine Interessenten bisher. Preis evtl. zu hoch?",
                user: "Sarah",
                author: "Sarah",
                timestamp: new Date().toISOString()
            }
        ]
    },

    // 3. READY TO SIGN (Mietvertrag erstellt) - "The Success"
    // Tests: Forward movement logic, checklist completion
    {
        address: "Langstrasse 40, 8004 Zürich",
        objectName: "2.0 Zimmer Loft",
        oldTenant: "Lisa Mueller",
        terminationDate: "2024-04-30",
        status: "Mietvertrag erstellt",
        responsible: "Pahariyatri",
        relettingOption: "Nachmieter vorhanden",
        newTenant: "Felix Muster", // Tenant found!
        rentalStart: "2024-05-01",
        lastActivity: new Date().toISOString(),
        checklist: [],
        comments: []
    },

    // 4. OLD ARCHIVE (Abgeschlossen) - "The Ghost"
    // Tests: Archiving logic (Should be hidden unless filter active)
    {
        address: "Rigiweg 8, 8006 Zürich",
        objectName: "4.5 Zimmer Attika",
        oldTenant: "Familie Klein",
        terminationDate: "2023-12-31",
        status: "Abgeschlossen",
        responsible: "System",
        completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago -> Should be archived
        lastActivity: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        checklist: [],
        comments: []
    }
];

export const seedDatabase = async () => {
    if (!db) throw new Error("Database not initialized");

    const batch = writeBatch(db);
    const collectionRef = collection(db, 'apartments');

    console.log("Starting QA Data Seed...");

    for (const data of QA_TEST_DATA) {
        // We create a new doc ref for each
        const docRef = doc(collectionRef);

        // Basic checklist structure (light version for seed)
        const dummyChecklist = [
            { type: 'header', text: 'In Kündigung', completed: false },
            { type: 'checkbox', text: 'Kündigungsbestätigung verschickt', completed: data.status !== 'In Kündigung' }, // Mark done if advanced
            { type: 'header', text: 'In Vermietung', completed: false }
        ];

        const finalData = {
            ...data,
            id: docRef.id,
            checklist: data.checklist && data.checklist.length > 0 ? data.checklist : dummyChecklist,
            createdAt: new Date().toISOString(),
            createdBy: 'QA_SEEDER'
        };

        batch.set(docRef, finalData);
    }

    await batch.commit();
    console.log("✅ QA Data Seeded Successfully!");
};
