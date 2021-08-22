import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import authReducer, {initialState} from './reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

const AuthContext = createContext({
  state: initialState,
  handleSignIn: async (_user: any) => {},
  handleSignUp: async (_user: any) => {},
  handleSignOut: async () => {},
});

const AuthProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let user;
      try {
        user = await EncryptedStorage.getItem('user');
      } catch (e) {
        console.error(e);
      }
      dispatch({type: 'RESTORE_USER', user});
    };
    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      state: state,
      //TODO: error handling for email sign in??
      handleSignIn: async (user: any) => {
        try {
          await EncryptedStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error(e);
        }
        dispatch({type: 'SIGN_IN', user});
      },
      handleSignOut: async () => {
        try {
          await EncryptedStorage.clear();
        } catch (e) {
          console.error(e);
        }
        dispatch({type: 'SIGN_OUT'});
      },
      handleSignUp: async (user: any) => {
        try {
          await EncryptedStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error(e);
        }
        dispatch({type: 'SIGN_IN', user});
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
