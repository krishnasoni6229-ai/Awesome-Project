# Listings Feed

A React Native + Firestore listing feed — single screen, paginated, filterable.

## Features

- Filter by **category** and **area** simultaneously
- Sort by **newest first** (`orderBy('postedAtMs', 'desc')`)
- **Server-side count** via Firestore `count()` — no over-fetching
- **Cursor-based pagination** — 6 items per page, Load More
- Full-screen spinner on first load · inline spinner on Load More · empty state

## Firestore Structure

**Collection:** `listings`

| Field | Type | Purpose |
|---|---|---|
| `title` | string | Display |
| `category` | string | Filter |
| `area` | string | Filter |
| `postedAt` | Timestamp | Display (formatted in card) |
| `postedAtMs` | number | `orderBy` — avoids composite index requirement |

> `postedAtMs` is stored as a plain number so `orderBy` works with any `where()` combination without manually creating composite indexes in Firebase Console.

## Key Decisions

- **`getDocs` not `onSnapshot`** — pagination + cost efficiency. Listings don't need real-time updates.
- **`count()` aggregation** — returns a single integer server-side; no documents transferred.
- **Parallel fetch** — first page and count fire via `Promise.all`, no waterfall.

## Seeding Data

Tap the green **Seed DB** button in the header once to write 40 sample listings. Temporarily allow writes in Firestore rules, then lock them back down.

## Project Structure

```
src/
├── components/     FilterBar.tsx · ListingCard.tsx
├── screens/        ListingsScreen.tsx
├── services/       firestore.service.ts
├── types/          listing.types.ts
├── utils/          seedData.ts
└── theme/          theme.config.ts
```
