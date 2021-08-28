import React from 'react';
import {useEffect} from 'react';
import {useAuth} from '../auth/provider';
import AuthNavigator from './AuthNavigator';
import auth from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  LocalAuthSettings,
  LocalAuthState,
  SignedInState,
} from '../auth/reducer';
import Loading from '../components/Loading';
import {NavigationContainer} from '@react-navigation/native';
import LocalAuth from './LocalAuth';

type RootNavigatorProps = {
  signedIn: boolean;
};

const RootNavigator = () => {
  const {
    state: authState,
    handleSignIn,
    handleSignOut,
    setLocalAuthSettings,
    setLocalAuthState,
  } = useAuth();

  useEffect(() => {
    getLocalAuthSettings();
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        handleSignIn();
      } else {
        handleSignOut();
      }
    });
    return subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocalAuthSettings = async () => {
    try {
      const localAuth = await EncryptedStorage.getItem('localAuthSettings');
      if (localAuth !== null) {
        const localAuthSettings: LocalAuthSettings = JSON.parse(localAuth);
        setLocalAuthSettings(localAuthSettings);
        setLocalAuthState(
          localAuthSettings.fingerprint || localAuthSettings.pin
            ? LocalAuthState.signedOut
            : LocalAuthState.signedIn,
        );
      } else {
        setLocalAuthState(LocalAuthState.asking);
        //maybe dont need this
      }
    } catch (e) {
      console.error(e);
      setLocalAuthState(LocalAuthState.asking);
      //maybe dont need this?
    }
  };

  if (
    authState.isSignedIn === SignedInState.loading ||
    authState.localAuthState === LocalAuthState.loading
  ) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {authState.isSignedIn === SignedInState.signedOut ? (
        <AuthNavigator />
      ) : (
        <LocalAuth />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
