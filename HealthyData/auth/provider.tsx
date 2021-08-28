import React, {createContext, useMemo, useReducer} from 'react';
import {useContext} from 'react';
import authReducer, {
  initialState,
  LocalAuthSettings,
  LocalAuthState,
} from './reducer';

const AuthContext = createContext({
  state: initialState,
  handleSignIn: () => {},
  handleSignOut: () => {},
  setLocalAuthSettings: (_options: LocalAuthSettings) => {},
  setLocalAuthState: (_state: LocalAuthState) => {},
});

const AuthProvider: React.FC = ({children}) => {
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
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
