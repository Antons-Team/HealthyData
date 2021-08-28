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

import firestore from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';

const Medications = (): JSX.Element => {
  const [ medications, setMedications ] = useState<Array<MedicationItem>>([]);
  const [ filter, setFilter ] = useState<string>('');

  const ref = firestore().collection('medications');

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<MedicationItem> = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as MedicationItem;

        if (data.name.includes(filter) || data.brand_name.includes(filter)) {
          temp.push(data);
        }
      });
      setMedications(temp);
    });
  }, [filter]);

  const renderItem: ListRenderItem<MedicationItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.medicationTop}>{item.name} - {item.dosage_amount}{item.dosage_units}</Text>
    </View>
  );

  return (
    <View style={styles.homeContainer}>
      <TextInput
        placeholder="Search"
        value={filter}
        onChangeText={setFilter}
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
