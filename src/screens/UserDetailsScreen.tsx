import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { User } from '../types/user';
import theme from '../theme/theme.config';
import { wp } from '../utils/responsive';

type UserDetailsRouteProp = RouteProp<RootStackParamList, 'UserDetails'>;

const UserDetailsScreen: React.FC = () => {
  const route = useRoute<UserDetailsRouteProp>();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); 

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data: User = await response.json();
      setUser(data);
    } catch (err) {
      setError('Something went wrong. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer} edges={['left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Fetching details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.centeredContainer} edges={['left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserDetails}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.retryButton, { marginTop: 16, backgroundColor: theme.colors.border }]} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >

        <View style={styles.headerCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <InfoRow icon="✉️" label="Email" value={user.email} />
          <InfoRow icon="📞" label="Phone" value={user.phone} />
          <InfoRow icon="🌐" label="Website" value={user.website} />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Address</Text>
          <InfoRow
            icon="📍"
            label="Location"
            value={`${user.address.suite}, ${user.address.street}\n${user.address.city}, ${user.address.zipcode}`}
          />

          {user.address.geo && user.address.geo.lat && user.address.geo.lng && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(user.address.geo.lat),
                  longitude: parseFloat(user.address.geo.lng),
                  latitudeDelta: 10,
                  longitudeDelta: 10,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(user.address.geo.lat),
                    longitude: parseFloat(user.address.geo.lng),
                  }}
                  title={user.name}
                  description={`${user.address.street}, ${user.address.city}`}
                />
              </MapView>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Company</Text>
          <InfoRow icon="🏢" label="Name" value={user.company.name} />
          <InfoRow icon="✨" label="Catchphrase" value={`"${user.company.catchPhrase}"`} />
          <InfoRow icon="🎯" label="Business Strategy" value={user.company.bs} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarCircle: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(25) / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: wp(12),
    fontWeight: '800',
  },
  name: {
    color: theme.colors.text,
    fontSize: wp(6),
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    color: theme.colors.primary,
    fontSize: wp(4),
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: wp(3.5),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: wp(5),
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.textSecondary,
    fontSize: wp(3),
    marginBottom: 2,
  },
  infoValue: {
    color: theme.colors.text,
    fontSize: wp(4),
    fontWeight: '500',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  mapContainer: {
    height: wp(50),
    width: '100%',
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  map: {
    ...StyleSheet.absoluteFill as any,
  },
  mapDisclaimer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.sm,
  },
  mapDisclaimerText: {
    color: theme.colors.surface,
    fontSize: wp(3),
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: wp(4),
    marginTop: 12,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: wp(4),
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
  },
  retryText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: wp(4),
  },
});

export default UserDetailsScreen;
