import RNDateTimePicker from '@react-native-community/datetimepicker';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MedicationItem, TodoItem} from '../../@types/Schema';
import {Days} from '../../@types/Types';
import {BLUE, RED, WHITE} from '../../style/Colours';
import {styles} from '../../style/Styles';
import {addDays, daysOfTheWeek} from '../../utils/Dates';
import {displayTime, numberOnlyPinPad, renderName} from '../../utils/Display';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {scheduleNotifications} from '../../services/notifications';
import {DaysForm} from './DaysForm';
import {DateForm} from './DateForm';
import {TimeForm} from './TimeForm';
import {SupplyForm} from './SupplyForm';

export type FormParamsList = {
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

/**
 * @returns component to show if a medication has been taken
 */
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

export const NavigationButtons = ({
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

/**
 * @returns form navigator for adding a medication
 */
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
