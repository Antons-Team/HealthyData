type State = {
  isLoading: boolean;
  isSignout: boolean;
  user: any;
};

const authReducer = (prevState: any, action: any) => {
  switch (action.type) {
    case 'RESTORE_USER':
      return {
        ...prevState,
        user: action.user,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        user: null,
      };
  }
};

export const initialState = {
  isLoading: true,
  isSignout: false,
  user: null,
};

export default authReducer;
