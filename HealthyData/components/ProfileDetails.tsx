import React from 'react';
import {useState} from 'react';
import {KeyboardTypeOptions} from 'react-native';
import {Button, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {RED} from '../style/Colours';
import {styles} from '../style/Styles';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {SettingsStackParamList} from '../@types/SettingsStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect} from 'react';

type SettingsNavigationProps = StackNavigationProp<
  SettingsStackParamList,
  'Settings'
>;

type Props = {
  navigation: SettingsNavigationProps;
};

const ProfileDetails = (props: Props): JSX.Element => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  // country
  // state

  const updateDetails = () => {
    firestore().collection('users').doc(auth().currentUser?.uid).update({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });
  };

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        const data = documentSnapshot.data();
        if (data) {
          if (data.firstName) {
            setFirstName(data.firstName);
          }
          if (data.lastName) {
            setLastName(data.lastName);
          }
          if (data.phoneNumber) {
            setPhoneNumber(data.phoneNumber);
          }
        }
      });
  }, []);

  return (
    <View style={styles.profileDetailsContainer}>
      <DetailsEntry
        info={firstName}
        setInfo={setFirstName}
        title="First Name"
        inputType="default"
      />
      <DetailsEntry
        info={lastName}
        setInfo={setLastName}
        title="Last Name"
        inputType="default"
      />
      <DetailsEntry
        info={phoneNumber}
        setInfo={setPhoneNumber}
        title="Phone Number"
        inputType="numeric"
      />

      <View style={styles.infoButton}>
        <Button
          title="Update Details"
          onPress={() => {
            updateDetails();
            props.navigation.navigate('Settings');
          }}
          color={RED}
        />
      </View>
    </View>
  );
};

type EntryProps = {
  title: string;
  info: string;
  inputType: KeyboardTypeOptions;
  setInfo: React.Dispatch<React.SetStateAction<string>>;
};

const DetailsEntry = (props: EntryProps): JSX.Element => {
  return (
    <View>
      <Text style={styles.profileDetailsTitle}>{props.title}</Text>
      <TextInput
        style={styles.profileDetailsEntry}
        placeholder=""
        value={props.info}
        keyboardType={props.inputType}
        onChangeText={props.setInfo}
      />
    </View>
  );
};

export default ProfileDetails;
