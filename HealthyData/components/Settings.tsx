import React from 'react';
import {View, Button} from 'react-native';
import {useAuth} from '../auth/provider';

const Settings = () => {
  const {handleSignOut} = useAuth();
  return (
    <View>
      <Button
        title="Sign out"
        onPress={() => {
          handleSignOut();
        }}
      />
    </View>
  );
};

export default Settings;
