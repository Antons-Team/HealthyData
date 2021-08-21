import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Button, View} from 'react-native';
import {AuthStackParamsList} from '../@types/AuthStackParams';

type Props = StackScreenProps<AuthStackParamsList, 'SignInOptions'>;

const SignInOptions = ({navigation}: Props) => {
  return (
    <View>
      <Button
        title="Sign up"
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      />
      <Button
        title="Log in"
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};

export default SignInOptions;
