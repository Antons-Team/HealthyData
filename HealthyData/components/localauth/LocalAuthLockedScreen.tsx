import React, {ReactElement, useEffect, useState} from 'react';
import {View, Button} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from '../../auth/provider';
import {LocalAuthSettings, LocalAuthState} from '../../auth/reducer';
import {signOut, resetLocalAuth} from '../../services/auth';
import PinLogin, {MAX_PIN_LENGTH} from './PinLogin';
import TouchID from 'react-native-touch-id';

const LocalAuthLockedScreen = (): ReactElement => {
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
    TouchID.authenticate('to demo this react-native component')
      .then(() => {
        setLocalAuthState(LocalAuthState.signedIn);
      })
      .catch((error: any) => {
        if (error.code === 'AUTHENTICATION_CANCELED') {
          // failed /canecelled by user
        } else {
          console.error(error);
          //somethign went wrong
        }
      });
  }, [localAuthSettings.fingerprint, setLocalAuthState]);

  useEffect(() => {
    const handleEnterPin = async () => {
      setLoading(true);
      const storedAuth = await EncryptedStorage.getItem('localAuthSettings');
      if (storedAuth !== null) {
        const settings: LocalAuthSettings = JSON.parse(storedAuth);

        if (pin === settings.pincode) {
          setLocalAuthState(LocalAuthState.signedIn);
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
    <View style={{flex: 1}}>
      <PinLogin pin={pin} setPin={setPin} loading={loading} message={message} />
      <View>
        <Button
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

export default LocalAuthLockedScreen;
