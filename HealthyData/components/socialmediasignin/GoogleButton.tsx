import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {ReactElement} from 'react';
import auth from '@react-native-firebase/auth';
import {Button, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BLACK, FABCEBOOK_BLUE} from '../../style/Colours';
import {styles} from '../../style/Styles';

/**
 * @returns component for google login
 */
const GoogleButton = (): ReactElement => {
  const signInGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  return (
    <TouchableOpacity
      onPress={signInGoogle}
      style={[
        styles.loginButtonContainer,
        {
          borderColor: BLACK,
        },
      ]}>
      <Ionicons
        style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
        name="logo-google"
        size={40}
        color={BLACK}
      />
      <Text style={[{color: BLACK, fontSize: 18}]}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleButton;
