import React from 'react';
import {useState} from 'react';
import {View, Button, Text} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {useAuth} from '../auth/provider';
import {LocalAuthSettings} from '../auth/reducer';
import {resetLocalAuth, saveLocalAuthSettings, signOut} from '../services/auth';

const Settings = () => {
  const handleAuthOptions = async (options: LocalAuthSettings) => {
    await saveLocalAuthSettings(options);
    setLocalAuthSettings(options);
  };

  const {state: authState, setLocalAuthSettings} = useAuth();

  const handleTogglePin = () => {
    handleAuthOptions({
      ...authState.localAuthSettings,
      pin: !authState.localAuthSettings.pin,
    });
  };
  const handleToggleFingerprint = () => {
    handleAuthOptions({
      ...authState.localAuthSettings,
      fingerprint: !authState.localAuthSettings.fingerprint,
    });
  };
  return (
    <View>
      <Button
        title="Sign out"
        onPress={() => {
          signOut();
          resetLocalAuth();
        }}
      />
      <Text>Pin</Text>
      <Switch
        value={authState.localAuthSettings.pin}
        onValueChange={() => handleTogglePin()}
      />
      <Text>fingerprint</Text>
      <Switch
        value={authState.localAuthSettings.fingerprint}
        onValueChange={() => handleToggleFingerprint()}
      />
    </View>
  );
};

export default Settings;
