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

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<TodoItem> = [];
      querySnapshot.forEach(doc => {
        const { amount, date, medication } = doc.data();

        temp.push({
          id: doc.id,
          amount: amount,
          date: date,
          medication: medication,
        });
      });


      setTodos(temp);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  let renderName: (name: string) => string = function (
    name: string,
  ): string {
    return name;
  }

  const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date.toDate().toLocaleTimeString()}</Text>
      <Text style={styles.title}>{renderName(item.medication.name)} {item.amount} {item.medication.dosage_amount} {item.medication.dosage_units}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default Home;