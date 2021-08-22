import React from 'react';
import {View, Button} from 'react-native';
import {signOut} from '../services/auth';

const Settings = () => {
  return (
    <View>
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
};

export default Settings;
