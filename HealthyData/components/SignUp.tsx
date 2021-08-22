import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
import {useAuth} from '../auth/provider';
import {signUpEmail} from '../services/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {handleSignUp} = useAuth();
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
        onPress={async () => {
          const user = await signUpEmail(email, password);
          await handleSignUp(user);
        }}
      />
    </View>
  );
};
export default SignUp;