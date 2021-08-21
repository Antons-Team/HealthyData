import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
import {useAuth} from '../auth/provider';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {handleSignIn} = useAuth();
  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign in"
        onPress={() => {
          handleSignIn({});
        }}
      />
    </View>
  );
};
export default SignUp;
