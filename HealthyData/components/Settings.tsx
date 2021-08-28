import React from 'react';
import {View, Button} from 'react-native';
import {signOut} from '../services/auth';

import {BLUE} from '../style/Colours';
import { styles } from '../style/Styles';

const Settings = () => {
  return (
    <View style={styles.settingsContainer}>
      <Button 
        title="Sign out" 
        onPress={() => signOut()} 
        color={BLUE}
      />
    </View>
  );
};

export default Settings;
