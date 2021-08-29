import React, {useEffect, useState} from 'react';
import {View, Button} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from '../../auth/provider';
import {LocalAuthSettings, LocalAuthState} from '../../auth/reducer';
import {signOut, resetLocalAuth} from '../../services/auth';
import PinLogin, {MAX_PIN_LENGTH} from './PinLogin';

const LocalAuthLockedScreen = () => {
  const {setLocalAuthState} = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEnterPin = async () => {
      setLoading(true);
      const storedAuth = await EncryptedStorage.getItem('localAuthSettings');
      if (storedAuth !== null) {
        const localAuthSettings: LocalAuthSettings = JSON.parse(storedAuth);

        if (pin === localAuthSettings.pincode) {
          setLocalAuthState(LocalAuthState.signedIn);
        } else {
          console.log('wrong pin');
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
