import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Listing } from '../types/listing.types';
import theme from '../theme/theme.config';
import { wp, hp } from '../utils/responsive';

interface ListingCardProps {
  listing: Listing;
}

function formatDate(timestamp: Listing['postedAt']): string {
  try {
    return timestamp.toDate().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Electronics: '#6C63FF',
    Furniture: '#FF9F43',
    Clothing: '#48DBFB',
    Vehicles: '#FF6B6B',
    'Real Estate': '#1DD1A1',
  };
  return map[category] ?? '#A0A0C0';
}

const ListingCard = memo(({ listing }: ListingCardProps) => {
  const catColor = getCategoryColor(listing.category);

  return (
    <View style={styles.card}>
      <View style={[styles.categoryPill, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
        <Text style={[styles.categoryText, { color: catColor }]}>{listing.category}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {listing.title}
      </Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText}>{listing.area}</Text>
        </View>
        <View style={styles.metaDot} />
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>🕐</Text>
          <Text style={styles.metaText}>{formatDate(listing.postedAt)}</Text>
        </View>
      </View>
    </View>
  );
});

export default ListingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: wp(4),
    padding: wp(5),
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: wp(5),
    borderWidth: 1,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    marginBottom: hp(1),
  },
  categoryText: {
    fontSize: wp(2.8),
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: wp(4),
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: hp(1.5),
    lineHeight: wp(5.5),
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  metaIcon: {
    fontSize: wp(3),
  },
  metaText: {
    fontSize: wp(3.2),
    color: theme.colors.textSecondary,
  },
  metaDot: {
    width: wp(0.8),
    height: wp(0.8),
    borderRadius: wp(0.8),
    backgroundColor: theme.colors.border,
    marginHorizontal: wp(2),
  },
});
