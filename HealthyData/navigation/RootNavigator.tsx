import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useAuth} from '../auth/provider';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator = () => {
  const {state} = useAuth();
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {state.userToken == null ? (
        <Stack.Screen name="SignIn" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="App" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
