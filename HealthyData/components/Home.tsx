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
import {displayTime} from '../utils/Display';

import { renderName } from '../utils/Display';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { useIsFocused } from '@react-navigation/native';

import { displayDate } from '../utils/Display';
import { addDays } from '../utils/Dates';
import { isToday } from '../services/calendar';

const Home = (): JSX.Element => {
  const [ todos, setTodos ] = useState<Array<TodoItem>>([]);
  const [ refills, setRefills ] = useState<Array<TodoItem>>([]);

  const isFocused = useIsFocused();

  const getTodoData = async () => {

    firestore().collection(`users/${auth().currentUser?.uid}/todos`).get().then(snapshot => {
      const docs = snapshot.docs;

      const data = docs.map(doc => {
        return (doc.data()) as TodoItem;
      });

      const todos = data.filter(todo => {
        const today = new Date();
        return today < todo.date.toDate() && isToday(todo, new Date());
      });
      setTodos(todos);

      // get refill data
      const refills = data.filter(todo => {
        let date = new Date();
        date = addDays(30, date);
        return todo.refillDate.toDate() < date;
      });
      setRefills(refills);

    }).catch(e => {
      console.error(e);
    });
  };

  useEffect(() => {
    if (isFocused) {
      getTodoData();
    }
  }, [isFocused]);

  const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.time}>{displayTime(item.time.toDate())}</Text>
      <Text style={styles.info}>{renderName(item.medication.genericName)} {item.doses}</Text>
    </View>
  );

  const renderRefill: ListRenderItem<TodoItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.time}>{displayDate(item.refillDate.toDate())}</Text>
      <Text style={styles.info}>{renderName(item.medication.genericName)}</Text>
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
        <FlatList
          data={refills}
          renderItem={renderRefill}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default Home;