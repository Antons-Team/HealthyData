import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthProvider from './auth/provider';
import RootNavigator from './navigation/RootNavigator';

type State = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: any;
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
