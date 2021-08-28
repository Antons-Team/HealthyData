import React from 'react';
import {View, Button} from 'react-native';
import {resetLocalAuth, signOut} from '../services/auth';

const Settings = () => {
  return (
    <View>
      <Button
        title="Sign out"
        onPress={() => {
          signOut();
          resetLocalAuth();
        }}
      />
    </View>
  );
};

export default Settings;
