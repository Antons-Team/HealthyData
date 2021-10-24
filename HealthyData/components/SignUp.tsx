import React, {ReactElement} from 'react';
import {useState} from 'react';
import {View, TextInput, Button, Text, TouchableOpacity} from 'react-native';
import {signInEmail, signUpEmail} from '../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamsList} from '../@types/AuthStackParams';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';

import {styles} from '../style/Styles';
import {DARK, BLUE, FABCEBOOK_BLUE} from '../style/Colours';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FacebookButton from './socialmediasignin/FacebookButton';
import GoogleButton from './socialmediasignin/GoogleButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

// export const GoogleButton = () : ReactElement => {

//   const signInGoogle = async () => {

//     await GoogleSignin.hasPlayServices();
//     const { idToken } = await GoogleSignin.signIn();
//     // Create a Google credential with the token
//     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//     // Sign-in the user with the credential
//     return auth().signInWithCredential(googleCredential);

//   };

//   return  (
//     <Button
//       title="Google Sign-In"
//       onPress={() => signInGoogle()}
//     />
//   );

// };

// export const FacebookButton = () : ReactElement => {
//   const signInFacebook = async () => {
//     try {
//     // Login the User and get his public profile and email id.
//       const result = await LoginManager.logInWithPermissions([
//         'public_profile',
//         'email',
//       ]);

//       // If the user cancels the login process, the result will have a
//       // isCancelled boolean set to true. We can use that to break out of this function.
//       if (result.isCancelled) {
//         throw 'User cancelled the login process';
//       }

//       // Get the Access Token
//       const data = await AccessToken.getCurrentAccessToken();

//       // If we don't get the access token, then something has went wrong.
//       if (!data) {
//         throw 'Something went wrong obtaining access token';
//       }

//       // Use the Access Token to create a facebook credential.
//       const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

//       // Use the facebook credential to sign in to the application.
//       return auth().signInWithCredential(facebookCredential);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     // TODO: facebook icon?
//     <Button title="facebook" onPress={signInFacebook} color={FABCEBOOK_BLUE}/>
//   );
// };

type Props = StackScreenProps<AuthStackParamsList, 'SignUp'>;

const SignUp = (props: Props): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.loginSignupContainer}>
      <Text
        style={[
          styles.infoTitle,
          {
            fontSize: 30,
            paddingHorizontal: 0,
            paddingBottom: 3,
            paddingTop: 10,
          },
        ]}>
        Sign Up to PillX
      </Text>
      <TextInput
        style={styles.loginSignupTextInput}
        underlineColorAndroid={DARK}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.loginSignupTextInput}
        underlineColorAndroid={DARK}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={() => signInEmail(email, password)}
        style={[
          styles.loginButtonContainer,
          {
            borderColor: BLUE,
          },
        ]}>
        <Ionicons
          style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
          name="mail-outline"
          size={40}
          color={BLUE}
        />
        <Text style={[{color: BLUE, fontSize: 18}]}>Log in with Email</Text>
      </TouchableOpacity>

      <View style={styles.switchLoginSignupContainer}>
        <Text style={{padding: 2, fontSize: 16}}>I&apos;m already a member,</Text>
        <Text
          style={styles.switchButton}
          onPress={() => {
            props.navigation.navigate('SignIn');
          }}>
          Log In
        </Text>
      </View>
      <FacebookButton />
      <GoogleButton />
    </View>
  );
};
export default SignUp;
