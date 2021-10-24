/* eslint-disable react/display-name */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Medications from '../components/Medications';
import AddMedication from '../components/AddMedication';

import Header from '../components/Header';
import {styles} from '../style/Styles';
import {MedicationsStackParamList} from '../@types/MedicationsStackParamList';
import MedicationsTaking from '../components/MedicationsTaking';

const Stack = createStackNavigator<MedicationsStackParamList>();

const MedicationsNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="MedicationsTaking"
      screenOptions={() => ({
        headerTitle: () => <Header />,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      })}>
      <Stack.Screen
        name="Medications"
        component={Medications}
        options={{animationEnabled: false}}
      />
      <Stack.Screen name="AddMedication" component={AddMedication} />
      {/* <Stack.Screen name="AddMedicationInfo" component={AddMedicationInfo} /> */}
      <Stack.Screen name="MedicationsTaking" component={MedicationsTaking} />
    </Stack.Navigator>
  );
};

export default MedicationsNavigator;
