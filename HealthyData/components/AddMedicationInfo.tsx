import React, {useState} from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import {styles} from '../style/Styles';
import {RED} from '../style/Colours';
import { StackNavigationProp } from '@react-navigation/stack';
import { MedicationsStackParamList } from '../@types/MedicationsStackParamList';
import { RouteProp } from '@react-navigation/native';
import { MedicationItem } from '../@types/Schema';
import {renderName} from '../utils/Display';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps,
  route: RouteProp<{ params: { medication: MedicationItem } }, 'params'>
}

const AddMedicationInfo = ({route}: Props): JSX.Element => {
  const [ show, setShow ] = useState<boolean>(false);
  const [ timeOfDay, setTimeOfDay ] = useState<Date>(new Date());

  const displayTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const am = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours ? hours : 12;
    const hoursStr = hours < 10 ? '0' + hours : hours;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hoursStr}:${minutesStr} ${am}`;
  };

  return (
    <View style={styles.addMedicationContainer}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>{renderName(route.params.medication.name)} - {route.params.medication.dosage_amount}{route.params.medication.dosage_units}</Text>
      </View>
      <Text style={styles.addMedicationTitle}>What time of day are you to take {renderName(route.params.medication.brand_name)}?</Text>

      <TouchableOpacity
        onPress={() => {setShow(true);}}
        style={styles.addMedicationEntry}
      >
        <Text style={styles.addMedicationTimeText}>{displayTime(timeOfDay)}</Text>
      </TouchableOpacity>

      { (show &&
        <RNDateTimePicker
          testID="dateTimePicker"
          value={timeOfDay}
          mode='time'
          is24Hour={false}
          display='clock'
          onChange={
            (event, selectedDate) => {
              if (selectedDate) {
                setTimeOfDay(selectedDate);
              }
              setShow(false);
            }
          }
        />)
      }

      <View style={styles.infoButton}>
        <Button 
          title="Add Medication"
          onPress={() => {
            return;
          }}
          color={RED}
        />
      </View>
    </View>
  );
};

export default AddMedicationInfo;
