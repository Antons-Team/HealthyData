import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { useAuth } from '../auth/provider';
import { SecuritySettingsStackParamsList } from '../navigation/SecuritySettingsNavigator';
import { saveLocalAuthSettings } from '../services/auth';
import { styles } from '../style/Styles';
import { SettingsButton } from './Settings';

const SecuritySettingsScreen = ({navigation} 
  : StackScreenProps<SecuritySettingsStackParamsList, 'SecuritySettingsScreen'>) : ReactElement =>  {
  const {state: {localAuthSettings} , setLocalAuthSettings} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleToggleFingerprint = async () => {
    setLoading(true);
    const updatedSettings = {...localAuthSettings, fingerprint: !localAuthSettings.fingerprint};
    setLocalAuthSettings(updatedSettings);
    await saveLocalAuthSettings(updatedSettings);
    setLoading(false);
  };  

  return (
    <View style={styles.settingsContainer}>
      <Text style={styles.title}>
              Security settings
      </Text>
      <SettingsButton 
        name={(localAuthSettings.pin ? 'Change PIN' : 'Set PIN')} 
        onPress={() => {navigation.navigate('PinSetup');}}/>

      {
        localAuthSettings.fingerprintEnabled && (
          <View>
            <Text> Enable fingerprint 
            </Text>
            <Switch value={localAuthSettings.fingerprint}
              enabled={loading}
              onValueChange={() => {handleToggleFingerprint();}}/>
            
          </View>
        )
      }

    </View>
    
  );
};

export default SecuritySettingsScreen;