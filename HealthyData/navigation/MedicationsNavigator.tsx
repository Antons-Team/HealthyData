/* eslint-disable react/display-name */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Medications from '../components/Medications';
import AddMedication from '../components/AddMedication';

import Header from '../components/Header';
import { styles } from '../style/Styles';
import { MedicationsStackParamList } from '../@types/MedicationsStackParamList';
import AddMedicationInfo from '../components/AddMedicationInfo';

const Stack = createStackNavigator<MedicationsStackParamList>();

const MedicationsNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator 
      initialRouteName="Medications"
      screenOptions={() => ({
        headerTitle: () => <Header />,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Stack.Screen name="Medications" component={Medications} />
      <Stack.Screen name="AddMedication" component={AddMedication} />
      <Stack.Screen name="AddMedicationInfo" component={AddMedicationInfo} />
    </Stack.Navigator>
  );
};

export default MedicationsNavigator;
