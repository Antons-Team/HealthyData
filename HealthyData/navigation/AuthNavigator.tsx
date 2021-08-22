import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import SignInOptions from '../components/SignInOptions';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignInOptions">
      <Stack.Screen name="SignInOptions" component={SignInOptions} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
