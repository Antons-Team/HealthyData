import React from 'react';
import {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
import {AuthContext} from '../App';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {signIn} = React.useContext(AuthContext);
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
          signIn({});
        }}
      />
    </View>
  );
};
export default SignUp;
