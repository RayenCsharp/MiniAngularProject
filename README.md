# Souk El Khorda (سوق الخردة)

An online second-hand shop built as the mini-project for academic project
(ISET-Charguia, DSI 21, 2026-2027, supervised by Amel TRIKI).

Visitors browse items without an account and can send price offers. A single administrator
logs in to manage the items and decide on the offers received.

- **Live site:** [front-end URL]
- **API:** [server URL]
- **Author:** Rayen Hidri

## Features

### Front office (visitors)
- Item list with name, photo, category, price and availability
- Search by name and category (combinable or separate) and sorting (newest, price, name, deadline)
- Item detail page with every field and a countdown to the offer deadline
- Offer form with validation. Negotiable items accept offers below the price, fixed-price items only accept offers at or above it
- Static "About" page

### Back office (administrator)
- Login and change password
- Add, view, edit and delete items
- Offers table per item: accept or reject. Accepting an offer refuses the others and marks the item as sold; the buyer's contact details are shown only for the accepted offer
- Separate navigation menu for the admin area

## Tech stack

| Part | Technology |
| --- | --- |
| Front end | Angular 22 (signals, signal forms, nested routes), Tailwind CSS |
| Back end | Node.js, Express, TypeScript |
| Data | One JSON file (`server/data/db.json`), read and written with `fs` |

Technical points covered: signals, signal forms with validation, TypeScript interfaces
(`Article`, `Offre`, `Admin`), services, parent/child components (list and card),
custom pipe (`countdown`) plus Angular's `number` pipe, `[class]` binding, separate routes for
list and detail, nested routes (user layout and admin layout), different menus for visitor and
admin.

## Project structure

```
MiniProjet/
  src/app/
    components/
      user/        user-layout, article-list, article-detail, about, login
      admin/       admin-layout, article-list, article-form, article-edit, change-password
      shared/      article-card, error (404 page)
    models/        article, offre, admin
    services/      article-services, admin-services
    pipes/         countdown-pipe
  server/
    data/db.json
    src/           app.ts, server.ts, Routes, Controllers, services, Models
```

## Running the project locally

You need Node.js installed. Open two terminals.

**1. Start the server** (port 3000):

```bash
cd server
npm install
npm run dev
```

**2. Start the Angular app** (port 4200), from the project root:

```bash
npm install
ng serve
```

Open `http://localhost:4200/`.

Admin login: hidri@example.com / rayen2005

## API

| Method | Route | Description |
| --- | --- | --- |
| GET | `/articles?title=&category=` | List items, optionally filtered |
| GET | `/articles/:id` | One item |
| POST | `/articles` | Create an item |
| PUT | `/articles/:id` | Update an item (its offers are kept) |
| DELETE | `/articles/:id` | Delete an item |
| POST | `/articles/:id/offers` | Add an offer |
| PATCH | `/articles/:id/offers/:offerId` | Accept or refuse an offer |
| POST | `/admins/login` | Admin login |
| PATCH | `/admins/:id/password` | Change the admin password |

## Building

```bash
ng build              # Angular app
cd server && npm run build   # server, compiled to server/dist
```

## Known limitations

This is a school project, so some things are deliberately simple:
- The server has no token authentication. The admin pages are hidden in the Angular app, but the API routes are open
- Passwords are stored as plain text in `db.json`
- Data lives in a single JSON file. On a free host it can reset when the server restarts, so the committed `db.json` serves as the demo data
- Offers can be sent without an account, so the form only validates its fields

## Author

Rayen Hidri, DSI 21, ISET-Charguia, 2026-2027.