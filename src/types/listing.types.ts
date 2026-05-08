import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Listing {
  id: string;
  title: string;
  category: string;
  area: string;
  postedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface FilterState {
  category: string;
  area: string;
}

export const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Real Estate'];
export const AREAS = ['All', 'Downtown', 'Uptown', 'Suburbs', 'Midtown', 'East Side', 'West End'];

export const PAGE_SIZE = 6;
