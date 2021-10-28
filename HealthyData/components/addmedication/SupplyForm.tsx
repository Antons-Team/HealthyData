import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {firestore, auth} from 'react-native-firebase';
import {MedicationItem, TodoItem} from '../../@types/Schema';
import {Days} from '../../@types/Types';
import {scheduleNotifications} from '../../services/notifications';
import {styles} from '../../style/Styles';
import {addDays} from '../../utils/Dates';
import {renderName, numberOnlyPinPad} from '../../utils/Display';
import {FormParamsList, NavigationButtons} from './AddMedicationModal';

/**
 * @returns adds a new medicaiton to a users schedule
 */
const addTodo = async ({
  medication,
  isInterval,
  intervalDays,
  days,
  startDate,
  endDate,
  time,
  doses,
  supply,
}: {
  // medication to be added
  medication: MedicationItem;
  isInterval: boolean;
  intervalDays: number;
  days: Days;
  startDate: number;
  endDate: number;
  time: number;
  doses: number;
  supply: number;
}) => {
  let refillDate;

  const intervalStartDate = new Date(startDate);
  if (!isInterval) {
    const daysPerWeek = Object.values(days).filter(Boolean).length;
    refillDate = new Date();
    refillDate = addDays(supply / daysPerWeek, refillDate);
    let dayOfWeek = 0;
    let count = supply % daysPerWeek;
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
  } else {
    const startDate1 = new Date(intervalStartDate);
    startDate1.setHours(
      intervalStartDate.getHours(),
      intervalStartDate.getMinutes(),
    );
    refillDate = addDays(intervalDays * supply, startDate1);
  }

  const today = new Date(startDate);
  const timeOfDay = new Date(time);
  const date = new Date(endDate);
  today.setSeconds(0, 0);
  timeOfDay.setSeconds(0, 0);
  refillDate?.setSeconds(0, 0);

  const todo = {
    today: today,
    days: isInterval ? null : days,
    intervalDays: isInterval
      ? {interval: intervalDays, startingDate: intervalStartDate}
      : null,
    date: date,
    time: timeOfDay,
    refillDate: refillDate,
    supply: supply,
    doses: doses,
    medication: medication,
    medicationId: medication.id,
  };

  if (todo.medication.sideEffects === undefined) {
    todo.medication.sideEffects = [];
  }

  return firestore()
    .collection('users')
    .doc(auth().currentUser?.uid)
    .collection('todos')
    .doc(todo.medication.genericName)
    .set(todo)
    .then(() => {
      firestore()
        .doc(`users/${auth().currentUser?.uid}/todos/${medication.genericName}`)
        .get()
        .then(doc => {
          const added = {...doc.data(), id: doc.id} as TodoItem;

          scheduleNotifications(added);
        });
    });
};

/**
 * @returns Form to enter the number of doses and supply
 */
export const SupplyForm = ({
  navigation,
  route,
}: {
  navigation: BottomTabNavigationProp<FormParamsList, 'SupplyForm'>;
  route: RouteProp<
    {
      params: {
        medication: MedicationItem;
        isInterval: boolean;
        intervalDays: number;
        days: Days;
        startDate: number;
        endDate: number;
        time: number;
      };
    },
    'params'
  >;
}) => {
  const medication = route.params.medication;

  const [doses, setDoses] = useState('1');
  const [supply, setSupply] = useState('1');

  const [attempted, setAttempted] = useState(false);
  return (
    <View style={styles.formContainer}>
      <View style={{padding: 10}}>
        <View
          style={[
            styles.questionContainer,
            attempted && doses === '' ? {borderColor: 'red'} : {},
          ]}>
          <Text style={[styles.addMedicationTitle]}>
            How many doses of {renderName(medication.genericName)} will you
            take?
          </Text>

          <View style={{alignSelf: 'center'}}>
            <View style={[styles.row, {alignItems: 'center'}]}>
              <TextInput
                style={styles.textInputBlue}
                value={doses}
                onChangeText={text => {
                  setDoses(numberOnlyPinPad(text));
                }}
                keyboardType="number-pad"
              />
              <Text
                style={[
                  styles.addMedicationTitle,
                  {textAlignVertical: 'center'},
                ]}>
                doses
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.questionContainer,
            attempted && supply === '' ? {borderColor: 'red'} : {},
          ]}>
          <Text style={[styles.addMedicationTitle]}>
            What is your current supply of {renderName(medication.genericName)}?
          </Text>
          <View style={{alignSelf: 'center'}}>
            <View style={[styles.row, {alignItems: 'center'}]}>
              <TextInput
                style={styles.textInputBlue}
                value={supply}
                onChangeText={text => {
                  setSupply(numberOnlyPinPad(text));
                }}
                keyboardType="number-pad"
              />
              <Text
                style={[
                  styles.addMedicationTitle,
                  {textAlignVertical: 'center'},
                ]}>
                doses
              </Text>
            </View>
          </View>
        </View>
      </View>
      <NavigationButtons
        onNext={() => {
          if (doses !== '' && supply !== '') {
            addTodo({
              ...route.params,
              doses: parseInt(doses),
              supply: parseInt(supply),
            })
              .then(() => {
                navigation.navigate('DoneScreen', {medication});
              })
              .catch(console.error);
          } else {
            setAttempted(true);
          }
        }}
        onPrev={() => {
          navigation.navigate('TimeForm', {...route.params});
        }}
        showPrev={true}
      />
    </View>
  );
};
