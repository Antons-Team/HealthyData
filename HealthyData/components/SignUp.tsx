import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
import {signUpEmail} from '../services/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <TextInput placeholder="Username" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign up email"
        onPress={() => {
          signUpEmail(email, password);
        }}
      />
    </View>
  );
};
export default SignUp;
