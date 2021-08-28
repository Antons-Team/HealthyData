import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button, Text} from 'react-native';
// import {useAuth} from '../auth/provider';
import {signInAnonymous, signInEmail} from '../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamsList} from '../@types/AuthStackParams';

import {styles} from '../style/Styles';
import {DARK, BLUE} from '../style/Colours'

type Props = StackScreenProps<AuthStackParamsList, 'SignIn'>;

const SignIn = (props: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const {handleSignIn} = useAuth();
  return (
    <View style={styles.loginSignupContainer}>
      <TextInput
        style={styles.loginSignupTextInput} 
        underlineColorAndroid={DARK}
        placeholder="Username" 
        value={email} 
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
      <Button
        color={BLUE}
        title="Log In"
        onPress={() => {
          signInEmail(email, password);
        }}
      />
      <View style={styles.switchLoginSignupContainer}>
        <Text
          style={{padding: 2}}
        >
          I'm a new member,
        </Text>
        <Text
          style={styles.switchButton}
          onPress={() => {
            props.navigation.navigate('SignUp');
          }}
        >
          Sign Up Now
        </Text>
      </View>
    </View>
  );
};
export default SignIn;
