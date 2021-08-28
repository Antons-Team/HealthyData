import React from 'react';
import { View, Text } from 'react-native';

import {styles} from '../style/Styles';

// todo, make this a search bar component for the home screen
// and the PillX name everywhere else
const Header = (): JSX.Element => {
  return (
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>
            PillX
      </Text>
    </View>
  );
};

export default Header;