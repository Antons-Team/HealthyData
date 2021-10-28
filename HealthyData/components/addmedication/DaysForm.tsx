import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleProp, TextInput, TextStyle} from 'react-native';
import {MedicationItem} from '../../@types/Schema';
import {Days} from '../../@types/Types';
import {WHITE, BLUE} from '../../style/Colours';
import {styles} from '../../style/Styles';
import {daysOfTheWeek} from '../../utils/Dates';
import {numberOnlyPinPad, renderName} from '../../utils/Display';
import {FormParamsList, NavigationButtons} from './AddMedicationModal';

/**
 * @returns component for selecting interval of days
 */

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

type RadioProps = {
  text: string;
  selected: boolean;
  onPress: () => void;
  selectedStyle?: StyleProp<TextStyle>;
  unselectedStyle?: StyleProp<TextStyle>;
};

/**
 * @returns radio button component for selecting a single day of the week
 */
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

/**
 * @returns component for selecting the number of days for taking a new medication
 */
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

/**
 * @returns form to enter the number of days to take a medication
 */
export const DaysForm = ({
  navigation,
  route,
}: {
  navigation: BottomTabNavigationProp<FormParamsList, 'DaysForm'>;
  route: RouteProp<{params: {medication: MedicationItem}}, 'params'>;
}) => {
  // medication to be taken
  const medication = route.params.medication;

  // days of the week to be selected
  // (if the medication is being taken on the same days each week)
  const [days, setDays] = useState<Days>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  // true iff the medication is not being taken on the same day each week
  const [isInterval, setIsInterval] = useState(false);
  // number of days between each time the medicaition is taken
  // (if the medication is not taken on the same days each week)
  const [intervalDays, setIntervalDays] = useState('1');

  // true iff the next button has been pressed with invalid
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
