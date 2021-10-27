import React from 'react';
import {View, Text} from 'react-native';

import {styles} from '../style/Styles';

/**
 * @returns header component that is displayed at the top of every screeen
 */
const Header = (): JSX.Element => {
  return (
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>PillX</Text>
    </View>
  );
};

export default Header;
