import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { ReactElement } from 'react';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../../auth/provider';
import { LocalAuthState } from '../../auth/reducer';
import { saveLocalAuthSettings } from '../../services/auth';
import { BLUE } from '../../style/Colours';
import { styles } from '../../style/Styles';
import Header from '../Header';
import PinLogin, { MAX_PIN_LENGTH } from './PinLogin';

type LocalAuthStackParamsList = {
  AskLocalAuth: undefined;
  FirstPin: undefined;
  ConfirmPin: { pin: string };
  AskFingerprint: undefined;
};

const AskLocalAuth = ({
  navigation,
}: StackScreenProps<LocalAuthStackParamsList, 'AskLocalAuth'>) => {
  const {
    setLocalAuthState,
    setLocalAuthSettings,
    state: { localAuthSettings },
  } = useAuth();
  return (
    <View style={styles.loginSignupContainer}>
      <Text style={styles.title}>
        Use PIN for login?
      </Text>
      <Button
        color={BLUE}
        title="yes"
        onPress={() => {
          navigation.navigate('FirstPin');
        }}
      />
      <Button
        color={BLUE}
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

const LocalAuthNavigator = (): ReactElement => {
  const Stack = createStackNavigator<LocalAuthStackParamsList>();
  return (
    <Stack.Navigator
      initialRouteName="AskLocalAuth"
      screenOptions={() => ({
        tabBarShowLabel: false, // remove the name from the navigation so just shows an icon
        // eslint-disable-next-line react/display-name
        headerTitle:  () => <Header/ >,
        headerStyle: styles.headerBar,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      })}
    >
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
  handleConfirm: () => void;
  message: string;
  title: string;
};

const PinSetup = (props: PinSetupProps) => {
  return (
    <View style={styles.loginSignupContainer}>
      <Text style={styles.title}>
        {props.title}
      </Text>
      
      <PinLogin {...props} />
      <View style={{}}>
        <Button
          disabled={props.pin.length !== MAX_PIN_LENGTH}
          title="confirm"
          onPress={props.handleConfirm}
          color={BLUE}
        />

      </View>
    </View>
  );
};

const FirstPin = ({
  navigation,
}: StackScreenProps<LocalAuthStackParamsList, 'AskLocalAuth'>) => {
  const [pin, setPin] = useState('');

  const handleConfirm = () => {
    navigation.navigate('ConfirmPin', { pin });
    setPin('');
  };

  return (
    <PinSetup
      pin={pin}
      setPin={setPin}
      loading={false}
      handleConfirm={handleConfirm}
      message={''}
      title="Enter a PIN"
    />
  );
};

const ConfirmPin = ({
  route,
  navigation,
}: StackScreenProps<LocalAuthStackParamsList, 'ConfirmPin'>) => {
  const {
    state: { localAuthSettings },
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
      const updatedSettings = { ...localAuthSettings, pin: true, pincode: pin };
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
      title="Confirm PIN"
    />
  );
};

const AskFingerprint = () => {
  const {
    state: { localAuthSettings },
    setLocalAuthSettings,
    setLocalAuthState,
  } = useAuth();
  const handleFingerprintButton = (enabled: boolean) => {
    setLocalAuthSettings({ ...localAuthSettings, fingerprint: enabled });
    saveLocalAuthSettings({ ...localAuthSettings, fingerprint: enabled });
    setLocalAuthState(LocalAuthState.signedIn);
  };

  return (
    <View style={styles.loginSignupContainer}>
      <Text>Use fingerprint for login?</Text>
      <Button color={BLUE} title="yes" onPress={() => handleFingerprintButton(true)} />
      <Button color={BLUE} title="no" onPress={() => handleFingerprintButton(false)} />
    </View>
  );
};

export default LocalAuthNavigator;
