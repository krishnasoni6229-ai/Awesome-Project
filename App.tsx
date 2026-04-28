import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListScreen from './src/screens/UserListScreen';
import UserDetailsScreen from './src/screens/UserDetailsScreen';
import { RootStackParamList } from './src/types/navigation';

import theme from './src/theme/theme.config';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="UserList"
            component={UserListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetailsScreen}
            options={{ title: 'User Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;