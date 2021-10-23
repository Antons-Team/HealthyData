import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {MedicationItem} from '../@types/Schema';

import {styles} from '../style/Styles';
import {RED} from '../style/Colours';

import {renderName} from '../utils/Display';
import {StackNavigationProp} from '@react-navigation/stack';
import {MedicationsStackParamList} from '../@types/MedicationsStackParamList';
import {getIsTaking} from '../services/calendar';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps;
  route: RouteProp<{params: {medication: MedicationItem}}, 'params'>;
};

const AddMedication = ({navigation, route}: Props): JSX.Element => {
  const medication = route.params.medication;
  const sideEffectNames =
    medication.sideEffects !== undefined
      ? medication.sideEffects.map(sideEffect => sideEffect.name)
      : [];


  const [isTaking, setIsTaking] = useState(false);

  useEffect(() => {
    getIsTaking(medication).then(res => {
      return setIsTaking(res);
    });
  }, []);

  const Frequency = ({freq}) => {
    let name = 'Frequent';
    let color = 'orange';

    if (freq < 0.01) {
      name = 'Rare';
      color = 'green';
    } else if (freq < 0.1) {
      name = 'Infrequent';
      color = 'yellow';
    }
    return (
      <Text
        style={{
          backgroundColor: color,
          borderRadius: 16,
          fontFamily: 'Roboto-Regular',
          padding: 5,
          paddingHorizontal: 10,
        }}>
        {name}
      </Text>
    );
  };

  // TODO present in a better way
  return (
    <View style={styles.infoContainer}>
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={{paddingBottom: 60}}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoHeaderText}>
            {renderName(route.params.medication.genericName)}
          </Text>
          {isTaking && (
            <Text style={styles.infoHeaderSubtitle}>
              {' '}
              You are currently taking this medication{' '}
            </Text>
          )}
        </View>

        <Text style={styles.infoTitle}>Summary</Text>
        {/* <Text style={styles.infoTitle}>Summary</Text> */}
        <Text style={[styles.infoParagraph, {paddingHorizontal: 15}]}>
          {medication.description[0]}
        </Text>
        {/* {
          medication.description.map(description => {
            return <Text key={description} style={styles.infoParagraph}>{description}</Text>;
          })
        } */}
        {/* <Text style={styles.infoTitle}>Brand Names</Text>
        { medication.brandNames.length == 0 ? 
          <Text style={styles.infoParagraph}>No brand names</Text> 
          :
          medication.brandNames.map(brandName => (
            <Text key={brandName} style={styles.infoParagraph}>{brandName}</Text>
          )) 
        } */}

        <Text style={styles.infoTitle}>Side Effects</Text>
        {
          sideEffectNames.length == 0 ? (
            <Text style={styles.infoParagraph}>No side effects</Text>
          ) : (
            medication.sideEffects.map(sideEffect => {
              return (
                <View
                  key={sideEffect.name}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    paddingHorizontal: 20,
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {sideEffect.name}{' '}
                  </Text>
                  <Frequency freq={sideEffect.freq} />
                  {/* <Text key={sideEffect.name} style={styles.infoParagraph}>{sideEffect.name} {sideEffect.freq}</Text> */}
                </View>
              );
            })
          )
          // sideEffectNames.map(sideEffectName => (
          //   <Text key={sideEffectName} style={styles.infoParagraph}>{sideEffectName}</Text>
          // ))
        }
        {/* <Text style={styles.infoTitle}>Indications</Text>
        { medication.indications.length == 0 ? 
          <Text style={styles.infoParagraph}>No indications </Text> 
          :
          medication.indications.map(indication => (
            <Text key={indication} style={styles.infoParagraph}>{indication}</Text>
          )) 
        } */}
      </ScrollView>
      {!isTaking && (
        <View style={styles.infoButton}>
          <Button
            title="Add Medication"
            onPress={() => {
              navigation.navigate('AddMedicationInfo', {
                medication: route.params.medication,
              });
            }}
            color={RED}
          />
        </View>
      )}
    </View>
  );
};

export default AddMedication;
