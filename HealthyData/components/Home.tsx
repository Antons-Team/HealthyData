import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView, 
  FlatList,
  ListRenderItem,
  StatusBar,
  StyleSheet,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';

type MedicationItem = {
  name: string;
  brand_name: string;
  description: string;
}

type TodoItem = {
  id: string;
  date: Date;
  medication: MedicationItem;
};

const Home = (): JSX.Element => {
  const [ todos, setTodos ] = useState<Array<TodoItem>>([]);
  const [ loading, setLoading ] = useState(true);

  const ref = firestore().collection('todos');

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<TodoItem> = [];
      querySnapshot.forEach(doc => {
        const { date, medication } = doc.data();

        temp.push({
          id: doc.id,
          date: date,
          // note: the medication data is duplicated instead of foreign keyed
          // apparently this is best practise for document based NoSQL dbs so wherever
          // a new todo item is added you query for the correct medication data
          // and insert that as well
          medication: medication,
        });
      });


      setTodos(temp);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.medication.name} {item.medication.description}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default Home;