import React, {createContext, useContext, useMemo, useReducer} from 'react';
import authReducer, {initialState} from './reducer';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext({
  state: initialState,
  handleSignIn: async (_data: any) => {},
});

const AuthProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const authContext = useMemo(
    () => ({
      state: state,
      handleSignIn: async data => {
        console.log('signin');

        try {
          const user = await auth().signInAnonymously();
          console.log(user, 'signed in anonumously');
        } catch (error) {
          console.error(error, 'shit the bed');
        }
        console.log('user token', state.userToken);
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      handleSignOut: () => dispatch({type: 'SIGN_OUT'}),
      handleSignUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
