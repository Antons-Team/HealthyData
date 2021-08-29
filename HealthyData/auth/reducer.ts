export type AuthAction =
  | {type: 'SIGN_IN'}
  | {type: 'SIGN_OUT'}
  | {type: 'LOCAL_AUTH_OPTIONS'; options: LocalAuthSettings}
  | {type: 'LOCAL_AUTH_STATE'; state: LocalAuthState};
// | {type: 'SET_PIN'; pincode: string};

export type AuthState = {
  isSignedIn: SignedInState;
  localAuthSettings: LocalAuthSettings;
  localAuthState: LocalAuthState;
};

export type LocalAuthSettings = {
  pin: boolean;
  fingerprint: boolean;
  pincode?: string;
};

export enum LocalAuthState {
  asking, // ask to set up local auth
  loading, // checking for saved local auth options
  signedIn, // completed local auth OR not enabled OR finished asking
  signedOut, // need to enter pin / fingerprint
}

export enum SignedInState {
  singedIn,
  signedOut,
  loading,
}

export const initialState = {
  isSignedIn: SignedInState.loading,
  localAuthState: LocalAuthState.loading,
  localAuthSettings: {pin: false, fingerprint: false},
};

const authReducer = (prevState: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignedIn: SignedInState.singedIn,
        localAuthState:
          prevState.isSignedIn === SignedInState.signedOut
            ? LocalAuthState.asking
            : prevState.localAuthState,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignedIn: SignedInState.signedOut,
        localAuthState: LocalAuthState.asking,
      };

    case 'LOCAL_AUTH_OPTIONS':
      return {
        ...prevState,
        localAuthSettings: action.options,
      };
    case 'LOCAL_AUTH_STATE':
      return {...prevState, localAuthState: action.state};
    // case 'SET_PIN':
    //   return {
    //     ...prevState,
    //     localAuthSettings: {
    //       ...prevState.localAuthSettings,
    //       pin: true,
    //       pincode: action.pincode,
    //     },
    //   };
  }
};

export default authReducer;
