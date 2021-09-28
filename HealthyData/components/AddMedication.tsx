import React from 'react';
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
  const medication  = route.params.medication;
  const sideEffectNames = medication.sideEffects.map(sideEffect => sideEffect.name);
  // TODO present in a better way
  return (
    <View style={styles.infoContainer}>
      <ScrollView>
        <View style={styles.infoHeader}>
          <Text style={styles.infoHeaderText}>{renderName(route.params.medication.genericName)}</Text>
        </View>

        <Text style={styles.infoTitle}>Summary</Text>
        {
          medication.description.map(description => {
            return <Text key={description} style={styles.infoParagraph}>{description}</Text>;
          })
        }
        <Text style={styles.infoTitle}>Brand Names</Text>
        { medication.brandNames.length == 0 ? 
          <Text style={styles.infoParagraph}>No brand names</Text> 
          :
          medication.brandNames.map(brandName => (
            <Text key={brandName} style={styles.infoParagraph}>{brandName}</Text>
          )) 
        }

        <Text style={styles.infoTitle}>Side Effects</Text>
        { sideEffectNames.length == 0 ? 
          <Text style={styles.infoParagraph}>No side effects</Text> 
          :
          sideEffectNames.map(sideEffectName => (
            <Text key={sideEffectName} style={styles.infoParagraph}>{sideEffectName}</Text>
          )) 
        }
        <Text style={styles.infoTitle}>Indications</Text>
        { medication.indications.length == 0 ? 
          <Text style={styles.infoParagraph}>No indications </Text> 
          :
          medication.indications.map(indication => (
            <Text key={indication} style={styles.infoParagraph}>{indication}</Text>
          )) 
        }
      </ScrollView>

      <View style={styles.infoButton}>
        <Button 
          title="Add Medication"
          onPress={() => {
            navigation.navigate('AddMedicationInfo', {
              medication: route.params.medication
            });
          }}
          color={RED}
        />
      </View>
    </View>
  );
};

export default AddMedication;
