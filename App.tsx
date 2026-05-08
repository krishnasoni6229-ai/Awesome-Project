import React from 'react';
import { StatusBar } from 'react-native';
import ListingsScreen from './src/screens/ListingsScreen';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <ListingsScreen />
    </>
  );
};

export default App;