import React, {ReactElement} from 'react';
import RootNavigator from './navigation/RootNavigator';
import AuthProvider from './auth/provider';

// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();//Ignore all log notifications

const App = (): ReactElement => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
