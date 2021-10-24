import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {MedicationItem} from '../@types/Schema';

import {styles} from '../style/Styles';
import {DARK_GRAY, GREEN, ORANGE, RED, WHITE, YELLOW} from '../style/Colours';

import {renderName} from '../utils/Display';
import {StackNavigationProp} from '@react-navigation/stack';
import {MedicationsStackParamList} from '../@types/MedicationsStackParamList';
import {getIsTaking} from '../services/calendar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modal';
import { AddMedicationModal } from './AddMedicationModal';

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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getIsTaking(medication).then(res => {
      return setIsTaking(res);
    });
  }, []);

  const Frequency = ({freq}: any) => {
    let name = 'Frequent';
    let color = ORANGE;

    if (freq < 0.1) {
      name = 'Rare';
      color = GREEN;
    } else if (freq < 0.5) {
      name = 'Infrequent';
      color = YELLOW;
    }
    return (
      <Text
        style={[
          styles.circleTextHighlight,
          {
            backgroundColor: color,
            borderRadius: 16,
            fontFamily: 'Roboto-Regular',
            padding: 5,
          },
        ]}>
        {name}
      </Text>
    );
  };

  // TODO present in a better way
  return (
    <View style={[styles.infoContainer]}>
      <View style={styles.infoHeader}>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={styles.infoHeaderText}>
          {renderName(route.params.medication.genericName)}
        </Text>
      </View>
      <View
        style={{
          marginVertical: 20,
        }}>
        <Text style={[styles.infoParagraph, {paddingHorizontal: 15, color: showModal ? RED : WHITE}]}>
          {medication.description[0]}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: WHITE,
          flex: 1,
          paddingTop: 20,
        }}>
        <ScrollView
          stickyHeaderIndices={[0]}
          contentContainerStyle={{paddingBottom: 60, flexGrow: 1}}>
          <View>
            <Text style={[styles.infoTitle]}>Side Effects</Text>
          </View>
          {sideEffectNames.length == 0 ? (
            <View style={{padding: 30}}>
              <Ionicons
                style={{margin: 0, paddingBottom: 10, alignSelf: 'center'}}
                name="clipboard-outline"
                size={40}
                color={DARK_GRAY}
              />
              <Text
                style={{color: DARK_GRAY, textAlign: 'center', fontSize: 16}}>
                No side effects listed
              </Text>
            </View>
          ) : (
            medication.sideEffects.map(sideEffect => {
              return (
                <View
                  key={sideEffect.name}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    paddingVertical: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: 16,
                      // fontWeight: 'bold',
                    }}>
                    {sideEffect.name}
                  </Text>
                  <Frequency freq={sideEffect.freq} />
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
      {!isTaking && (
        <TouchableOpacity
          style={[
            {
              backgroundColor: RED,
              alignSelf: 'center',
              width: 200,
              position: 'absolute',
              bottom: 5,
              paddingHorizontal: 20,
              borderRadius: 100,
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            styles.row,
          ]}
          onPress={() => {
            // navigation.navigate('AddMedicationInfo', {
            //   medication: route.params.medication,
            // });
            setShowModal(true);
          }}>
          <Ionicons
            style={{margin: 0, padding: 0}}
            name="add"
            size={30}
            color={WHITE}
          />
          <Text style={{color: WHITE, fontSize: 17, paddingVertical: 18}}>
            Add Medication
          </Text>
        </TouchableOpacity>
      )}
      <Modal
        isVisible={showModal}
        onBackButtonPress={() => setShowModal(false)}
        backdropOpacity={0}
        onBackdropPress={() => setShowModal(false)} 
        style={{justifyContent: 'flex-end', margin:0}}

        >
          <AddMedicationModal medication={medication}/>
      </Modal>
    </View>
  );
};

export default AddMedication;
