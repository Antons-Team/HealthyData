import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './components/Home';
import Example from './components/Example';

const Tab = createBottomTabNavigator();

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

const App = () => {
  return (
    <NavigationContainer>
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
          tabBarActiveTintColor: '#616FEC',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Example" component={Example} />
        <Tab.Screen name="Settings" component={Example} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
