import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

import Header from '../components/Header';
import { styles } from '../style/Styles';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="SignIn"
      screenOptions={({route}) => ({
        headerTitle: () => <Header />,
        headerStyle: styles.headerBar,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
        headerLeft: () => null,
      })}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
