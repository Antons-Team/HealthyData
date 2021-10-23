import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Settings, Text, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
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

type MedicationsNavigationProps = StackNavigationProp<
  MedicationsStackParamList,
  'Medications'
>;

type Props = {
  navigation: MedicationsNavigationProps;
};

const TakingItem = ({todo}: {todo: TodoItem}) => {
  return (
    <View style={{borderWidth: 1}}>
      <Text>{todo.medication.genericName}</Text>
      <Text>{todo.supply} doses left</Text>
      {todo.days == null ? (
        <Text>Taken every {todo.intervalDays?.interval} days</Text>
      ) : (
        <Text>
          taken on{' '}
          {[...daysOfTheWeek]
            .filter(day => {
              return todo.days[day];
            })
        .join(', ')}
        </Text>
      )}
      <Text>{getNextDose(todo)?.toDateString()}</Text>
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
      {todos.map(todo => (
        <TakingItem key={todo.id} todo={todo} />
      ))}
    </View>
  );
};
const PreviouslyTaken = (todos: TodoItem[]) => {
  return <Text>shit</Text>;
};

const MedicationsTaking = (props: Props) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <View style={{flexDirection: 'column', flex: 1, backgroundColor: 'white'}}>
      <View>
        <TouchableOpacity
          style={[styles.searchBar, {padding: 15}]}
          onPressIn={() => {
            props.navigation.navigate('Medications');
          }}>
          <Text style={{color: 'grey'}}>Add medication</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {elevation: 0},
          tabBarIndicatorStyle: {
            backgroundColor: 'grey',
            height: 40,
            marginBottom: 5,
            borderRadius: 20,
          },
          // tabBarIndicatorContainerStyle: {
          //   paddingHorizontal: 50
          // }
        }}>
        <Tab.Screen name="Currently Taking" component={CurrentlyTaking} />
        <Tab.Screen name="Previously Taken" component={CurrentlyTaking} />
      </Tab.Navigator>
    </View>
  );
};

export default MedicationsTaking;
