import React, {useEffect, useState} from 'react';
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
import { TextInput } from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps,
  route: RouteProp<{ params: { medication: MedicationItem } }, 'params'>
}

type Days = {
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
}

const AddMedicationInfo = ({navigation, route}: Props): JSX.Element => {
  const [ showTime, setShowTime ] = useState<boolean>(false);
  const [ timeOfDay, setTimeOfDay ] = useState<Date>(new Date());
  const [ doses, setDoses ] = useState<string>('');
  const [ supply, setSupply ] = useState<string>('');

  const [ showDate, setShowDate ] = useState<boolean>(false);
  const [ date, setDate ] = useState<Date>(new Date());

  const [ days, setDays ] = useState<Days>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const addTodo = () => {
    let todo;
    if (supply != '' && doses != '') {
      todo = {
        days: days,
        date: date,
        time: timeOfDay,
        supply: parseInt(supply),
        doses: parseInt(doses),
      };
    }

    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .update({
        todos: firestore.FieldValue.arrayUnion(todo)
      });
  };

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

  const displayDate = (date: Date): string => {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const monthStr = month < 10 ? '0' + month : month;
    const dayStr = day < 10 ? '0' + day : day;

    return `${dayStr}/${monthStr}/${year}`;
  };

  return (
    <View style={styles.addMedicationContainer}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>{renderName(route.params.medication.name)} - {route.params.medication.dosage_amount}{route.params.medication.dosage_units}</Text>
      </View>
      
      <Text style={styles.addMedicationTitle}>On which days are you to take {renderName(route.params.medication.brand_name)}?</Text>

      <View style={styles.radioButtonsContainer}>
        <RadioButton 
          text='M' 
          selected={days.monday} 
          onPress={() => {
            setDays({...days, monday: !days.monday});
          }}
        />
        <RadioButton 
          text='T' 
          selected={days.tuesday} 
          onPress={() => {
            setDays({...days, tuesday: !days.tuesday});
          }}
        />
        <RadioButton 
          text='W' 
          selected={days.wednesday} 
          onPress={() => {
            setDays({...days, wednesday: !days.wednesday});
          }}
        />
        <RadioButton 
          text='T' 
          selected={days.thursday} 
          onPress={() => {
            setDays({...days, thursday: !days.thursday});
          }}
        />
        <RadioButton 
          text='F' 
          selected={days.friday} 
          onPress={() => {
            setDays({...days, friday: !days.friday});
          }}
        />
        <RadioButton 
          text='S' 
          selected={days.saturday} 
          onPress={() => {
            setDays({...days, saturday: !days.saturday});
          }}
        />
        <RadioButton 
          text='S' 
          selected={days.sunday} 
          onPress={() => {
            setDays({...days, sunday: !days.sunday});
          }}
        />
      </View>

      <Text style={styles.addMedicationTitle}>What time of day are you to take {renderName(route.params.medication.brand_name)}?</Text>

      <TouchableOpacity
        onPress={() => {setShowTime(true);}}
        style={styles.addMedicationEntry}
      >
        <Text style={styles.addMedicationTimeText}>{displayTime(timeOfDay)}</Text>
      </TouchableOpacity>

      { (showTime &&
        <RNDateTimePicker
          testID="dateTimePicker"
          value={timeOfDay}
          mode='time'
          is24Hour={false}
          display='clock'
          onChange={
            (_, selectedDate) => {
              if (selectedDate) {
                setTimeOfDay(selectedDate);
              }
              setShowTime(false);
            }
          }
        />)
      }

      <Text style={styles.addMedicationTitle}>When will you stop taking {renderName(route.params.medication.brand_name)}?</Text>

      <TouchableOpacity
        onPress={() => {setShowDate(true);}}
        style={styles.addMedicationEntry}
      >
        <Text style={styles.addMedicationTimeText}>{displayDate(date)}</Text>
      </TouchableOpacity>

      { (showDate &&
        <RNDateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          is24Hour={false}
          display='calendar'
          onChange={
            (_, selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
              setShowDate(false);
            }
          }
        />)
      }

      <Text style={styles.addMedicationTitle}>How many doses of {renderName(route.params.medication.brand_name)} will you take?</Text>

      <TextInput
        style={styles.addMedicationEntry}
        keyboardType='numeric'
        value={doses}
        onChangeText={setDoses}
      />

      <Text style={styles.addMedicationTitle}>What is your current supply of {renderName(route.params.medication.brand_name)}?</Text>

      <TextInput
        style={styles.addMedicationEntry}
        keyboardType='numeric'
        value={supply}
        onChangeText={setSupply}
      />

      <View style={styles.infoButton}>
        <Button 
          title="Add Medication"
          onPress={() => {
            addTodo();
            navigation.navigate('Medications');
          }}
          color={RED}
        />
      </View>
    </View>
  );
};

type RadioProps = {
  text: string,
  selected: boolean,
  onPress: () => void,
}

const RadioButton = (props: RadioProps): JSX.Element => {
  return (
    <View>
      {props.selected &&
        <Text 
          style={styles.radioButtonDaySelected}
          onPress={props.onPress}
        >
          {props.text}
        </Text>
      }
      {!props.selected &&
        <Text 
          style={styles.radioButtonDay}
          onPress={props.onPress}  
        >
          {props.text}
        </Text>
      }
    </View>
    
  );
};

export default AddMedicationInfo;
