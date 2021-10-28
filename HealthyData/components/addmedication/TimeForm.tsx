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
import {renderName, displayTime} from '../../utils/Display';
import {FormParamsList, NavigationButtons} from './AddMedicationModal';

/**
 * @returns Form component to enter the time the medication is taken
 */
export const TimeForm = ({
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
              style={styles.leftIcon}
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
