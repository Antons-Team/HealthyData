import React from 'react';
import {Text, View, Button} from 'react-native';
import {useAuth} from '../../auth/provider';
import {LocalAuthState} from '../../auth/reducer';

const LocalAuthLockedScreen = () => {
  const {setLocalAuthState} = useAuth();
  return (
    <View>
      <Text>local auth locked</Text>
      <Button
        title="skip local auth"
        onPress={() => setLocalAuthState(LocalAuthState.signedIn)}
      />
    </View>
  );
};

export default LocalAuthLockedScreen;
