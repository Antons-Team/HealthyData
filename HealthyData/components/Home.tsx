import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {TodoItem} from '../@types/Schema';
import {styles} from '../style/Styles';
import {displayTime} from '../utils/Display';

import {renderName} from '../utils/Display';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {useIsFocused} from '@react-navigation/native';

import {displayDate} from '../utils/Display';
import {addDays, compareByDate, compareByTime} from '../utils/Dates';
import {
  getHasTaken,
  isToday,
  takeMedication,
  untakeMedication,
} from '../services/calendar';
import {LIGHT, RED, WHITE} from '../style/Colours';
import {ScrollView} from 'react-native-gesture-handler';

const hasMissed = (calendarDate: Date, medicationTime: Date) => {
  const today = new Date();
  console.log(calendarDate, today);

  if (compareByDate(calendarDate, today) < 0) {
    return true;
  }

  if (compareByDate(calendarDate, today) == 0) {
    return compareByTime(today, medicationTime) > 0;
  }
  return false;
};

export const RenderTodoItem = ({
  item,
  calendarDate,
}: {
  item: TodoItem;
  calendarDate: Date;
}) => {
  const [taken, setTaken] = useState(false);

  const time = item.time.toDate();
  time.setFullYear(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    calendarDate.getDate(),
  );
  time.setSeconds(0, 0);

  useEffect(() => {
    getHasTaken(item.medication, time).then(res => {
      setTaken(res);
    });
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!taken) {
          takeMedication(item, time);
          setTaken(true);
        } else {
          untakeMedication(item, time);
          setTaken(false);
        }
      }}>
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: WHITE,
          borderWidth: 2,
          borderRadius: 6,
          padding: 0,
          marginTop: 10,
          borderColor: taken
            ? 'gray'
            : hasMissed(calendarDate, item.time.toDate())
            ? RED
            : LIGHT,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.time}>{displayTime(item.time.toDate())}</Text>
          <Text style={styles.time}>
            {taken
              ? 'Taken'
              : hasMissed(calendarDate, item.time.toDate())
              ? 'Not Taken'
              : 'Upcoming'}
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity>
            <Text style={[styles.info]}>
              {renderName(item.medication.genericName)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.info}>{item.doses} doses</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RenderRefill = ({item}: {item: TodoItem}) => (
  <View style={styles.item}>
    <Text style={styles.time}>{displayDate(item.refillDate.toDate())}</Text>
    <Text style={styles.info}>{renderName(item.medication.genericName)}</Text>
  </View>
);

const getTodoData = async (
  setRefills: {
    (value: React.SetStateAction<TodoItem[]>): void;
    (arg0: TodoItem[]): void;
  },
  setTodos: {
    (value: React.SetStateAction<TodoItem[]>): void;
    (arg0: TodoItem[]): void;
  },
) => {
  // Retrieve the todo data from firestore doc
  firestore()
    .collection(`users/${auth().currentUser?.uid}/todos`)
    .get()
    .then(snapshot => {
      const docs = snapshot.docs;

      const data = docs.map(doc => {
        return {...doc.data(), id: doc.id} as TodoItem;
      });

      const todos = data.filter(todo => {
        const today = new Date();
        return today < todo.date.toDate() && isToday(todo, new Date());
      });

      setTodos(
        todos.sort((todo1, todo2) => {
          return compareByTime(todo1.time.toDate(), todo2.time.toDate());
        }),
      );

      // get refill data
      const refills = data.filter(todo => {
        let date = new Date();
        date = addDays(30, date);
        return todo.refillDate.toDate() < date;
      });
      setRefills(refills);
    })
    .catch(e => {
      console.error(e);
    });
};

const Home = (): JSX.Element => {
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [refills, setRefills] = useState<Array<TodoItem>>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getTodoData(setRefills, setTodos);
    }
  }, [isFocused]);

  return (
    <View style={styles.homeContainer}>
      <ScrollView>
        <Text style={styles.title}>Today&apos;s Medication</Text>

        <SafeAreaView style={[styles.container, {flexDirection: 'column'}]}>
          <Text>{todos.length == 0 ? 'Nothing to do!' : ''}</Text>
          {todos.map(item => (
            <RenderTodoItem
              key={item.id}
              item={item}
              calendarDate={new Date()}
            />
          ))}
        </SafeAreaView>
        <Text style={styles.title}>Upcoming Refills</Text>
        <SafeAreaView style={[styles.container, {flexDirection: 'column'}]}>
          <Text>{refills.length == 0 ? 'Nothing to do!' : ''}</Text>
          {refills.map(item => (
            <RenderRefill key={item.id} item={item} />
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default Home;
