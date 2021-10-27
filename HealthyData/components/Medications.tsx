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
import {DARK_GRAY, RED} from '../style/Colours';

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

/**
 * @returns component for empty search results
 */
const SearchEmpty = () => {
  return (
    <View style={{paddingTop: 50}}>
      <Ionicons
        style={{margin: 0, paddingBottom: 10, alignSelf: 'center'}}
        name="search-outline"
        size={70}
        color={DARK_GRAY}
      />
      <Text style={{color: DARK_GRAY, textAlign: 'center', fontSize: 16}}>
        Search for medications by name
      </Text>
    </View>
  );
};

/**
 * @returns list component of all search results
 */
const Medications = (props: Props): JSX.Element => {
  // search input entered by the user
  const [filter, setFilter] = useState<string>('');

  // medication results
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
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#bbb',

            padding: 10,
            marginVertical: 2,
            marginHorizontal: 5,
          },
        ]}
        onPress={() => {
          props.navigation.navigate('AddMedication', {
            medication: item.drug,
          });
        }}>
        <View style={{}}>
          <Text ellipsizeMode="tail" style={styles.medicationTop}>
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
        autoFocus={true}
      />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={drugs}
          renderItem={renderItem}
          keyExtractor={(item, i) => item.matchingName + i}
          ListEmptyComponent={SearchEmpty}
        />
      </SafeAreaView>
    </View>
  );
};

export default Medications;
