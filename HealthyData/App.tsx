import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Loading from './components/Loading';


enum State {
  signedIn,
  signedOut,
  loading,
}

const App = () => {
  const [signedInState, setSignedInState] = useState<State>(State.loading) ;

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        setSignedInState(State.signedIn);
      } else {
        setSignedInState(State.signedOut);
      }
    });
    return subscriber;
  }, []);

  return signedInState === State.loading ? (
    <Loading />
  ) : (
    <NavigationContainer>
      <RootNavigator signedIn={signedInState === State.signedIn} />
    </NavigationContainer>
  );
};

export default App;
