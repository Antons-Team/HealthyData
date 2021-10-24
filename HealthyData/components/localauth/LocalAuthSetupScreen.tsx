import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import React, {ReactElement, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAuth} from '../../auth/provider';
import {LocalAuthState} from '../../auth/reducer';
import {SecuritySettingsStackParamsList} from '../../navigation/SecuritySettingsNavigator';
import {saveLocalAuthSettings} from '../../services/auth';
import {BLUE, DARK} from '../../style/Colours';
import {styles} from '../../style/Styles';
import Header from '../Header';
import PinLogin, {MAX_PIN_LENGTH} from './PinLogin';

type LocalAuthStackParamsList = {
  AskLocalAuth: undefined;
  PinSetup: undefined;
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
    <View style={styles.loginSignupContainer}>
      <Text style={styles.infoTitle}>Use PIN for login?</Text>
      <Text
        onPress={() => {
          navigation.navigate('PinSetup');
        }}
        style={[
          styles.loginButtonContainer,
          {textAlign: 'center', color: BLUE, borderColor: BLUE, fontSize: 16},
        ]}>
        {' '}
        YES{' '}
      </Text>
      {/* <Button
        color={BLUE}
        title="yes"
        onPress={() => {
          navigation.navigate('PinSetup');
        }}
      /> */}
      <Text
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
        style={[
          styles.loginButtonContainer,
          {textAlign: 'center', color: DARK, borderColor: DARK, fontSize: 16},
        ]}>
        {' '}
        NO{' '}
      </Text>
    </View>
  );
};

const LocalAuthNavigator = (): ReactElement => {
  const {
    state: {localAuthSettings},
    setLocalAuthSettings,
    setLocalAuthState,
  } = useAuth();

  const onSuccess = (
    navigation: StackNavigationProp<PinSetupStackParamsList, 'ConfirmPin'>,
    pin: string,
  ) => {
    const updatedSettings = {...localAuthSettings, pin: true, pincode: pin};
    setLocalAuthSettings(updatedSettings);
    saveLocalAuthSettings(updatedSettings);
    if (localAuthSettings.fingerprintEnabled) {
      navigation.navigate('AskFingerprint');
    } else {
      setLocalAuthState(LocalAuthState.signedIn);
    }
  };

  const Stack = createStackNavigator<LocalAuthStackParamsList>();
  return (
    <Stack.Navigator
      initialRouteName="AskLocalAuth"
      screenOptions={() => ({
        tabBarShowLabel: false, // remove the name from the navigation so just shows an icon
        // eslint-disable-next-line react/display-name
        headerTitle: () => <Header />,
        headerStyle: styles.headerBar,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      })}>
      <Stack.Screen name="AskLocalAuth" component={AskLocalAuth} />
      <Stack.Screen name="PinSetup">
        {props => <PinSetupNavigator {...props} onSuccess={onSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="AskFingerprint" component={AskFingerprint} />
    </Stack.Navigator>
  );
};

export type PinSetupStackParamsList = {
  FirstPin: undefined;
  ConfirmPin: {pin: string};
  AskFingerprint: undefined;
  SecuritySettingsScreen: undefined;
};

type PinSetupNavigatorProps = {
  navigation: StackNavigationProp<
    LocalAuthStackParamsList | SecuritySettingsStackParamsList,
    'PinSetup'
  >;
  route: RouteProp<LocalAuthStackParamsList, 'PinSetup'>;
  onSuccess: (
    navigation: StackNavigationProp<PinSetupStackParamsList, 'ConfirmPin'>,
    pin: string,
  ) => void;
};

export const PinSetupNavigator = ({
  onSuccess,
}: PinSetupNavigatorProps): ReactElement => {
  const Stack = createStackNavigator<PinSetupStackParamsList>();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FirstPin" component={FirstPinScreen} />
      <Stack.Screen name="ConfirmPin">
        {props => <ConfirmPinScreen {...props} onSuccess={onSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

type PinSetupScreenProps = {
  pin: string;
  setPin: (pin: string) => void;
  loading: boolean;
  handleConfirm: () => void;
  message: string;
  title: string;
};

const PinSetup = (props: PinSetupScreenProps) => {
  return (
    <View style={styles.loginSignupContainer}>
      <Text style={styles.title}>{props.title}</Text>

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

const FirstPinScreen = ({
  navigation,
}: StackScreenProps<PinSetupStackParamsList, 'FirstPin'>) => {
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
      title="Enter a PIN"
    />
  );
};

type ConfirmPinProps = StackScreenProps<
  PinSetupStackParamsList,
  'ConfirmPin'
> & {
  onSuccess: (
    navigation: StackNavigationProp<PinSetupStackParamsList, 'ConfirmPin'>,
    pin: string,
  ) => void;
};

const ConfirmPinScreen = ({navigation, route, onSuccess}: ConfirmPinProps) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    if (route.params.pin !== pin) {
      setMessage('Pins do not match');
      setPin('');
    } else {
      setLoading(true);
      onSuccess(navigation, pin);
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
    <View style={styles.loginSignupContainer}>
      <Text>Use fingerprint for login?</Text>
      <Button
        color={BLUE}
        title="yes"
        onPress={() => handleFingerprintButton(true)}
      />
      <Button
        color={BLUE}
        title="no"
        onPress={() => handleFingerprintButton(false)}
      />
    </View>
  );
};

export default LocalAuthNavigator;
