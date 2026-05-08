import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  RefreshControl,

} from 'react-native';


import theme from '../theme/theme.config';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import { fetchListingsPage, fetchListingCount } from '../services/firestore.service';
import { Listing, FilterState, CATEGORIES, AREAS } from '../types/listing.types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp, hp } from '../utils/responsive';

const ListingsScreen = () => {
  const [filter, setFilter] = useState<FilterState>({ category: 'All', area: 'All' });
  const [listings, setListings] = useState<Listing[]>([]);
  const [count, setCount] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef<number>(0);

  const loadFirstPage = useCallback(async (activeFilter: FilterState, isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true);
    }
    setError(null);
    pageRef.current = 0;

    try {
      const [pageResult, total] = await Promise.all([
        fetchListingsPage(activeFilter, 0),
        fetchListingCount(activeFilter),
      ]);

      setListings(pageResult.listings);
      setHasMore(pageResult.hasMore);
      setCount(total);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load listings. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const pageResult = await fetchListingsPage(filter, nextPage);
      setListings(prev => [...prev, ...pageResult.listings]);
      setHasMore(pageResult.hasMore);
      pageRef.current = nextPage;
    } catch {
    } finally {
      setIsLoadingMore(false);
    }
  }, [filter, isLoadingMore, hasMore]);

  useEffect(() => {
    setListings([]);
    setCount(-1);
    setHasMore(false);
    loadFirstPage(filter);

  }, [filter]);

  const handleCategoryChange = useCallback((category: string) => {
    setFilter(prev => ({ ...prev, category }));
  }, []);

  const handleAreaChange = useCallback((area: string) => {
    setFilter(prev => ({ ...prev, area }));
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFirstPage(filter, true);
  }, [filter, loadFirstPage]);


  const renderItem = useCallback(
    ({ item }: { item: Listing }) => <ListingCard listing={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Listing) => item.id, []);

  const ListHeader = (
    <View style={styles.listHeader}>
      <View style={styles.countRow}>
        {count >= 0 ? (
          <Text style={styles.countText}>
            <Text style={styles.countNumber}>{count}</Text>
            {count === 1 ? ' result' : ' results'}
          </Text>
        ) : (
          <View style={styles.countSkeleton} />
        )}
      </View>
    </View>
  );

  const ListFooter = (
    <View style={styles.footer}>
      {isLoadingMore ? (
        <ActivityIndicator color={theme.colors.primary} size="small" />
      ) : hasMore ? (
        <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} activeOpacity={0.8}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      ) : listings.length > 0 ? (
        <Text style={styles.endText}>· You've seen them all ·</Text>
      ) : null}
    </View>
  );

  const EmptyComponent = !isLoading ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No listings found</Text>
      <Text style={styles.emptySubtitle}>Try changing the category or area filter.</Text>
    </View>
  ) : null;

  console.log(listings,'shjs')
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Listings</Text>
          <Text style={styles.headerSub}>Find what you're looking for</Text>
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <FilterBar
          label="Category"
          options={CATEGORIES}
          selected={filter.category}
          onSelect={handleCategoryChange}
        />
        <FilterBar
          label="Area"
          options={AREAS}
          selected={filter.area}
          onSelect={handleAreaChange}
        />
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.centeredFill}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <Text style={styles.loadingText}>Loading listings…</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredFill}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => loadFirstPage(filter)}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={listings.length === 0 ? styles.emptyList : styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
              />
            }
            removeClippedSubviews
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListingsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
  },
  headerTitle: {
    fontSize: wp(7.5),
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: wp(3.5),
    color: theme.colors.textSecondary,
    marginTop: hp(0.3),
  },
  filtersWrapper: {
    paddingTop: hp(1),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: hp(1.5),
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: wp(3.5),
    color: theme.colors.textSecondary,
  },
  countNumber: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: wp(4),
  },
  countSkeleton: {
    width: wp(18),
    height: hp(1.7),
    borderRadius: wp(1.5),
    backgroundColor: theme.colors.surface,
  },
  list: {
    paddingBottom: hp(4),
  },
  emptyList: {
    flexGrow: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: hp(3),
  },
  loadMoreBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: wp(4),
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: wp(3.5),
    letterSpacing: 0.3,
  },
  endText: {
    color: theme.colors.textSecondary,
    fontSize: wp(3),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    paddingTop: hp(8),
  },
  emptyIcon: {
    fontSize: wp(12),
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: wp(3.5),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp(2.5),
  },
  centeredFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(1.5),
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: wp(3.5),
  },
  errorIcon: {
    fontSize: wp(10),
  },
  errorText: {
    color: theme.colors.error,
    fontSize: wp(3.5),
    textAlign: 'center',
    paddingHorizontal: wp(6),
  },
  retryBtn: {
    marginTop: hp(1),
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  retryText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: wp(3.5),
  },
});
