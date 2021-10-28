import RNDateTimePicker from '@react-native-community/datetimepicker';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MedicationItem} from '../../@types/Schema';
import {Days} from '../../@types/Types';
import {WHITE, BLUE} from '../../style/Colours';
import {styles} from '../../style/Styles';
import {renderName} from '../../utils/Display';
import {FormParamsList, NavigationButtons} from './AddMedicationModal';

/**
 * @returns Component to select a date
 */
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
          style={styles.leftIcon}
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

/**
 * @returns Form to select the start date and end date that the medication is taken
 */
export const DateForm = ({
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
  // true iff a start date has been selected
  const [startDateSet, setStartDateSet] = useState(false);
  // true iff an end date has been selected
  const [endDateSet, setEndDateSet] = useState(false);
  // true iff the form has been sumbitted with incorrect values
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
