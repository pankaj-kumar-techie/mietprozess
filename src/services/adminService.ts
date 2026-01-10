import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type Apartment } from '@/types';

// QA Test Dataset emphasizing different stages and edge cases
export const QA_TEST_DATA: Partial<Apartment>[] = [
    // 1. FRESH CASE (In Kündigung) - BLACK Traffic Light (< 7 days)
    {
        address: "Seestrasse 145, 8002 Zürich",
        objectName: "3.5 Zimmer, 2. OG Links",
        oldTenant: "Michael Weber",
        terminationDate: "2024-06-30",
        status: "In Kündigung",
        responsible: "Pahariyatri",
        relettingOption: "Ja Weitervermietung",
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago -> BLACK
        checklist: [],
        comments: []
    },

    // 2. WARNING CASE (In Vermietung) - YELLOW Traffic Light (7-14 days)
    {
        address: "Bahnhofstrasse 10, 8001 Zürich",
        objectName: "Gewerbe 120m2",
        oldTenant: "TechStart AG",
        terminationDate: "2024-05-31",
        status: "In Vermietung",
        responsible: "Sarah",
        relettingOption: "Ja Weitervermietung",
        // Late update (simulating 10 days ago -> YELLOW light)
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

    // 3. CRITICAL CASE (In Prüfung) - RED Traffic Light (> 15 days)
    {
        address: "Langstrasse 40, 8004 Zürich",
        objectName: "2.0 Zimmer Loft",
        oldTenant: "Lisa Mueller",
        terminationDate: "2024-04-30",
        status: "In Vermietung",
        responsible: "Pahariyatri",
        relettingOption: "Nein Nachmieter vorhanden",
        // Critical inactivity (simulating 20 days ago -> RED light)
        lastActivity: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        checklist: [],
        comments: []
    },

    // 4. OLD ARCHIVE (Abgeschlossen) - ARCHIVED
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

    console.log("Starting QA Data Seed with Traffic Light test cases...");

    for (const data of QA_TEST_DATA) {
        const docRef = doc(collectionRef);

        // Extended checklist with Milestone IDs to fix Issue A
        const dummyChecklist = [
            { type: 'header', text: 'In Kündigung' },
            { type: 'checkbox', text: 'Kündigungsbestätigung verschickt', completed: true },
            { type: 'spacer' },
            { type: 'header', text: 'In Vermietung' },
            { type: 'checkbox', text: 'Inserat erstellen', completed: true },
            { id: 'contract_signed', type: 'checkbox', text: 'Mietvertrag unterzeichnet retour', completed: false }
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
    console.log("✅ QA Data Seeded Successfully with Traffic Light logic cases!");
};
