import React from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Example'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Example = (props: Props): JSX.Element => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Example Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => props.navigation.navigate('Home')}
      />
    </View>
  );
};

export default Example;
