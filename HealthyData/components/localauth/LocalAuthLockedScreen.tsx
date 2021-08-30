import React, {ReactElement, useEffect, useState} from 'react';
import {View, Button, Text} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from '../../auth/provider';
import {LocalAuthSettings, LocalAuthState} from '../../auth/reducer';
import {signOut, resetLocalAuth} from '../../services/auth';
import PinLogin, {MAX_PIN_LENGTH} from './PinLogin';
import TouchID from 'react-native-touch-id';
import Header from '../Header';
import { styles } from '../../style/Styles';
import { BLUE, WHITE } from '../../style/Colours';
import { StackScreenProps } from '@react-navigation/stack';
import { SecuritySettingsStackParamsList } from '../../navigation/SecuritySettingsNavigator';

type LocalAuthLockedProps = {
  onSuccess: () => void 
}

const LocalAuthLocked = ({onSuccess}: LocalAuthLockedProps) :ReactElement => {
  const {
    state: {localAuthSettings},
    setLocalAuthState,
  } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!localAuthSettings.fingerprint) {
      return;
    }
    TouchID.authenticate('Login with fingerprint')
      .then(() => {
        onSuccess();
      })
      .catch((error: any) => {
        if (error.code === 'AUTHENTICATION_CANCELED') {
          // failed /canecelled by user
        } else {
          console.error(error);
          //somethign went wrong
        }
      });
  }, []);

  useEffect(() => {
    const handleEnterPin = async () => {
      setLoading(true);
      const storedAuth = await EncryptedStorage.getItem('localAuthSettings');
      if (storedAuth !== null) {
        const settings: LocalAuthSettings = JSON.parse(storedAuth);

        if (pin === settings.pincode) {
          onSuccess();
        } else {
          setPin('');
          setMessage('incorrect');
        }
      } else {
        console.error('pin not set or something');
      }
      setLoading(false);
    };

    if (pin.length === MAX_PIN_LENGTH) {
      handleEnterPin();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
  }, [pin, setLocalAuthState]);
  return (
    <View style={styles.loginSignupContainer}>
      <PinLogin pin={pin} setPin={setPin} loading={loading} message={message} />
    </View>
  );
};

const LocalAuthLockedScreen = (): ReactElement => {

  const {setLocalAuthState} = useAuth();
  return (
    <View style={{flex: 1}}>
      <View style={{height: 60, ...styles.center, backgroundColor: WHITE}}>
        <Header/>
      </View>
      <Text style={styles.title}>Enter PIN to login</Text>
      <LocalAuthLocked onSuccess={() => {
        setLocalAuthState(LocalAuthState.signedIn);
      }}/>
      <View>
        <Button
          color={BLUE}
          title="i forgot"
          onPress={() => {
            signOut();
            resetLocalAuth();
          }}
        />
      </View>
    </View>
  );
};

export const LockSecurityScreen = ({navigation}: 
  StackScreenProps<SecuritySettingsStackParamsList, 'SettingsLocked'>
) :ReactElement => {
  return (
    <View style={{flex:1}}>
      <Text style={styles.title}>Enter PIN</Text>
      <LocalAuthLocked onSuccess={() => {navigation.navigate('SecuritySettingsScreen');}}/>
    </View>
  );
};

export default LocalAuthLockedScreen;
