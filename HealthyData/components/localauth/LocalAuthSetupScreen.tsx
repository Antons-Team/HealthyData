import React from 'react';
import {Button, Text, View} from 'react-native';
import {useAuth} from '../../auth/provider';
import {LocalAuthState} from '../../auth/reducer';
import {saveLocalAuthOptions} from '../../services/auth';
const LocalAuthSetupScreen = () => {
  const {setLocalAuthState, setLocalAuthOptions} = useAuth();
  return (
    <View>
      <Text>local auth setup</Text>
      <Button
        title="yes"
        onPress={() => {
          saveLocalAuthOptions({pin: true, fingerprint: true});
          setLocalAuthOptions({pin: true, fingerprint: true});
          setLocalAuthState(LocalAuthState.signedIn);
        }}
      />
      <Button
        title="no"
        onPress={() => {
          saveLocalAuthOptions({pin: false, fingerprint: false});
          setLocalAuthOptions({pin: false, fingerprint: false});
          setLocalAuthState(LocalAuthState.signedIn);
        }}
      />
    </View>
  );
};

export default LocalAuthSetupScreen;
