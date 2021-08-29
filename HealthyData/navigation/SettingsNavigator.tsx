/* eslint-disable react/display-name */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Header from '../components/Header';
import { styles } from '../style/Styles';
import { SettingsStackParamList } from '../@types/SettingsStackParamList';

import Settings from '../components/Settings';
import ProfileDetails from '../components/ProfileDetails';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator 
      initialRouteName="Settings"
      screenOptions={() => ({
        headerTitle: () => <Header />,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
