import React, {useEffect, useState} from 'react';
import {
  Button,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MedicationItem } from '../@types/Schema';

import {styles} from '../style/Styles';
import {RED} from '../style/Colours';

import {renderName} from '../utils/Display';
import { StackNavigationProp } from '@react-navigation/stack';
import { MedicationsStackParamList } from '../@types/MedicationsStackParamList';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps,
  route: RouteProp<{ params: { medication: MedicationItem } }, 'params'>
}

const AddMedication = ({navigation, route}: Props): JSX.Element => {
  return (
    <View style={styles.infoContainer}>
      <ScrollView>
        <View style={styles.infoHeader}>
          <Text style={styles.infoHeaderText}>{renderName(route.params.medication.name)} - {route.params.medication.dosage_amount}{route.params.medication.dosage_units}</Text>
        </View>

        <Text style={styles.infoTitle}>Summary</Text>
        <Text style={styles.infoParagraph}>{route.params.medication.description}</Text>

        <Text style={styles.infoTitle}>Warnings</Text>
        <Text style={styles.infoParagraph}>{route.params.medication.warnings == null ? 'No warnings.' : route.params.medication.warnings}</Text>

        <Text style={styles.infoTitle}>Side Effects</Text>
        <Text style={styles.infoParagraph}>{route.params.medication.side_effects == null ? 'No side effects.' : route.params.medication.side_effects}</Text>
      </ScrollView>

      <View style={styles.infoButton}>
        <Button 
          title="Add Medication"
          onPress={() => {
            navigation.navigate('AddMedicationInfo');
          }}
          color={RED}
        />
      </View>
    </View>
  );
};

export default AddMedication;
