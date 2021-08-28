import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

type RootNavigatorProps = {
  signedIn: boolean;
};

const RootNavigator = ({signedIn}: RootNavigatorProps): JSX.Element => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!signedIn ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="App" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
