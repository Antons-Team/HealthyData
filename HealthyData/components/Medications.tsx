import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import { MedicationItem } from '../@types/Schema';

import {styles} from '../style/Styles';
import {RED} from '../style/Colours';

import { renderName } from '../utils/Display';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firestore from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { MedicationsStackParamList } from '../@types/MedicationsStackParamList';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps
};

const Medications = (props: Props): JSX.Element => {
  const [ medications, setMedications ] = useState<Array<MedicationItem>>([]);
  const [ filter, setFilter ] = useState<string>('');

  const ref = firestore().collection('medications');

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<MedicationItem> = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as MedicationItem;

        if (data.name.includes(filter.toLowerCase()) || 
              data.brand_name.includes(filter.toLowerCase())) {
          temp.push(data);
        }
      });
      setMedications(temp);
    });
  }, [filter]);

  const renderItem: ListRenderItem<MedicationItem> = ({ item }) => (
    <View style={styles.medicationItem}>
      <View style={styles.medicationText}>
        <Text 
          style={styles.medicationTop}
        >
          {renderName(item.brand_name)} - {item.dosage_amount}{item.dosage_units}
        </Text>
        <Text style={styles.medicationBottom}>{renderName(item.name)}</Text>
      </View>
      <View style={styles.medicationAdd}>
        <Ionicons 
          name='add'
          size={50}
          onPress={() => {
            props.navigation.navigate('AddMedication', {
              medication: item
            });
          }}
          color={RED}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.addContainer}>
      <TextInput
        placeholder="Search"
        value={filter}
        onChangeText={setFilter}
        style={styles.searchBar}
      />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={medications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default Medications;
