/* eslint-disable @typescript-eslint/no-empty-function */
import React, {createContext, ReactChild, ReactChildren, ReactElement, useMemo, useReducer} from 'react';
import {useContext} from 'react';
import authReducer, {
  AuthState,
  initialState,
  LocalAuthSettings,
  LocalAuthState,
} from './reducer';

const AuthContext = createContext({
  state: initialState,
  handleSignIn: () => {},
  handleSignOut: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLocalAuthSettings: (_options: LocalAuthSettings) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLocalAuthState: (_state: LocalAuthState) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFingerprintEnabled: (_enabled: boolean) => {},
});

type AuthContextType = {
  state: AuthState;
  handleSignIn: () => void;
  handleSignOut: () => void;
  setLocalAuthSettings: (settings: LocalAuthSettings) => void;
  setLocalAuthState: (state: LocalAuthState) => void;
  setFingerprintEnabled: (enabled: boolean) => void
}

interface AuxProps {
  children: ReactChild | ReactChildren;
}

const AuthProvider = ({children}: AuxProps) : ReactElement => {
  const [state, dispatch] = useReducer(
    authReducer,
    initialState,
    () => initialState,
  );

  const authContext = useMemo(
    () => ({
      state: state,
      handleSignIn: () => {
        dispatch({type: 'SIGN_IN'});
      },
      handleSignOut: () => {
        dispatch({type: 'SIGN_OUT'});
      },
      setLocalAuthSettings: (options: LocalAuthSettings) => {
        dispatch({type: 'LOCAL_AUTH_OPTIONS', options});
      },
      setLocalAuthState: (localAuthState: LocalAuthState) => {
        dispatch({type: 'LOCAL_AUTH_STATE', state: localAuthState});
      },
      setFingerprintEnabled: (enabled: boolean) => {
        dispatch({type: 'FINGERPRINT_ENABLED', enabled});
      },
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = (): AuthContextType => useContext(AuthContext);
