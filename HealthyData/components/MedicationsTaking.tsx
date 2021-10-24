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
import {BLACK, BLUE, DARK, DARK_GRAY, ORANGE, WHITE} from '../style/Colours';
import {renderName} from '../utils/Display';
import {Icon} from 'react-native-vector-icons/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabBar} from 'react-native-tab-view';

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps;
};

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

const TakingItem = ({todo}: {todo: TodoItem}) => {
  return (
    <View style={styles.tileContainer}>
      <Text style={styles.tileHeading}>
        {renderName(todo.medication.genericName)}
      </Text>
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
        <Text
          style={[
            {
              backgroundColor: todo.supply > 10 ? 'grey' : ORANGE,
            },
            styles.circleTextHighlight,
          ]}>
          {todo.supply} doses left
        </Text>
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

const CurrentlyTaking = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  useEffect(() => {
    getCurrentlyTakingTodos().then(setTodos);
  }, []);

  return (
    <View>
      <ScrollView>
        {todos.map(todo => (
          <TakingItem key={todo.id} todo={todo} />
        ))}
      </ScrollView>
    </View>
  );
};

const TakenItem = ({todo}: {todo: TodoItem}) => {
  return (
    <View style={styles.tileContainer}>
      <Text style={styles.tileHeading}>
        {renderName(todo.medication.genericName)}
      </Text>
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

const PreviouslyTaken = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  useEffect(() => {
    getPreviouslyTakenTodos().then(setTodos);
  }, []);
  return (
    <View>
      <ScrollView>
        {todos.map(todo => (
          <TakenItem key={todo.id} todo={todo} />
        ))}
      </ScrollView>
    </View>
  );
};

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
