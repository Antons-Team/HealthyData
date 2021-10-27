import React from 'react';
import {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import {signInEmail} from '../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamsList} from '../@types/AuthStackParams';

import {styles} from '../style/Styles';
import {DARK, BLUE} from '../style/Colours';
import FacebookButton from './socialmediasignin/FacebookButton';
import GoogleButton from './socialmediasignin/GoogleButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = StackScreenProps<AuthStackParamsList, 'SignUp'>;

/**
 * @returns sign up screen
 */
const SignUp = (props: Props): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const filled = email !== '' && password !== '';

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
        disabled={!filled}
        onPress={() => signInEmail(email, password)}
        style={[
          styles.loginButtonContainer,
          {
            borderColor: filled ? BLUE : '#ddd',
          },
        ]}>
        <Ionicons
          style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
          name="mail-outline"
          size={40}
          color={filled ? BLUE : '#ddd'}
        />
        <Text style={[{color: filled ? BLUE : '#ddd', fontSize: 18}]}>
          Sign Up with Email
        </Text>
      </TouchableOpacity>

      <View style={styles.switchLoginSignupContainer}>
        <Text style={{padding: 2, fontSize: 16}}>
          I&apos;m already a member,
        </Text>
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
