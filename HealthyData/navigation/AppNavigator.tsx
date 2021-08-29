/* eslint-disable react/display-name */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../components/Home';
import Calendar from '../components/Calendar';
import Header from '../components/Header';

import {styles} from '../style/Styles';

import {DARK, BLUE} from '../style/Colours';
import MedicationsNavigator from './MedicationsNavigator';
import { RootStackParamList } from '../@types/RootStackParams';
import SettingsNavigator from './SettingsNavigator';
import Data from '../components/Data';

const Tab = createBottomTabNavigator<RootStackParamList>();

const AppNavigator = (): JSX.Element => {
  const iconName = (routeName: string, focused: boolean) => {
    switch (routeName) {
    case 'SettingsNavigator':
      return focused ? 'settings' : 'settings-outline';
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Calendar':
      return focused ? 'calendar' : 'calendar-outline';
    case 'MedicationsNavigator':
      return focused ? 'add' : 'add-outline';
    case 'Data':
      return focused ? 'analytics' : 'analytics-outline';
    default:
      return ''; // this should never happen but error if we don't
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}:
            {
              focused: boolean,
              color: string,
              size: number,
            }
        ) => (
          <Ionicons
            name={iconName(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarStyle: styles.navigationBar,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: DARK,
        tabBarShowLabel: false, // remove the name from the navigation so just shows an icon
        headerStyle: styles.headerBar,
        headerTitle: () => <Header />,  
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen 
        name="MedicationsNavigator" 
        component={MedicationsNavigator} 
        options={{headerShown: false}}
      />
      <Tab.Screen name="Data" component={Data} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen 
        name="SettingsNavigator" 
        component={SettingsNavigator} 
        options={{headerShown: false}}
      /> 
    </Tab.Navigator>
  );
};

export default AppNavigator;