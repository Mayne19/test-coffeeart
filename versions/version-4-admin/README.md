# Version 4 — Administration

Diese Version enthält die Änderungen für den Admin- und Mitarbeiterbereich.

## Inhalt

- Admin Dashboard
- Mitarbeiter Dashboard
- Produktverwaltung
- Artikelverwaltung
- Bestellverwaltung
- Login und Rollen
- Rollen: admin und employee
- Statusänderung für Bestellungen
- Produkt- und Artikelformulare

## Geänderte Dateien

- data/products.json
- data/users.json
- data/orders.json
- public/css/style.css
- routes/pages.js
- routes/products.js
- server.js
- views/admin.ejs
- views/layout.ejs
- views/product-detail.ejs
- views/admin-article-form.ejs
- views/admin-product-form.ejs
- views/mitarbeiter.ejs

## Änderungen

### Admin Dashboard

- Übersicht für Produkte, Artikel und Bestellungen verbessert.
- Produktverwaltung mit Bearbeiten- und Löschen-Aktionen ergänzt.
- Artikelverwaltung mit Bearbeiten- und Löschen-Aktionen ergänzt.
- Bestellungen werden übersichtlich angezeigt.

### Produktverwaltung

- Neues Formular zum Erstellen und Bearbeiten von Produkten.
- Produktdaten können über ein Formular gepflegt werden.
- Unterstützte Felder:
  - Name
  - Herkunft
  - Kurzbeschreibung / Slogan
  - Beschreibung
  - Preis
  - Bestand
  - Bilder
  - Kaffeesorte
  - Geschmack
  - Gewicht
  - Kaffeeprofil
  - Röstprofil
  - Zubereitungstipps

### Artikelverwaltung

- Neues Formular zum Erstellen und Bearbeiten von Blogartikeln.
- Artikeldaten können über ein Formular gepflegt werden.
- Unterstützte Felder:
  - Titel
  - Autor
  - Datum
  - Kategorie
  - Bild-URL
  - Inhalt
  - Kaffee-Informationen

### Mitarbeiter Dashboard

- Separater Bereich für Mitarbeiter ergänzt.
- Mitarbeiter können Bestellungen sehen.
- Mitarbeiter können den Status von Bestellungen ändern.
- Produktbestand wird angezeigt, aber nicht direkt bearbeitet.

### Rollen

Es gibt zwei Rollen:

- admin
- employee

Admin kann Produkte, Artikel und Bestellungen verwalten.

Employee kann Bestellungen sehen, den Status ändern und den Produktbestand einsehen.

### Bestellverwaltung

- Bestellungen werden mit Kundendaten angezeigt.
- Produkte werden mit Menge angezeigt.
- Beispiel:

```txt
2x Espresso Bremen
1x Havanna Morgen
```

- Statuswerte:
  - Neu
  - In Bearbeitung
  - Versandt
  - Abgeschlossen

## Vorgehen im offiziellen Repo

Vor dem Kopieren zuerst im offiziellen Repo aktualisieren:

```bash
git pull --rebase origin main
```

Danach die Dateien aus diesem Ordner in das offizielle Repo kopieren.

Dann im offiziellen Repo committen:

```bash
git add data/products.json data/users.json data/orders.json public/css/style.css routes/pages.js routes/products.js server.js views/admin.ejs views/layout.ejs views/product-detail.ejs views/admin-article-form.ejs views/admin-product-form.ejs views/mitarbeiter.ejs
git commit -m "Improve admin and employee management"
git push origin main
```

## Hinweis

Diese Version betrifft hauptsächlich den Admin- und Mitarbeiterbereich.  
Die Shop-, Blog- und Coffee-Finder-Seiten wurden in früheren Versionen bearbeitet.