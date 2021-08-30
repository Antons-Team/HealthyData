import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { useAuth } from '../auth/provider';
import { LockSecurityScreen } from '../components/localauth/LocalAuthLockedScreen';
import { PinSetupNavigator, PinSetupStackParamsList } from '../components/localauth/LocalAuthSetupScreen';
import SecuritySettingsScreen from '../components/SecuritySettingsScreen';
import { saveLocalAuthSettings } from '../services/auth';

export type SecuritySettingsStackParamsList = {
  SettingsLocked: undefined
  SecuritySettingsScreen: undefined
  PinSetup: undefined
}

const SecuritySettingsNavigator = () : ReactElement => {

  const {
    state: { localAuthSettings },
    setLocalAuthSettings,
  } = useAuth();
  const onSuccess = (navigation: StackNavigationProp<PinSetupStackParamsList, 'ConfirmPin'>, pin: string) => {
    const updatedSettings = { ...localAuthSettings, pin: true, pincode: pin };
    setLocalAuthSettings(updatedSettings);
    saveLocalAuthSettings(updatedSettings);
    navigation.navigate('SecuritySettingsScreen');
  };


  const Stack = createStackNavigator<SecuritySettingsStackParamsList>();
  return ( 
    <Stack.Navigator 
      screenOptions={{headerShown: false}} 
      initialRouteName={localAuthSettings.pin? 'SettingsLocked' : 'SecuritySettingsScreen'}
    >
      <Stack.Screen name="SettingsLocked" component={LockSecurityScreen}/>
      <Stack.Screen name="SecuritySettingsScreen" component={SecuritySettingsScreen}/>
      <Stack.Screen name="PinSetup">
        {props => <PinSetupNavigator {...props} onSuccess={onSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
    
  );
};
export default SecuritySettingsNavigator;