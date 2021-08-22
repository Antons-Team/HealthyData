import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
// import {useAuth} from '../auth/provider';
import {signInAnonymous, signInEmail} from '../services/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const {handleSignIn} = useAuth();
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
        title="Sign in email"
        onPress={() => {
          signInEmail(email, password);
        }}
      />
      <Button
        // added for convenience when testing
        title="anonymous sign in "
        onPress={() => {
          signInAnonymous();
        }}
      />
    </View>
  );
};
export default SignIn;
