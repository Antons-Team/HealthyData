import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView, 
  FlatList,
  ListRenderItem,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

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
  const [ todos, setTodos ] = useState<Array<TodoItem> | null>(null);
  const [ loading, setLoading ] = useState(true);

  const ref = firestore().collection('todos');

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const temp: Array<TodoItem> = [];
      querySnapshot.forEach(doc => {
        const { date, medications } = doc.data();
        temp.push({
          id: doc.id,
          date,
          medications,
        });
      });

      setTodos(temp);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
    <View>
      <Text>{item.medications.name} {item.date}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaView>
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
