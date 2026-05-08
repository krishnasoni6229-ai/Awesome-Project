import React, { memo } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import theme from '../theme/theme.config';
import { wp, hp } from '../utils/responsive';

interface FilterBarProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const FilterBar = memo(({ label, options, selected, onSelect }: FilterBarProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {options.map(opt => {
        const active = opt === selected;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
));

export default FilterBar;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: hp(1),
  },
  label: {
    fontSize: wp(2.8),
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: hp(0.5),
    marginLeft: wp(4),
  },
  scroll: {
    paddingHorizontal: wp(4),
    gap: wp(2),
  },
  chip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: wp(3.2),
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
