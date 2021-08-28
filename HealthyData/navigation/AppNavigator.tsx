/* eslint-disable react/display-name */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../components/Home';
import Medications from '../components/Medications';
import Calendar from '../components/Calendar';
import Settings from '../components/Settings';
import Header from '../components/Header';

import {styles} from '../style/Styles';

import {DARK, BLUE} from '../style/Colours';

const Tab = createBottomTabNavigator();

const AppNavigator = (): JSX.Element => {
  const iconName = (routeName: string, focused: boolean) => {
    switch (routeName) {
    case 'Settings':
      return focused ? 'settings' : 'settings-outline';
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Calendar':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Medications':
      return focused ? 'add' : 'add-outline';
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
      <Tab.Screen name="Medications" component={Medications} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Settings" component={Settings} /> 
    </Tab.Navigator>
  );
};

export default AppNavigator;