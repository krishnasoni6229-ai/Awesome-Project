import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Listing, FilterState, PAGE_SIZE } from '../types/listing.types';

const COLLECTION = 'listings';

function buildQuery(
  filter: FilterState,
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> {
  let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
    firestore().collection(COLLECTION);

  if (filter.category !== 'All') {
    query = query.where('category', '==', filter.category);
  }

  if (filter.area !== 'All') {
    query = query.where('area', '==', filter.area);
  }

  return query;
}

export async function fetchListingsPage(
  filter: FilterState,
  page: number,
): Promise<{
  listings: Listing[];
  hasMore: boolean;
}> {
  console.log('[DEBUG] Executing query for filter:', filter, 'page:', page);
  const snapshot = await buildQuery(filter).get();
  console.log('[DEBUG] Query returned docs count:', snapshot.docs.length);

  const allListings: Listing[] = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Listing, 'id'>),
    }))
    .sort((a, b) => {
      const aTime = (a.postedAt as any)?.seconds ?? 0;
      const bTime = (b.postedAt as any)?.seconds ?? 0;
      return bTime - aTime;
    });

  const start = page * PAGE_SIZE;
  const paginated = allListings.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < allListings.length;

  return { listings: paginated, hasMore };
}

export async function fetchListingCount(filter: FilterState): Promise<number> {
  try {
    console.log('[DEBUG] Executing count query for filter:', filter);
    const snapshot = await buildQuery(filter).count().get();
    console.log('[DEBUG] Count returned:', snapshot.data().count);
    return snapshot.data().count;
  } catch (err: any) {
    console.log('[DEBUG] Count query error:', err);
    return -1;
  }
}
