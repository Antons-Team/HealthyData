import React, {useState} from 'react';
import {
  Button,
  StyleProp,
  Text,
  TextStyle,
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
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {Days} from '../@types/Types';

import {displayTime, displayDate} from '../utils/Display';
import {addDays} from '../utils/Dates';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps,
  route: RouteProp<{ params: { medication: MedicationItem } }, 'params'>
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

  const [isInterval, setIsInterval] = useState(false);
  const [intervalDays, setIntervalDays] = useState('');
  const [intervalStartDate, setIntervalStartDate] = useState(new Date());

  const addTodo = () => {
    let refillDate;

    if (!isInterval) {
      if (supply != '' && doses != '') {
        const daysPerWeek = Object.values(days).filter(Boolean).length;
        refillDate = new Date();
        refillDate = addDays(parseInt(supply) / daysPerWeek, refillDate);
        let dayOfWeek = 0;
        let count = parseInt(supply) % daysPerWeek;
        for (let i = 0; i < 7; ++i) {
          if (Object.values(days)) {
            --count;
          }
          if (count == 0) {
            dayOfWeek = i;
            break;
          }
        }
        refillDate = addDays(dayOfWeek, refillDate);

        switch (parseInt(supply) % daysPerWeek) {
        case 0:
          return;
        }
      } 
    } else {
      const startDate = new Date(intervalStartDate);
      startDate.setHours(intervalStartDate.getHours(), intervalStartDate.getMinutes());
      refillDate = addDays(parseInt(intervalDays) * parseInt(supply), startDate);
    }

    const todo = {
      id: `${date.toString()}${timeOfDay.toString()}${parseInt(doses)*3}${parseInt(supply)*5}${genericName}`,//create a unique hashcode
      today: new Date(),
      days: isInterval ? null: days,
      intervalDays: isInterval ? {interval: intervalDays, startingDate: intervalStartDate} : null,
      date: date,
      time: timeOfDay,
      refillDate: refillDate,
      supply: parseInt(supply),
      doses: parseInt(doses),
      medication: route.params.medication,
    };

    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('todos')
      .add(todo);
    // .update({
    //   todos: firestore.FieldValue.arrayUnion(todo)
    // });
  };

  const genericName = renderName(route.params.medication.genericName);

  return (
    <View style={styles.addMedicationContainer}>
      <ScrollView>
        <View style={styles.infoHeader}>
          <Text style={styles.infoHeaderText}>{genericName}</Text>
        </View>
        <Text style={styles.addMedicationTitle}>Do you take {genericName} on the same days every week?</Text>
        <View style={styles.radioButtonsContainer}>
          <RadioButton
            text="YES"
            selected={!isInterval}
            selectedStyle={[styles.toggleIntervalButton, styles.buttonSelectedColor]}
            unselectedStyle={[styles.toggleIntervalButton, styles.buttonUnselectedColor]}
            onPress={() => {setIsInterval(false);}}/>

          <RadioButton
            text="NO"
            selected={isInterval}
            selectedStyle={[styles.toggleIntervalButton, styles.buttonSelectedColor]}
            unselectedStyle={[styles.toggleIntervalButton, styles.buttonUnselectedColor]}
            onPress={() => {setIsInterval(true);}}/>
        </View>
        { !isInterval &&
        <><Text style={styles.addMedicationTitle}>On which days are you to take {genericName}?</Text><View style={styles.radioButtonsContainer}>
          <RadioButton
            text='M'
            selected={days.monday}
            onPress={() => {
              setDays({ ...days, monday: !days.monday });
            } } />
          <RadioButton
            text='T'
            selected={days.tuesday}
            onPress={() => {
              setDays({ ...days, tuesday: !days.tuesday });
            } } />
          <RadioButton
            text='W'
            selected={days.wednesday}
            onPress={() => {
              setDays({ ...days, wednesday: !days.wednesday });
            } } />
          <RadioButton
            text='T'
            selected={days.thursday}
            onPress={() => {
              setDays({ ...days, thursday: !days.thursday });
            } } />
          <RadioButton
            text='F'
            selected={days.friday}
            onPress={() => {
              setDays({ ...days, friday: !days.friday });
            } } />
          <RadioButton
            text='S'
            selected={days.saturday}
            onPress={() => {
              setDays({ ...days, saturday: !days.saturday });
            } } />
          <RadioButton
            text='S'
            selected={days.sunday}
            onPress={() => {
              setDays({ ...days, sunday: !days.sunday });
            } } />
        </View></>
        }

        { 
          isInterval && 
        <>
          <Text style={styles.addMedicationTitle}>
            How often do you take {genericName}?
          </Text>
          <View style={styles.row}>
            <Text style={styles.addMedicationTitle}>
            Once every
            </Text>
            <TextInput
              style={styles.intervalTextEntry}
              keyboardType='numeric'
              value={intervalDays}
              onChangeText={setIntervalDays}
            />
            <Text style={styles.addMedicationTitle}>
              days
            </Text>
          </View>

          <Text style={styles.addMedicationTitle}>When will you start taking {genericName}?</Text>

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
                  setIntervalStartDate(selectedDate);
                }
                setShowDate(false);
              }
            }
          />)
          }

        </>

        }
        <Text style={styles.addMedicationTitle}>What time of day are you to take {genericName}?</Text>

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

        <Text style={styles.addMedicationTitle}>When will you stop taking {genericName}?</Text>

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

        <Text style={styles.addMedicationTitle}>How many doses of {genericName} will you take?</Text>

        <TextInput
          style={styles.addMedicationEntry}
          keyboardType='numeric'
          value={doses}
          onChangeText={setDoses}
        />

        <Text style={styles.addMedicationTitle}>What is your current supply of {genericName}?</Text>

        <TextInput
          style={styles.addMedicationEntry}
          keyboardType='numeric'
          value={supply}
          onChangeText={setSupply}
        />
      </ScrollView>

      <View style={styles.infoButton}>
        <Button 
          title="Add Medication"
          disabled={doses === '' || supply === '' || (isInterval && intervalDays === '')}
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
  selectedStyle?: StyleProp<TextStyle>,
  unselectedStyle?: StyleProp<TextStyle>,
}

const RadioButton = ({ 
  selectedStyle=[styles.radioButtonDay, styles.buttonSelectedColor],
  unselectedStyle=[styles.radioButtonDay, styles.buttonUnselectedColor], 
  ...props}: RadioProps): JSX.Element => {
  return (
    <View>
      {props.selected &&
        <Text 
          style={selectedStyle}
          onPress={props.onPress}
        >
          {props.text}
        </Text>
      }
      {!props.selected &&
        <Text 
          style={unselectedStyle}
          onPress={props.onPress}  
        >
          {props.text}
        </Text>
      }
    </View>
    
  );
};

export default AddMedicationInfo;
