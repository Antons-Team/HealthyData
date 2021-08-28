import React from 'react';
import {Button, Text, View} from 'react-native';
import {useAuth} from '../../auth/provider';
import {LocalAuthState} from '../../auth/reducer';
import {saveLocalAuthSettings} from '../../services/auth';
const LocalAuthSetupScreen = () => {
  const {setLocalAuthState, setLocalAuthSettings} = useAuth();
  return (
    <View>
      <Text>local auth setup</Text>
      <Button
        title="yes"
        onPress={() => {
          saveLocalAuthSettings({pin: true, fingerprint: true});
          setLocalAuthSettings({pin: true, fingerprint: true});
          setLocalAuthState(LocalAuthState.signedIn);
        }}
      />
      <Button
        title="no"
        onPress={() => {
          saveLocalAuthSettings({pin: false, fingerprint: false});
          setLocalAuthSettings({pin: false, fingerprint: false});
          setLocalAuthState(LocalAuthState.signedIn);
        }}
      />
    </View>
  );
};

export default LocalAuthSetupScreen;
