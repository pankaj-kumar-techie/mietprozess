# Demo Data for MietProzess - Client Presentation

## 🎯 Purpose
This file contains realistic sample data to demonstrate MietProzess features to your client.

---

## 📋 Sample Apartments

### Apartment 1: In Kündigung (Fresh Termination)
```json
{
  "address": "Hauptstraße 45, 10115 Berlin",
  "objectName": "3 Zimmer, 2. OG, 85m²",
  "oldTenant": "Familie Schmidt",
  "terminationDate": "2026-03-31",
  "status": "In Kündigung",
  "responsible": "Sarah",
  "relettingOption": "Ja",
  "comments": [
    {
      "author": "Sarah",
      "text": "Kündigung heute eingegangen. Mieter möchte zum 31.03.2026 ausziehen.",
      "timestamp": "2026-01-08T10:30:00Z"
    },
    {
      "author": "Thomas",
      "text": "Besichtigungstermin für 15.01.2026 vereinbart.",
      "timestamp": "2026-01-08T14:15:00Z"
    }
  ],
  "checklist": [
    { "id": "1", "text": "Kündigungsbestätigung versenden", "completed": true },
    { "id": "2", "text": "Übergabeprotokoll vorbereiten", "completed": false },
    { "id": "3", "text": "Nachmieter suchen", "completed": false }
  ]
}
```

**Comments to Add:**
1. "Kündigung heute eingegangen. Mieter möchte zum 31.03.2026 ausziehen."
2. "Besichtigungstermin für 15.01.2026 vereinbart."
3. "Nachmieter bereits interessiert - Familie Müller aus Prenzlauer Berg."

---

### Apartment 2: Übergabe geplant (Handover Scheduled)
```json
{
  "address": "Berliner Straße 12, 10713 Berlin",
  "objectName": "2 Zimmer, EG, 55m²",
  "oldTenant": "Herr Müller",
  "terminationDate": "2026-01-31",
  "status": "Übergabe geplant",
  "responsible": "Thomas",
  "relettingOption": "Nein",
  "comments": [
    {
      "author": "Thomas",
      "text": "Übergabetermin: 31.01.2026 um 14:00 Uhr",
      "timestamp": "2026-01-05T09:00:00Z"
    },
    {
      "author": "Sarah",
      "text": "Schlüssel für Übergabe vorbereitet. Protokoll liegt bereit.",
      "timestamp": "2026-01-07T11:30:00Z"
    },
    {
      "author": "Thomas",
      "text": "Mieter hat Renovierung selbst durchgeführt - sieht gut aus!",
      "timestamp": "2026-01-08T08:45:00Z"
    }
  ],
  "checklist": [
    { "id": "1", "text": "Kündigungsbestätigung versenden", "completed": true },
    { "id": "2", "text": "Übergabeprotokoll vorbereiten", "completed": true },
    { "id": "3", "text": "Nachmieter suchen", "completed": true },
    { "id": "4", "text": "Übergabetermin vereinbaren", "completed": true },
    { "id": "5", "text": "Wohnung besichtigen", "completed": true }
  ]
}
```

**Comments to Add:**
1. "Übergabetermin: 31.01.2026 um 14:00 Uhr"
2. "Schlüssel für Übergabe vorbereitet. Protokoll liegt bereit."
3. "Mieter hat Renovierung selbst durchgeführt - sieht gut aus!"

---

### Apartment 3: Renovierung (Under Renovation)
```json
{
  "address": "Kastanienallee 78, 10435 Berlin",
  "objectName": "4 Zimmer, 3. OG, 110m²",
  "oldTenant": "WG Schneider/Weber/Klein",
  "terminationDate": "2025-12-31",
  "status": "Renovierung",
  "responsible": "Sarah",
  "relettingOption": "Ja",
  "comments": [
    {
      "author": "Sarah",
      "text": "Maler beginnt am 10.01.2026. Kostenvoranschlag: 3.500€",
      "timestamp": "2026-01-03T10:00:00Z"
    },
    {
      "author": "Thomas",
      "text": "Böden müssen komplett erneuert werden - starke Abnutzung.",
      "timestamp": "2026-01-04T15:20:00Z"
    },
    {
      "author": "Sarah",
      "text": "Handwerker-Termin für Boden: 20.01.2026",
      "timestamp": "2026-01-06T09:15:00Z"
    },
    {
      "author": "Thomas",
      "text": "Küche bleibt erhalten, nur Reinigung nötig.",
      "timestamp": "2026-01-07T13:45:00Z"
    }
  ],
  "checklist": [
    { "id": "1", "text": "Kündigungsbestätigung versenden", "completed": true },
    { "id": "2", "text": "Übergabeprotokoll vorbereiten", "completed": true },
    { "id": "3", "text": "Nachmieter suchen", "completed": false },
    { "id": "4", "text": "Übergabetermin vereinbaren", "completed": true },
    { "id": "5", "text": "Wohnung besichtigen", "completed": true },
    { "id": "6", "text": "Renovierungsarbeiten beauftragen", "completed": true },
    { "id": "7", "text": "Renovierung abschließen", "completed": false }
  ]
}
```

**Comments to Add:**
1. "Maler beginnt am 10.01.2026. Kostenvoranschlag: 3.500€"
2. "Böden müssen komplett erneuert werden - starke Abnutzung."
3. "Handwerker-Termin für Boden: 20.01.2026"
4. "Küche bleibt erhalten, nur Reinigung nötig."

---

### Apartment 4: Wiedervermietung (Ready for Re-letting)
```json
{
  "address": "Friedrichstraße 156, 10117 Berlin",
  "objectName": "1 Zimmer, 4. OG, 35m²",
  "oldTenant": "Frau Wagner",
  "terminationDate": "2025-11-30",
  "status": "Wiedervermietung",
  "responsible": "Thomas",
  "relettingOption": "Ja",
  "comments": [
    {
      "author": "Thomas",
      "text": "Wohnung ist bezugsfertig! Inserat online seit 05.01.2026",
      "timestamp": "2026-01-05T08:00:00Z"
    },
    {
      "author": "Sarah",
      "text": "15 Anfragen in 2 Tagen - sehr hohe Nachfrage!",
      "timestamp": "2026-01-07T10:30:00Z"
    },
    {
      "author": "Thomas",
      "text": "Besichtigungen geplant: 12.01, 13.01, 14.01 jeweils 17:00 Uhr",
      "timestamp": "2026-01-08T09:00:00Z"
    },
    {
      "author": "Sarah",
      "text": "Neue Miete: 850€ warm (vorher 780€)",
      "timestamp": "2026-01-08T11:15:00Z"
    }
  ],
  "checklist": [
    { "id": "1", "text": "Kündigungsbestätigung versenden", "completed": true },
    { "id": "2", "text": "Übergabeprotokoll vorbereiten", "completed": true },
    { "id": "3", "text": "Nachmieter suchen", "completed": true },
    { "id": "4", "text": "Übergabetermin vereinbaren", "completed": true },
    { "id": "5", "text": "Wohnung besichtigen", "completed": true },
    { "id": "6", "text": "Renovierungsarbeiten beauftragen", "completed": true },
    { "id": "7", "text": "Renovierung abschließen", "completed": true },
    { "id": "8", "text": "Inserat erstellen", "completed": true },
    { "id": "9", "text": "Besichtigungen durchführen", "completed": false }
  ]
}
```

**Comments to Add:**
1. "Wohnung ist bezugsfertig! Inserat online seit 05.01.2026"
2. "15 Anfragen in 2 Tagen - sehr hohe Nachfrage!"
3. "Besichtigungen geplant: 12.01, 13.01, 14.01 jeweils 17:00 Uhr"
4. "Neue Miete: 850€ warm (vorher 780€)"

---

### Apartment 5: Abgeschlossen (Completed)
```json
{
  "address": "Schönhauser Allee 89, 10439 Berlin",
  "objectName": "2.5 Zimmer, 1. OG, 68m²",
  "oldTenant": "Herr und Frau Becker",
  "terminationDate": "2025-10-31",
  "status": "Abgeschlossen",
  "responsible": "Sarah",
  "relettingOption": "Ja",
  "comments": [
    {
      "author": "Sarah",
      "text": "Neuer Mietvertrag unterschrieben mit Familie Hoffmann",
      "timestamp": "2025-12-15T14:00:00Z"
    },
    {
      "author": "Thomas",
      "text": "Einzug erfolgt am 01.01.2026 - alles reibungslos verlaufen",
      "timestamp": "2026-01-02T09:30:00Z"
    },
    {
      "author": "Sarah",
      "text": "Kaution eingegangen. Vorgang kann archiviert werden.",
      "timestamp": "2026-01-05T11:00:00Z"
    }
  ],
  "checklist": [
    { "id": "1", "text": "Kündigungsbestätigung versenden", "completed": true },
    { "id": "2", "text": "Übergabeprotokoll vorbereiten", "completed": true },
    { "id": "3", "text": "Nachmieter suchen", "completed": true },
    { "id": "4", "text": "Übergabetermin vereinbaren", "completed": true },
    { "id": "5", "text": "Wohnung besichtigen", "completed": true },
    { "id": "6", "text": "Renovierungsarbeiten beauftragen", "completed": true },
    { "id": "7", "text": "Renovierung abschließen", "completed": true },
    { "id": "8", "text": "Inserat erstellen", "completed": true },
    { "id": "9", "text": "Besichtigungen durchführen", "completed": true },
    { "id": "10", "text": "Mietvertrag erstellen", "completed": true },
    { "id": "11", "text": "Neuer Mieter eingezogen", "completed": true }
  ]
}
```

**Comments to Add:**
1. "Neuer Mietvertrag unterschrieben mit Familie Hoffmann"
2. "Einzug erfolgt am 01.01.2026 - alles reibungslos verlaufen"
3. "Kaution eingegangen. Vorgang kann archiviert werden."

---

### Apartment 6: In Kündigung (Complex Case)
```json
{
  "address": "Warschauer Straße 34, 10243 Berlin",
  "objectName": "3.5 Zimmer, EG, 95m²",
  "oldTenant": "Herr Zimmermann",
  "terminationDate": "2026-02-28",
  "status": "In Kündigung",
  "responsible": "Thomas",
  "relettingOption": "Nein",
  "comments": [
    {
      "author": "Thomas",
      "text": "Mieter hat Eigenbedarf angemeldet - kauft eigene Wohnung",
      "timestamp": "2025-12-20T10:00:00Z"
    },
    {
      "author": "Sarah",
      "text": "Wohnung hat Balkon und Garten - sehr attraktiv für Familien",
      "timestamp": "2026-01-03T14:20:00Z"
    },
    {
      "author": "Thomas",
      "text": "Mieter fragt nach vorzeitigem Auszug - prüfen ob möglich",
      "timestamp": "2026-01-07T16:45:00Z"
    }
  ],
  "checklist": [
    { "id": "1", "text": "Kündigungsbestätigung versenden", "completed": true },
    { "id": "2", "text": "Übergabeprotokoll vorbereiten", "completed": false },
    { "id": "3", "text": "Nachmieter suchen", "completed": false }
  ]
}
```

**Comments to Add:**
1. "Mieter hat Eigenbedarf angemeldet - kauft eigene Wohnung"
2. "Wohnung hat Balkon und Garten - sehr attraktiv für Familien"
3. "Mieter fragt nach vorzeitigem Auszug - prüfen ob möglich"

---

## 🎬 Demo Presentation Script

### Step 1: Show Dashboard Overview
"Hier sehen Sie alle laufenden Kündigungen auf einen Blick. Jede Spalte repräsentiert einen Status im Prozess."

### Step 2: Demonstrate Kanban Board
"Sie können Wohnungen einfach per Drag & Drop zwischen den Status verschieben. Der Fortschritt wird automatisch gespeichert."

### Step 3: Show Apartment Details
"Klicken Sie auf eine Wohnung, um alle Details zu sehen: Adresse, Mieter, Kündigungsdatum, und den aktuellen Bearbeitungsstand."

### Step 4: Demonstrate Checklist
"Die Checkliste zeigt alle notwendigen Schritte. Erledigte Aufgaben werden automatisch markiert und schalten die nächsten Schritte frei."

### Step 5: Show Comments Feature
"Das Team kann Notizen und Updates direkt in der Wohnung hinterlassen - perfekt für die Zusammenarbeit."

### Step 6: Excel Export
"Mit einem Klick können Sie alle Daten als Excel-Datei exportieren - ideal für Reports oder Archivierung."

### Step 7: Admin Panel (if admin)
"Im Admin-Bereich können Sie Benutzer verwalten und die Oberfläche ohne Programmierung anpassen."

---

## 📊 Key Selling Points

1. **Übersichtlich**: Kanban-Board zeigt sofort den Status aller Kündigungen
2. **Kollaborativ**: Team-Kommentare für bessere Kommunikation
3. **Strukturiert**: Automatische Checklisten führen durch den Prozess
4. **Flexibel**: Drag & Drop für schnelle Status-Updates
5. **Exportierbar**: Excel-Export für externe Nutzung
6. **Anpassbar**: No-Code Admin-Interface für Individualisierung
7. **Sicher**: Firebase-basierte Authentifizierung und Datenspeicherung
8. **Echtzeit**: Änderungen werden sofort für alle Nutzer sichtbar

---

## 💡 Demo Tips

- **Start with "In Kündigung"**: Show fresh cases to demonstrate the beginning of the process
- **Move to "Übergabe geplant"**: Show how drag & drop works
- **Open "Renovierung"**: Demonstrate comments and checklist features
- **Show "Wiedervermietung"**: Highlight the complete workflow
- **End with "Abgeschlossen"**: Show successful completion

**Time**: 10-15 minutes for full demo
**Focus**: Ease of use, team collaboration, process automation
