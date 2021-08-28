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

import firestore from '@react-native-firebase/firestore';

const Home = (): JSX.Element => {
  const [ todos, setTodos ] = useState<Array<TodoItem>>([]);
  const [ loading, setLoading ] = useState(true);

  const ref = firestore().collection('todos');

  const isToday = (other: Date) => {
    // TODO: move this helper function into separate file
    const today = new Date();
    return other.getDate() == today.getDate() &&
      other.getMonth() == today.getMonth() &&
      other.getFullYear() == today.getFullYear();
  };

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<TodoItem> = [];
      querySnapshot.forEach(doc => {
        const { amount, date, medication } = doc.data();

        if (isToday(date.toDate())) {
          temp.push({
            id: doc.id,
            amount: amount,
            date: date,
            medication: medication,
          });
        }
      });


      setTodos(temp);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  // TODO: move these helper functions to different file
  // capitalise the first character of a name
  const renderName: (name: string) => string = function (
    name: string,
  ): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

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