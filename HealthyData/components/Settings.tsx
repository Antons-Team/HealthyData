import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import {View, Button, Text} from 'react-native';
import {signOut} from '../services/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {BLUE, DARK} from '../style/Colours';
import { styles } from '../style/Styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../@types/SettingsStackParamList';

type SettingsNavigationProps = StackNavigationProp<
  SettingsStackParamList,
  'Settings'
>;

type Props = {
  navigation: SettingsNavigationProps
};

const Settings = (props: Props): JSX.Element => {
  return (
    <View style={styles.settingsContainer}>
      
      <SettingsButton 
        name="Profile Details" 
        onPress={() => {
          props.navigation.navigate('ProfileDetails');
        }}
      />
      <SettingsButton 
        name="Notification Settings" 
        onPress={() => {
          return;
        }}
      />
      <SettingsButton 
        name="Security Settings" 
        onPress={() => {
          return;
        }}
      />
      <SettingsButton 
        name="Permissions" 
        onPress={() => {
          return;
        }}
      />
      <SettingsButton 
        name="Units of Measurement" 
        onPress={() => {
          return;
        }}
      />
      <Button 
        title="Sign out" 
        onPress={() => signOut()} 
        color={BLUE}
      />
    </View>
  );
};

type SettingsButtonProps = {
  name: string,
  onPress: (event: GestureResponderEvent) => void;
}

const SettingsButton = (props: SettingsButtonProps): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
    >
      <View style={styles.settingsNavigator}>
        <Text style={styles.settingsText}>{props.name}</Text>
        <Ionicons
          style={styles.settingsArrow}
          size={28}
          color='#ddd'
          name="arrow-forward"
        />
      </View>
    </TouchableOpacity>
  );
};

export default Settings;
