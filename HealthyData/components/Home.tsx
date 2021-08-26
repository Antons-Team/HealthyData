import React from 'react';
import {useState} from 'react';
import {
  Text,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

const Home = (): JSX.Element => {
  const [todo, setTodo] = useState('');
  const ref = firestore().collection('todos');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;
