# CoffeeArt Bremen

Erste prototypische Umsetzung des Pflichtenhefts für das Projekt CoffeeArt Bremen.

## Technologien

- Node.js
- Express.js
- EJS
- HTML/CSS/JavaScript
- JSON-Dateien als temporäre Datenquelle

## Installation

```bash
npm install
npm start
```

Danach öffnen:

```
http://localhost:3000
```

## Wichtige Seiten

| Route | Beschreibung |
|---|---|
| `/` | Startseite mit Hero, Produkt- und Blog-Vorschau |
| `/shop` | Produktübersicht mit Filtern |
| `/shop/:id` | Produktdetailseite |
| `/coffee-finder` | Coffee Finder mit 5 Fragen |
| `/blog` | Blog-Übersicht |
| `/blog/:id` | Blog-Artikel im Detail |
| `/login` | Login-Seite (Demo) |
| `/admin` | Admin Dashboard |

## API

| Methode | Route | Beschreibung |
|---|---|---|
| GET | `/api/products` | Alle Produkte als JSON |
| GET | `/api/products/:id` | Einzelnes Produkt als JSON |

**API-Antwort (gekürzt):**

```json
{
  "id": 1,
  "name": "Espresso Bremen",
  "kaffeesorte": "Espresso",
  "origin": "Brasilien",
  "weight": 500,
  "price": 12.99,
  "orderInfo": {
    "available": true,
    "stock": 42
  }
}
```

## Demo-Zugänge

| Rolle | Passwort |
|---|---|
| Kunde (Max Muster) | `demo123` |
| Mitarbeiter (Anna Beispiel) | `demo123` |
| Admin (Admin User) | `admin123` |

**Hinweis:** Dies sind ausschließlich Demo-Daten. Keine echten Passwörter.

## Datenstruktur

- `data/products.json` – 6 Produkte mit Kaffeesorte, Herkunft, Gewicht, Bestellinformationen, Bild
- `data/articles.json` – 3 Blog-Artikel
- `data/users.json` – 3 Benutzer mit Rollen (Kunde, Mitarbeiter, Admin)

## Offene Punkte

- finale API-Struktur
- finale Schriftart
- genaue Rollenstruktur
- vollständiger Checkout
- vollständiges Admin-System
- finale Texte und Bilder
- Coffee Finder mit ~15 Fragen
