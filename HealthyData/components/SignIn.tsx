import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button, Text, TouchableOpacity} from 'react-native';
import {signInAnonymous, signInEmail} from '../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamsList} from '../@types/AuthStackParams';

import {styles} from '../style/Styles';
import {DARK, BLUE, FABCEBOOK_BLUE} from '../style/Colours';
import FacebookButton from './socialmediasignin/FacebookButton';
import GoogleButton from './socialmediasignin/GoogleButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = StackScreenProps<AuthStackParamsList, 'SignIn'>;

/**
 * @returns sign in screen
 */
const SignIn = (props: Props): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const filled = email !== '' && password !== '';

  return (
    <View style={styles.loginSignupContainer}>
      <Text style={[styles.signUpHeader]}>Log in to PillX</Text>
      <TextInput
        style={styles.loginSignupTextInput}
        underlineColorAndroid={DARK}
        placeholder="Email Address"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.loginSignupTextInput}
        placeholder="Password"
        underlineColorAndroid={DARK}
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
          style={styles.leftIcon}
          name="mail-outline"
          size={40}
          color={filled ? BLUE : '#ddd'}
        />
        <Text style={[{color: filled ? BLUE : '#ddd', fontSize: 18}]}>
          Log in with Email
        </Text>
      </TouchableOpacity>

      <View style={styles.switchLoginSignupContainer}>
        <Text style={{padding: 2, fontSize: 16}}>I&apos;m a new member,</Text>
        <Text
          style={styles.switchButton}
          onPress={() => {
            props.navigation.navigate('SignUp');
          }}>
          Sign Up Now
        </Text>
      </View>

      <FacebookButton />
      <GoogleButton />
    </View>
  );
};
export default SignIn;
