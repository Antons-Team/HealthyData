import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView, 
  FlatList,
  ListRenderItem,
} from 'react-native';

import { TodoItem } from '../@types/Schema';
import {styles} from '../style/Styles';

import { renderName } from '../utils/Display';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Home = (): JSX.Element => {
  const [ todos, setTodos ] = useState<Array<TodoItem>>([]);
  const [ refills, setRefills ] = useState<Array<TodoItem>>([]);

  const isToday = (todo: TodoItem) => {
    const today = new Date().getDay();
    if (today == 0) {
      return todo.days.sunday;
    } else if (today == 1) {
      return todo.days.monday;
    } else if (today == 2) {
      return todo.days.tuesday;
    } else if (today == 3) {
      return todo.days.wednesday;
    } else if (today == 4) {
      return todo.days.thursday;
    } else if (today == 5) {
      return todo.days.friday;
    } else {
      return todo.days.saturday;
    }
  };

  useEffect(() => {
    // fetch the todos for the current user
    firestore().collection('users').doc(`${auth().currentUser?.uid}`).get().then(doc => {
      return doc.data();
    }).then(data => {
      if (data != undefined) {
        const todos = data.todos.filter((todo: TodoItem) => {
          const today = new Date();
          return today < todo.date.toDate() && isToday(todo);
        });
        setTodos(todos);
      }
    }).catch(() => {
      return;
    });
  }, []);

  const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.time}>{item.date.toDate().toLocaleTimeString()}</Text>
      <Text style={styles.info}>{renderName(item.medication.name)} {item.doses} x {item.medication.dosage_amount}{item.medication.dosage_units}</Text>
    </View>
  );

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Today&apos;s Medication</Text>
      <SafeAreaView style={styles.container}>
        <Text>
          {
            todos.length == 0 ? 'Nothing to do!' : ''
          }
        </Text>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      <Text style={styles.title}>Upcoming Refills</Text>
      <SafeAreaView style={styles.container}>
        <Text>
          {
            refills.length == 0 ? 'Nothing to do!' : ''
          }
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default Home;