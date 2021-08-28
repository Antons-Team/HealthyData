import React from 'react';
import RootNavigator from './navigation/RootNavigator';
import AuthProvider from './auth/provider';

const App = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
