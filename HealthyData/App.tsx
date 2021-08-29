import React, { ReactElement } from 'react';
import RootNavigator from './navigation/RootNavigator';
import AuthProvider from './auth/provider';

const App = (): ReactElement => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
