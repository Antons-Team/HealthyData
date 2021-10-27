import {
  numberTypeAnnotation,
  PROPERTY_TYPES,
  stringLiteral,
} from '@babel/types';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Button,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MedicationItem, TodoItem} from '../@types/Schema';
import {Days} from '../@types/Types';
import {BLUE, RED, WHITE} from '../style/Colours';
import {styles} from '../style/Styles';
import {addDays, daysOfTheWeek} from '../utils/Dates';
import {displayTime, numberOnlyPinPad, renderName} from '../utils/Display';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationActions} from 'react-navigation';
import {scheduleNotifications} from '../services/notifications';

type RadioProps = {
  text: string;
  selected: boolean;
  onPress: () => void;
  selectedStyle?: StyleProp<TextStyle>;
  unselectedStyle?: StyleProp<TextStyle>;
};

const SelectInterval = ({
  medication,
  intervalDays,
  setIntervalDays,
  attempted,
  setAttempted,
}: {
  medication: MedicationItem;
  intervalDays: string;
  setIntervalDays: React.Dispatch<React.SetStateAction<string>>;
  attempted: boolean;
  setAttempted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View
      style={[
        styles.questionContainer,
        attempted && intervalDays == '' ? {borderColor: 'red'} : {},
      ]}>
      <Text style={styles.addMedicationTitle}>
        How often do you take {renderName(medication.genericName)}?
      </Text>
      <View style={[styles.row, {alignItems: 'center'}]}>
        <Text
          style={[styles.addMedicationTitle, {textAlignVertical: 'center'}]}>
          Once every{' '}
        </Text>
        <TextInput
          style={styles.textInputBlue}
          keyboardType="number-pad"
          value={intervalDays}
          onChangeText={text => {
            if (attempted) {
              setAttempted(false);
            }
            return setIntervalDays(numberOnlyPinPad(text));
          }}
        />
        <Text
          style={[styles.addMedicationTitle, {textAlignVertical: 'center'}]}>
          {' '}
          days
        </Text>
      </View>
    </View>
  );
};

const RadioButton = ({
  selectedStyle = [styles.radioButtonDay, styles.buttonSelectedColor],
  unselectedStyle = [styles.radioButtonDay, styles.buttonUnselectedColor],
  ...props
}: RadioProps): JSX.Element => {
  return (
    <View>
      {props.selected && (
        <Text style={selectedStyle} onPress={props.onPress}>
          {props.text}
        </Text>
      )}
      {!props.selected && (
        <Text style={unselectedStyle} onPress={props.onPress}>
          {props.text}
        </Text>
      )}
    </View>
  );
};

const SelectDays = ({
  medication,
  days,
  setDays,
  attempted,
  setAttempted,
}: {
  medication: MedicationItem;
  days: Days;
  setDays: React.Dispatch<React.SetStateAction<Days>>;
  attempted: boolean;
  setAttempted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View
      style={[
        styles.questionContainer,
        attempted && !Object.values(days).includes(true)
          ? {borderColor: 'red'}
          : {},
      ]}>
      <Text style={styles.addMedicationTitle}>
        On which days are you to take {renderName(medication.genericName)}?
      </Text>
      <View style={styles.radioButtonsContainer}>
        {daysOfTheWeek.map((day, index) => {
          return (
            <RadioButton
              key={day}
              text={day[0].toUpperCase()}
              selected={days[day]}
              onPress={() => {
                if (attempted) {
                  setAttempted(false);
                }
                const newDays = {...days};
                newDays[day] = !days[day];
                setDays(newDays);
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

type FormParamsList = {
  DaysForm: {medication: MedicationItem};
  DateForm: {
    medication: MedicationItem;
    isInterval: boolean;
    intervalDays: number;
    days: Days;
  };
  TimeForm: {
    medication: MedicationItem;
    isInterval: boolean;
    intervalDays: number;
    days: Days;
    startDate: number;
    endDate: number;
  };
  SupplyForm: {
    medication: MedicationItem;
    isInterval: boolean;
    intervalDays: number;
    days: Days;
    startDate: number;
    endDate: number;
    time: number;
  };
  DoneScreen: {
    medication: MedicationItem;
  };
};

const DaysForm = ({
  navigation,
  route,
}: {
  navigation: BottomTabNavigationProp<FormParamsList, 'DaysForm'>;
  route: RouteProp<{params: {medication: MedicationItem}}, 'params'>;
}) => {
  const medication = route.params.medication;

  const [days, setDays] = useState<Days>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [isInterval, setIsInterval] = useState(false);
  const [intervalDays, setIntervalDays] = useState('1');

  const [attempted, setAttempted] = useState(false);

  const correct = isInterval
    ? intervalDays !== ''
    : Object.values(days).includes(true);

  return (
    <View style={styles.formContainer}>
      <View style={{padding: 10}}>
        <View style={styles.questionContainer}>
          <Text style={styles.addMedicationTitle}>
            Do you take {renderName(medication.genericName)} on the same days
            every week?
          </Text>
          <View style={[styles.row, styles.tabBarStyle, {paddingVertical: 10}]}>
            <TouchableOpacity
              style={[
                styles.halfButton,
                {
                  backgroundColor: isInterval ? WHITE : BLUE,
                },
              ]}
              onPressIn={() => setIsInterval(false)}>
              <Text
                style={[
                  styles.tabBarLabelStyle,
                  styles.textAlignCenter,
                  {color: isInterval ? 'gray' : WHITE},
                ]}>
                YES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.halfButton,
                {
                  backgroundColor: isInterval ? BLUE : WHITE,
                },
              ]}
              onPressIn={() => setIsInterval(true)}>
              <Text
                style={[
                  styles.tabBarLabelStyle,
                  styles.textAlignCenter,
                  {color: isInterval ? WHITE : 'gray'},
                ]}>
                NO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isInterval ? (
          <SelectInterval
            {...{
              medication,
              intervalDays,
              setIntervalDays,
              attempted,
              setAttempted,
            }}
          />
        ) : (
          <SelectDays
            {...{medication, days, setDays, attempted, setAttempted}}
          />
        )}
      </View>
      <NavigationButtons
        onNext={() => {
          if (correct) {
            navigation.navigate('DateForm', {
              medication,
              isInterval,
              intervalDays: Number.parseInt(intervalDays),
              days,
            });
          } else {
            setAttempted(true);
          }
        }}
        onPrev={() => {}}
        showPrev={false}
      />
    </View>
  );
};

const DatePicker = ({
  value,
  setValue,
  isSet,
  setIsSet,
  minDate,
  maxDate,
}: {
  value: Date;
  setValue: (value: Date) => void;
  isSet: boolean;
  setIsSet: (isSet: boolean) => void;
  minDate: Date | undefined;
  maxDate: Date | undefined;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.blueButton,
          styles.row,
          {
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: isSet ? WHITE : BLUE,
            borderWidth: 2,
            borderColor: BLUE,
          },
        ]}
        onPress={() => setShowPicker(true)}>
        <Ionicons
          style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
          name={isSet ? 'checkbox-outline' : 'calendar-outline'}
          size={20}
          color={isSet ? BLUE : WHITE}
        />
        {isSet ? (
          <Text style={[styles.buttonWhiteText, {color: BLUE}]}>
            {value.toDateString()}
          </Text>
        ) : (
          <Text style={[styles.buttonWhiteText]}>SELECT A DATE</Text>
        )}
      </TouchableOpacity>

      {showPicker && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={value}
          mode="date"
          is24Hour={false}
          display="calendar"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              setValue(selectedDate);
            }
            setShowPicker(false);
            setIsSet(true);
          }}
        />
      )}
    </View>
  );
};

const DateForm = ({
  navigation,
  route,
}: {
  navigation: BottomTabNavigationProp<FormParamsList, 'DateForm'>;
  route: RouteProp<
    {
      params: {
        medication: MedicationItem;
        isInterval: boolean;
        intervalDays: number;
        days: Days;
      };
    },
    'params'
  >;
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateSet, setStartDateSet] = useState(false);
  const [endDateSet, setEndDateSet] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const medication = route.params.medication;

  return (
    <View style={styles.formContainer}>
      <View style={{padding: 10}}>
        <View
          style={[
            styles.questionContainer,
            attempted && !startDateSet ? {borderColor: 'red'} : {},
          ]}>
          <Text style={styles.addMedicationTitle}>
            On which day will you start taking{' '}
            {renderName(medication.genericName)}?
          </Text>
          <DatePicker
            minDate={undefined}
            maxDate={endDateSet ? endDate : undefined}
            value={startDate}
            setValue={setStartDate}
            isSet={startDateSet}
            setIsSet={setStartDateSet}
          />
        </View>
        <View
          style={[
            styles.questionContainer,
            styles.questionContainer,
            attempted && !endDateSet ? {borderColor: 'red'} : {},
          ]}>
          <Text style={styles.addMedicationTitle}>
            On which day will you stop taking{' '}
            {renderName(medication.genericName)}?
          </Text>
          <DatePicker
            maxDate={undefined}
            minDate={startDateSet ? startDate : undefined}
            value={endDate}
            setValue={setEndDate}
            isSet={endDateSet}
            setIsSet={setEndDateSet}
          />
        </View>
      </View>

      <NavigationButtons
        onNext={() => {
          if (startDateSet && endDateSet) {
            navigation.navigate('TimeForm', {
              ...route.params,
              startDate: startDate.getTime(),
              endDate: endDate.getTime(),
            });
          } else {
            setAttempted(true);
          }
        }}
        onPrev={() => {
          navigation.navigate('DaysForm', {...route.params});
        }}
        showPrev={true}
      />
    </View>
  );
};

const TimeForm = ({
  navigation,
  route,
}: {
  navigation: BottomTabNavigationProp<FormParamsList, 'TimeForm'>;
  route: RouteProp<
    {
      params: {
        medication: MedicationItem;
        isInterval: boolean;
        intervalDays: number;
        days: Days;
        startDate: number;
        endDate: number;
      };
    },
    'params'
  >;
}) => {
  const medication = route.params.medication;
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(new Date());
  const [timeSet, setTimeSet] = useState(false);
  const [attempted, setAttempted] = useState(false);

  return (
    <View style={styles.formContainer}>
      <View style={{padding: 10}}>
        <View
          style={[
            styles.questionContainer,
            {marginTop: 30},
            attempted && !timeSet ? {borderColor: 'red'} : {},
          ]}>
          <Text style={[styles.addMedicationTitle]}>
            What time of day are you to take{' '}
            {renderName(medication.genericName)}?
          </Text>

          <TouchableOpacity
            onPress={() => {
              setShowTime(true);
            }}
            style={[
              styles.blueButton,
              styles.row,
              {
                alignSelf: 'center',
                margin: 40,
                alignItems: 'center',
                backgroundColor: timeSet ? WHITE : BLUE,
                borderWidth: 2,
                borderColor: BLUE,
              },
            ]}>
            <Ionicons
              style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
              name={timeSet ? 'checkbox-outline' : 'time-outline'}
              size={20}
              color={timeSet ? BLUE : WHITE}
            />
            {timeSet ? (
              <Text style={[styles.buttonWhiteText, {color: BLUE}]}>
                {displayTime(time)}
              </Text>
            ) : (
              <Text style={[styles.buttonWhiteText]}>SELECT A TIME</Text>
            )}
          </TouchableOpacity>

          {showTime && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={time}
              mode="time"
              is24Hour={false}
              display="clock"
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setTime(selectedDate);
                  setTimeSet(true);
                }
                setShowTime(false);
              }}
            />
          )}
        </View>
      </View>

      <NavigationButtons
        onNext={() => {
          if (timeSet) {
            navigation.navigate('SupplyForm', {
              ...route.params,
              time: time.getTime(),
            });
          } else {
            setAttempted(true);
          }
        }}
        onPrev={() => {
          navigation.navigate('DateForm', {...route.params});
        }}
        showPrev={true}
      />
    </View>
  );
};

const SupplyForm = ({
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

const DoneScreen = ({
  navigation,
  route,
}: {
  navigation: BottomTabNavigationProp<FormParamsList, 'DoneScreen'>;
  route: RouteProp<
    {
      params: {
        medication: MedicationItem;
      };
    },
    'params'
  >;
}) => {
  return (
    <View style={styles.formContainer}>
      <View style={{padding: 10}}>
        <Ionicons
          style={{margin: 0, paddingBottom: 10, alignSelf: 'center'}}
          name="checkmark-done-circle"
          size={100}
          color={BLUE}
        />
        <Text style={[styles.infoTitle, styles.textAlignCenter]}>
          {renderName(route.params.medication.genericName)} Added to Medications
        </Text>
        <TouchableOpacity
          onPress={() => navigation.getParent()?.navigate('Home')}
          style={{
            backgroundColor: RED,
            borderRadius: 30,
            paddingVertical: 10,
            paddingHorizontal: 70,
            alignSelf: 'center',
            marginVertical: 100,
          }}>
          <Text
            style={[
              styles.buttonWhiteText,
              styles.textAlignCenter,
              {fontSize: 20},
            ]}>
            GO BACK
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NavigationButtons = ({
  onNext,
  onPrev,
  showPrev,
  nextText = 'NEXT',
}: {
  onNext: () => void;
  onPrev: () => void;
  showPrev: boolean;
  nextText?: string;
}) => {
  return (
    <View style={[styles.row, {justifyContent: 'space-between'}]}>
      <View>
        {showPrev && (
          <TouchableOpacity
            onPress={onPrev}
            style={[
              styles.row,
              {
                backgroundColor: '#bbb',
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
                padding: 20,
              },
            ]}>
            <Ionicons
              style={{margin: 0, padding: 0, alignSelf: 'center'}}
              name="chevron-back"
              size={20}
              color={WHITE}
            />
            <Text
              style={[
                styles.textBold,
                styles.textAlignCenter,
                {fontSize: 16, color: WHITE},
              ]}>
              PREV
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={onNext}
        style={[
          styles.row,
          {
            backgroundColor: RED,
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
            padding: 20,
          },
        ]}>
        <Text
          style={[
            styles.textBold,
            styles.textAlignCenter,
            {fontSize: 16, color: WHITE},
          ]}>
          {nextText}
        </Text>
        <Ionicons
          style={{margin: 0, padding: 0, alignSelf: 'center'}}
          name="chevron-forward"
          size={20}
          color={WHITE}
        />
      </TouchableOpacity>
    </View>
  );
};

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

    // switch (supply % daysPerWeek) {
    //   case 0:
    //     return;
    // }
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
    // id: `${date.toString()}${timeOfDay.toString()}${parseInt(doses)*3}${parseInt(supply)*5}${genericName}`,//create a unique hashcode
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

export const AddMedicationModal = ({
  medication,
}: {
  medication: MedicationItem;
}) => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.modalConainer}>
      <Text style={[styles.infoTitle, styles.textAlignCenter]}>
        Add Medication
      </Text>
      <Tab.Navigator
        initialRouteName="DaysForm"
        tabBar={() => <View />}
        screenOptions={{tabBarScrollEnabled: false, swipeEnabled: false}}>
        <Tab.Screen
          name="DaysForm"
          component={DaysForm}
          initialParams={{medication}}
        />
        <Tab.Screen
          name="DateForm"
          component={DateForm}
          initialParams={{medication}}
        />
        <Tab.Screen
          name="TimeForm"
          component={TimeForm}
          initialParams={{medication}}
        />
        <Tab.Screen
          name="SupplyForm"
          component={SupplyForm}
          initialParams={{medication}}
        />
        <Tab.Screen
          name="DoneScreen"
          component={DoneScreen}
          initialParams={{medication}}
        />
      </Tab.Navigator>
    </View>
  );
};
