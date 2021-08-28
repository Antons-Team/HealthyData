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

  const isToday = (other: Date) => {
    // TODO: move this helper function into separate file
    const today = new Date();
    return other.getDate() == today.getDate() &&
      other.getMonth() == today.getMonth() &&
      other.getFullYear() == today.getFullYear();
  };

  useEffect(() => {
    // fetch the todos for the current user
    firestore().collection('users').doc(`${auth().currentUser?.uid}`).get().then(doc => {
      return doc.data();
    }).then(data => {
      if (data != undefined) {
        const todos = data.todos.filter((todo: TodoItem) => isToday(todo.date.toDate()));
        setTodos(todos);
      }
    }).catch(() => {
      return;
    });
  }, []);

  const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.time}>{item.date.toDate().toLocaleTimeString()}</Text>
      <Text style={styles.info}>{renderName(item.medication.name)} {item.amount} x {item.medication.dosage_amount}{item.medication.dosage_units}</Text>
    </View>
  );

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Today&apos;s Medication</Text>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      <Text style={styles.title}>Upcoming Refills</Text>
    </View>
  );
};

export default Home;