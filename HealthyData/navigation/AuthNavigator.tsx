import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from '../components/SignUp';
import Login from '../components/Login';
import SignInOptions from '../components/SignInOptions';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignInOptions">
      <Stack.Screen name="SignInOptions" component={SignInOptions} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
