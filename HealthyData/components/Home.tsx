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
  description: string;
}

type TodoItem = {
  id: string;
  date: Date;
  medications: MedicationItem;
};

const Home = (): JSX.Element => {
  const [ todos, setTodos ] = useState<Array<TodoItem>>([]);
  const [ loading, setLoading ] = useState(true);

  const ref = firestore().collection('todos');

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<TodoItem> = [];
      querySnapshot.forEach(doc => {
        const { date, medications } = doc.data();
        
        temp.push({
          id: doc.id,
          date: date,
          //medications: getDoc(docRef),
          // need to fetch medications ref
          medications: {
            name: "Ibuprofen",
            description: "ABCD",
          }
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
      <Text style={styles.title}>{item.medications.name}</Text>
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