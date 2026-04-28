import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types/user';
import theme from '../theme/theme.config';
import { wp, SCREEN_WIDTH } from '../utils/responsive';

interface Props {
  user: User;
  onPress?: () => void;
}

const UserCard: React.FC<Props> = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        <View style={styles.cityRow}>
          <Text style={styles.cityIcon}>📍</Text>
          <Text style={styles.city} numberOfLines={1}>
            {user.address.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarCircle: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(14) / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: wp(7),
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: wp(4.3),
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: theme.colors.textSecondary,
    fontSize: wp(3.5),
    marginBottom: 6,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityIcon: {
    fontSize: wp(3.5),
    marginRight: 4,
  },
  city: {
    color: theme.colors.primary,
    fontSize: wp(3.5),
    fontWeight: '600',
  },
});

export default React.memo(UserCard);
