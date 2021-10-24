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

const SignIn = (props: Props): JSX.Element => {
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
        Log in to PillX
      </Text>
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
        <Text style={{padding: 2 , fontSize: 16}}>I&apos;m a new member,</Text>
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
      {/* <Button
        color={BLUE}
        title="log in anonymous"
        onPress={() => {
          signInAnonymous();
        }}
      /> */}
    </View>
  );
};
export default SignIn;
