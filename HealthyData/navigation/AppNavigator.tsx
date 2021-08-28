import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../components/Home';
import Example from '../components/Example';
import Settings from '../components/Settings';

import {styles} from '../style/Styles';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const iconName = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'Settings':
        return focused ? 'settings' : 'settings-outline';
      case 'Home':
        return focused ? 'home' : 'home-outline';
      default:
        return 'restaurant-outline';
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <Ionicons
            name={iconName(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarStyle: styles.navigationBar,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarActiveBackgroundColor: '#00a18d',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Example" component={Example} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
