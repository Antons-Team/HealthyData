import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {MedicationsStackParamList} from '../@types/MedicationsStackParamList';
import {
  getCurrentlyTakingTodos,
  getNextDose,
  getPreviouslyTakenTodos,
} from '../services/calendar';
import {styles} from '../style/Styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TodoItem} from '../@types/Schema';
import {Days} from '../@types/Types';
import {daysOfTheWeek} from '../utils/Dates';
import {BLACK, BLUE, DARK_GRAY, WHITE} from '../style/Colours';
import {renderName} from '../utils/Display';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DosesButton} from './Home';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps;
};

/**
 * @returns Component dipslaying the days of the week in a row with selected days highlighted
 */
const DaysOfTheWeekRow = ({days}: {days: Days}) => {
  return (
    <View style={[styles.row]}>
      {daysOfTheWeek.map(day => (
        <Text
          key={day}
          style={[
            styles.textBold,
            {color: days[day] ? BLUE : 'grey', paddingHorizontal: 5},
          ]}>
          {day[0].toUpperCase()}
        </Text>
      ))}
    </View>
  );
};

/**
 * @returns component showing a medication item that is currently being taken
 */
const TakingItem = ({
  todo,
  onUpdateSupply,
  onInfoPress,
}: {
  todo: TodoItem;
  onUpdateSupply: () => void;
  onInfoPress: () => void;
}) => {
  return (
    <View style={styles.tileContainer}>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.tileHeading}>
          {renderName(todo.medication.genericName)}
        </Text>
        <Ionicons
          style={{margin: 0, alignSelf: 'center'}}
          name="information-circle-outline"
          size={30}
          color={DARK_GRAY}
          onPress={() => {
            onInfoPress();
          }}
        />
      </View>
      <View style={{paddingVertical: 10}}>
        {todo.days == null ? (
          <Text style={[styles.textBold, {color: BLACK}]}>
            Taken every{' '}
            <Text style={[styles.textBold, {color: BLUE}]}>
              {todo.intervalDays?.interval}
            </Text>{' '}
            days
          </Text>
        ) : (
          <DaysOfTheWeekRow days={todo.days} />
        )}
      </View>
      <View
        style={[
          styles.row,
          {
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 5,
          },
        ]}>
        <DosesButton todo={todo} onUpdateSupply={onUpdateSupply} />
        <Text>
          Next dose:{' '}
          <Text style={styles.textBold}>
            {getNextDose(todo)?.toDateString()}
          </Text>
        </Text>
      </View>
    </View>
  );
};

type CurrentlyTakingProps = {
  navigation: MedicationsNavigationProps;
};
type PreviouslyTakenProps = {
  navigation: MedicationsNavigationProps;
};

/**
 * @returns list component of all medications currenlty taken
 */
const CurrentlyTaking = (props: CurrentlyTakingProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  useEffect(() => {
    getCurrentlyTakingTodos().then(setTodos);
  }, []);

  return (
    <View>
      <ScrollView>
        {todos.map(todo => (
          <TakingItem
            key={todo.id}
            todo={todo}
            onInfoPress={() => {
              props.navigation.navigate('AddMedication', {
                medication: todo.medication,
              });
            }}
            onUpdateSupply={() => getCurrentlyTakingTodos().then(setTodos)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * @returns component showing a medication that has previously been taken
 */
const TakenItem = ({
  todo,
  onInfoPress,
}: {
  todo: TodoItem;
  onInfoPress: () => void;
}) => {
  return (
    <View style={styles.tileContainer}>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.tileHeading}>
          {renderName(todo.medication.genericName)}
        </Text>
        <Ionicons
          style={{margin: 0, alignSelf: 'center'}}
          name="information-circle-outline"
          size={30}
          color={DARK_GRAY}
          onPress={() => {
            onInfoPress();
          }}
        />
      </View>
      <Text style={[styles.textBold, {paddingVertical: 10, color: DARK_GRAY}]}>
        Taken from
        <Text style={[styles.textBold, {color: BLUE}]}>
          {' '}
          {todo.today.toDate().toDateString().split(/ (.+)/)[1]}{' '}
        </Text>
        to
        <Text style={[styles.textBold, {color: BLUE}]}>
          {' '}
          {todo.date.toDate().toDateString().split(/ (.+)/)[1]}{' '}
        </Text>
      </Text>
    </View>
  );
};

/**
 * @returns list component of all medications previously taken
 */
const PreviouslyTaken = (props: PreviouslyTakenProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  useEffect(() => {
    getPreviouslyTakenTodos().then(setTodos);
  }, []);
  return (
    <View>
      <ScrollView>
        {todos.map(todo => (
          <TakenItem
            onInfoPress={() => {
              props.navigation.navigate('AddMedication', {
                medication: todo.medication,
              });
            }}
            key={todo.id}
            todo={todo}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * @returns Screen containing search bar and tab bar to switch between
 * currently and previously taken medications
 */
const MedicationsTaking = (props: Props) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <View>
        <TouchableOpacity
          style={[styles.searchBar]}
          onPressIn={() => {
            props.navigation.navigate('Medications');
          }}>
          <View style={[styles.row, {alignItems: 'center'}]}>
            <Ionicons
              style={{margin: 0, padding: 0}}
              name="search"
              size={20}
              color={DARK_GRAY}
            />
            <Text style={{color: DARK_GRAY, padding: 4}}>Add medication</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
          tabBarInactiveTintColor: 'grey',
          tabBarActiveTintColor: 'white',
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarPressColor: WHITE,
        }}>
        <Tab.Screen name="Currently Taking" component={CurrentlyTaking} />
        <Tab.Screen name="Previously Taken" component={PreviouslyTaken} />
      </Tab.Navigator>
    </View>
  );
};

export default MedicationsTaking;
