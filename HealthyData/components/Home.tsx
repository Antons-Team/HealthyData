import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';

import {MedicationItem, TodoItem} from '../@types/Schema';
import {styles} from '../style/Styles';
import {displayTime} from '../utils/Display';

import {renderName} from '../utils/Display';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {useIsFocused} from '@react-navigation/native';

import {displayDate} from '../utils/Display';
import {addDays, compareByTime} from '../utils/Dates';
import {
  getHasTaken,
  isToday,
  takeMedication,
  untakeMedication,
} from '../services/calendar';
import {LIGHT, RED, WHITE} from '../style/Colours';
import {ScrollView} from 'react-native-gesture-handler';

export const RenderTodoItem = ({item, today}: {item; today: Date}) => {
  const [taken, setTaken] = useState(false);

  // const today = new Date();
  const time = item.time.toDate();
  time.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
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
      {/* <View style={styles.item}>
                <Text style={styles.time}>{displayTime(item.time.toDate())}</Text>
                <Text style={styles.info}>{renderName(item.medication.genericName)} {item.doses}</Text>
              </View> */}
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
            : today.toTimeString() > item.time.toDate().toTimeString()
            ? RED
            : LIGHT,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.time}>{displayTime(item.time.toDate())}</Text>
          <Text style={styles.time}>
            {taken
              ? 'Taken'
              : today.toTimeString() > item.time.toDate().toTimeString()
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

const RenderRefill = ({item}) => (
  <View style={styles.item}>
    <Text style={styles.time}>{displayDate(item.refillDate.toDate())}</Text>
    <Text style={styles.info}>{renderName(item.medication.genericName)}</Text>
  </View>
);

const Home = (): JSX.Element => {
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [refills, setRefills] = useState<Array<TodoItem>>([]);

  const isFocused = useIsFocused();

  const getTodoData = async () => {
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

  useEffect(() => {
    if (isFocused) {
      getTodoData();
    }
  }, [isFocused]);

  return (
    <View style={styles.homeContainer}>
      <ScrollView>
        <Text style={styles.title}>Today&apos;s Medication</Text>

        <SafeAreaView style={[styles.container, {flexDirection: 'column'}]}>
          <Text>{todos.length == 0 ? 'Nothing to do!' : ''}</Text>
          {/* <FlatList
          data={todos}
          renderItem={item => (<RenderItem item={item.item}/>)}
          keyExtractor={item => item.id}
        /> */}

          {todos.map(item => (
            <RenderTodoItem key={item.id} item={item} today={new Date()} />
          ))}
        </SafeAreaView>
        <Text style={styles.title}>Upcoming Refills</Text>
        <SafeAreaView style={[styles.container, {flexDirection: 'column'}]}>
          <Text>{refills.length == 0 ? 'Nothing to do!' : ''}</Text>
          {/* <FlatList
          data={refills}
          renderItem={renderRefill}
          keyExtractor={item => item.id}
        /> */}

          {refills.map(item => (
            <RenderRefill key={item.id} item={item} />
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default Home;
