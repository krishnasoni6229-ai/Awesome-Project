import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {User} from '../types/user';
import UserCard from '../components/UserCard';
import theme from '../theme/theme.config';
import { wp, hp } from '../utils/responsive';

type UserListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserList'>;

const UserListScreen: React.FC = () => {
  const navigation = useNavigation<UserListScreenNavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Something went wrong. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const renderUser = useCallback(
    ({item}: {item: User}) => (
      <UserCard 
        user={item} 
        onPress={() => navigation.navigate('UserDetails', {userId: item.id})} 
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: User) => item.id.toString(), []);

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <Text style={styles.headerSubtitle}>
          {!loading && !error ? `${users.length} members found` : ''}
        </Text>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Fetching users...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: wp(7),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: theme.colors.primary,
    fontSize: wp(3.6),
    marginTop: 2,
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: wp(4),
    marginTop: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: wp(4),
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: wp(4),
  },
});

export default UserListScreen;
