import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';

import {styles} from '../style/Styles';
import {LIGHT} from '../style/Colours';

const Loading = () => {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>PillX</Text>
      <ActivityIndicator size="large" color={LIGHT} />
    </View>
  );
};

export default Loading;
