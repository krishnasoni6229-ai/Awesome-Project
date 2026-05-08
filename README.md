# Listings Feed

A single-screen React Native + Firestore listing feed.

---

## Features

| Requirement | Implementation |
|---|---|
| Cards: title, category, area, posted date | `ListingCard` — memo-wrapped, color-coded category pills |
| Filter by category AND area simultaneously | Two `FilterBar` rows, combined into one Firestore query |
| Sort by newest first | `orderBy('postedAtMs', 'desc')` on every query |
| Result count without fetching documents | Firestore `count()` aggregation — 1 server read, 0 documents transferred |
| Load 6 at a time + Load More | `limit(6)` + `startAfter(cursor)` cursor-based pagination |
| Filter change resets list | `useEffect` on `filter` clears state and cursor before fetching |
| Loading state | Full-screen spinner on first load, inline spinner on Load More |
| Empty results | Empty state with message and icon |

---

## Firestore Structure

**Collection:** `listings`

Each document:

```
title:      string       — "Used MacBook Pro 14""
category:   string       — "Electronics"
area:       string       — "Downtown"
postedAt:   Timestamp    — Firestore Timestamp (used for display)
postedAtMs: number       — Unix timestamp in ms (used for orderBy)
```

**Why two date fields?**

Firestore requires a composite index whenever you combine `where()` on one field with `orderBy()` on a different field. Composite indexes must be manually created in the Firebase Console and take time to build. To avoid this dependency entirely, `postedAtMs` is stored as a plain number. Firestore auto-creates single-field indexes for all fields, so `orderBy('postedAtMs', 'desc')` works immediately with any combination of `where()` filters — no manual index creation required.

`postedAt` (Timestamp) is still stored for display purposes only, formatted in the card UI.

---

## Why `getDocs` (not `onSnapshot`)

`getDocs` was chosen for three reasons:

**1. Pagination compatibility.**
`onSnapshot` with cursor-based pagination opens a persistent listener per page. Merging multiple real-time streams into a single ordered list requires complex state management and teardown logic. `getDocs` gives a clean, predictable result per call.

**2. Cost efficiency.**
A persistent `onSnapshot` listener bills a read every time any matching document changes. On a large collection with active writes, this compounds quickly. `getDocs` bills exactly one read per fetch — once for the page, once for the count.

**3. This is a feed, not a collaborative document.**
Listings data does not need sub-second real-time updates. Users pull down to refresh or tap Load More — both of which trigger `getDocs` on demand. `onSnapshot` would add complexity with no user-visible benefit here.

---

## How the Count Works Without Over-Fetching

```ts
const snapshot = await buildQuery(filter).count().get();
return snapshot.data().count;
```

`query.count()` is a Firestore server-side aggregation query. The server counts all matching documents and returns a single integer — no document data is transferred to the client. It costs 1 aggregation read regardless of how many documents match.

The count query uses the exact same `where()` constraints as the data query, so the number is always accurate for the current filter combination.

The first page fetch and the count are fired in parallel via `Promise.all`, so there is no waterfall delay.

---

## Seeding Data

The app includes a green **"Seed DB"** button in the header. Tap it once to write 40 sample listings directly from the app using the client SDK. The button disappears after seeding completes.

Before seeding, set Firestore rules to allow writes temporarily:

```js
match /{document=**} {
  allow read, write: if true;
}
```

After seeding, lock writes back down:

```js
match /listings/{listing} {
  allow read: if true;
  allow write: if false;
}
```

---

## Project Structure

```
src/
├── components/
│   ├── FilterBar.tsx           Horizontal chip selector
│   └── ListingCard.tsx         Card UI, memo-wrapped
├── screens/
│   └── ListingsScreen.tsx      Single screen — all state and logic
├── services/
│   └── firestore.service.ts    All Firestore queries
├── types/
│   └── listing.types.ts        Shared types and constants
├── utils/
│   └── seedData.ts             Client-side seed utility
└── theme/
    └── theme.config.ts         Design tokens
```
