import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {ReactElement} from 'react';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native';

const GoogleButton = (): ReactElement => {
  const signInGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  return <Button title="Google Sign-In" onPress={() => signInGoogle()} />;
};

export default GoogleButton;
