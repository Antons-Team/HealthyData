import React from 'react';
import {useAuth} from '../auth/provider';
import {LocalAuthState} from '../auth/reducer';
import Loading from '../components/Loading';
import LocalAuthLockedScreen from '../components/localauth/LocalAuthLockedScreen';
import LocalAuthSetupScreen from '../components/localauth/LocalAuthSetupScreen';
import AppNavigator from './AppNavigator';

const LocalAuth = () => {
  const {state: authState} = useAuth();

  switch (authState.localAuthState) {
    case LocalAuthState.signedIn:
      return <AppNavigator />;
    case LocalAuthState.asking:
      return <LocalAuthSetupScreen />;
    case LocalAuthState.signedOut:
      return <LocalAuthLockedScreen />;
    case LocalAuthState.loading:
    default:
      return <Loading />;
  }
};

export default LocalAuth;
