import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button, Text} from 'react-native';
import {signUpEmail} from '../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamsList} from '../@types/AuthStackParams';

import {styles} from '../style/Styles';
import {DARK, BLUE} from '../style/Colours';

type Props = StackScreenProps<AuthStackParamsList, 'SignUp'>;

const SignUp = (props: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.loginSignupContainer}>
      <TextInput 
        style={styles.loginSignupTextInput} 
        underlineColorAndroid={DARK}
        placeholder="Username or Email" 
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
      <Button
        title="Sign up now"
        color={BLUE}
        onPress={() => {
          signUpEmail(email, password);
        }}
      />
      <View style={styles.switchLoginSignupContainer}>
        <Text
          style={{padding: 2}}
        >
          I'm already a member,
        </Text>
        <Text
          style={styles.switchButton}
          onPress={() => {
            props.navigation.navigate('SignIn');
          }}
        >
          Log In
        </Text>
      </View>
    </View>
  );
};
export default SignUp;
