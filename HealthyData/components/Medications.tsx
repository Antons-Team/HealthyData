import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import {MedicationItem} from '../@types/Schema';

import {styles} from '../style/Styles';
import {RED} from '../style/Colours';

import {renderName} from '../utils/Display';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {TextInput} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {MedicationsStackParamList} from '../@types/MedicationsStackParamList';
import {searchDrugs} from '../services/search';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps;
};

type MedicationSearchItem = {
  matchingName: string;
  drug: MedicationItem;
};

const Medications = (props: Props): JSX.Element => {
  const [filter, setFilter] = useState<string>('');

  const [drugs, setDrugs] = useState<Array<MedicationSearchItem>>([]);

  const matchingLowercase = (name: string) => {
    return name.toLowerCase().startsWith(filter.toLowerCase());
  };
  const handleSearch = () => {
    if (filter == '') {
      return;
    }

    searchDrugs(filter).then(drugs => {
      const searchItems = new Array<MedicationSearchItem>();

      for (const drug of drugs) {
        if (matchingLowercase(drug.genericName)) {
          searchItems.push({matchingName: drug.genericName, drug});
        }

        for (const name of drug.brandNames) {
          if (matchingLowercase(name)) {
            searchItems.push({matchingName: name, drug});
          }
        }
      }
      setDrugs(searchItems);
    });
  };

  useEffect(() => {
    handleSearch();
  }, [filter]);

  const renderItem: ListRenderItem<MedicationSearchItem> = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.medicationItem}
        onPress={() => {
          props.navigation.navigate('AddMedication', {
            medication: item.drug,
          });
        }}>
        <View style={styles.medicationText}>
          <Text style={styles.medicationTop}>
            {renderName(item.matchingName || '')}
          </Text>
          <Text style={styles.medicationBottom}>
            {renderName(item.drug.genericName)}
          </Text>
        </View>
        <View style={styles.medicationAdd}>
          <Ionicons name="add" size={50} color={RED} />
        </View>
      </TouchableOpacity>
    );
  };

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
          data={drugs}
          renderItem={renderItem}
          keyExtractor={(item, i) => item.matchingName + i}
        />
      </SafeAreaView>
    </View>
  );
};

export default Medications;
