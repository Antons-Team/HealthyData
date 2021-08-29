import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {useAuth} from '../../auth/provider';
import {LocalAuthState} from '../../auth/reducer';
import {saveLocalAuthSettings} from '../../services/auth';
import PinLogin from './PinLogin';

type LocalAuthStackParamsList = {
  AskLocalAuth: undefined;
  FirstPin: undefined;
  ConfirmPin: {pin: string};
  AskFingerprint: undefined;
};

const AskLocalAuth = ({
  navigation,
}: StackScreenProps<LocalAuthStackParamsList, 'AskLocalAuth'>) => {
  const {
    setLocalAuthState,
    setLocalAuthSettings,
    state: {localAuthSettings},
  } = useAuth();
  return (
    <View>
      <Text>local auth setup</Text>
      <Button
        title="yes"
        onPress={() => {
          navigation.navigate('FirstPin');
        }}
      />
      <Button
        title="no"
        onPress={() => {
          saveLocalAuthSettings({
            ...localAuthSettings,
            pin: false,
            fingerprint: false,
          });
          setLocalAuthSettings({
            ...localAuthSettings,
            pin: false,
            fingerprint: false,
          });
          setLocalAuthState(LocalAuthState.signedIn);
        }}
      />
    </View>
  );
};

const LocalAuthNavigator = () => {
  const Stack = createStackNavigator<LocalAuthStackParamsList>();
  return (
    <Stack.Navigator>
      <Stack.Screen name="AskLocalAuth" component={AskLocalAuth} />
      <Stack.Screen name="FirstPin" component={FirstPin} />
      <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
      <Stack.Screen name="AskFingerprint" component={AskFingerprint} />
    </Stack.Navigator>
  );
};

type PinSetupProps = {
  pin: string;
  setPin: (pin: string) => void;
  loading: boolean;
  handleConfirm: any;
  message: string;
};

const PinSetup = (props: PinSetupProps) => {
  return (
    <View style={{flex: 1}}>
      <PinLogin {...props} />
      <Button
        disabled={props.pin.length !== 4}
        title="confirm"
        onPress={props.handleConfirm}
      />
    </View>
  );
};

const FirstPin = ({
  navigation,
}: StackScreenProps<LocalAuthStackParamsList, 'AskLocalAuth'>) => {
  const [pin, setPin] = useState('');

  const handleConfirm = () => {
    navigation.navigate('ConfirmPin', {pin});
    setPin('');
  };

  return (
    <PinSetup
      pin={pin}
      setPin={setPin}
      loading={false}
      handleConfirm={handleConfirm}
      message={''}
    />
  );
};

const ConfirmPin = ({
  route,
  navigation,
}: StackScreenProps<LocalAuthStackParamsList, 'ConfirmPin'>) => {
  const {
    state: {localAuthSettings},
    setLocalAuthSettings,
    setLocalAuthState,
  } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    if (route.params.pin !== pin) {
      setMessage('pins dont match');
      setPin('');
    } else {
      setLoading(true);
      const updatedSettings = {...localAuthSettings, pin: true, pincode: pin};
      setLocalAuthSettings(updatedSettings);
      saveLocalAuthSettings(updatedSettings);
      if (localAuthSettings.fingerprintEnabled) {
        navigation.navigate('AskFingerprint');
      } else {
        setLocalAuthState(LocalAuthState.signedIn);
      }
    }
  };

  return (
    <PinSetup
      pin={pin}
      setPin={setPin}
      loading={loading}
      handleConfirm={handleConfirm}
      message={message}
    />
  );
};

const AskFingerprint = () => {
  const {
    state: {localAuthSettings},
    setLocalAuthSettings,
    setLocalAuthState,
  } = useAuth();
  const handleFingerprintButton = (enabled: boolean) => {
    setLocalAuthSettings({...localAuthSettings, fingerprint: enabled});
    saveLocalAuthSettings({...localAuthSettings, fingerprint: enabled});
    setLocalAuthState(LocalAuthState.signedIn);
  };

  return (
    <View>
      <Text>use fingerprint?</Text>
      <Button title="yes" onPress={() => handleFingerprintButton(true)} />
      <Button title="no" onPress={() => handleFingerprintButton(false)} />
    </View>
  );
};

export default LocalAuthNavigator;
