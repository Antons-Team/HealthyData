import React from 'react';
import {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {TodoItem} from '../@types/Schema';
import {styles} from '../style/Styles';
import {displayTime} from '../utils/Display';

import {renderName} from '../utils/Display';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {
  CurrentRenderContext,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';

import {displayDate} from '../utils/Display';
import {addDays, compareByDate, compareByTime} from '../utils/Dates';
import {
  getHasTaken,
  isToday,
  takeMedication,
  untakeMedication,
} from '../services/calendar';
import {
  BLUE,
  DARK,
  DARK_GRAY,
  GREEN,
  LIGHT,
  ORANGE,
  RED,
  WHITE,
} from '../style/Colours';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

const hasMissed = (calendarDate: Date, medicationTime: Date) => {
  const today = new Date();

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
  const [taken, setTaken] = useState(true);

  const time = item.time.toDate();
  time.setFullYear(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    calendarDate.getDate(),
  );
  time.setSeconds(0, 0);

  useEffect(() => {
    let isMounted = true;
    getHasTaken(item.medication, time).then(res => {
      if (isMounted) {
        setTaken(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const takenString = taken
    ? 'taken'
    : hasMissed(calendarDate, item.time.toDate())
    ? 'missed'
    : 'upcoming';
  const icons = {
    taken: 'checkbox-outline',
    missed: 'square-outline',
    upcoming: 'time-outline',
  };

  const colors = {
    upcoming: ['#F0F8FF', '#A5BFD6'],
    missed: ['#FFE8E8', ORANGE, '#F29D9D'],
    taken: ['#eee', '#aaa'],
  };

  return (
    <View style={{marginBottom: 8}}>
      <Text
        style={[{color: '#636363', marginHorizontal: 10, letterSpacing: 2.5}]}>
        {displayTime(item.time.toDate())}
      </Text>
      <TouchableOpacity
        style={[
          styles.tileContainer,
          {
            paddingRight: 0,
            paddingTop: 0,
            overflow: 'hidden',
            backgroundColor: WHITE,
            borderWidth: 1.5,
            borderColor: colors[takenString][1],
          },
        ]}
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
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
            },
          ]}>
          <Text style={[styles.tileHeading, {paddingVertical: 10}]}>
            {renderName(item.medication.genericName)}
          </Text>
          <View
            style={[
              {
                backgroundColor: colors[takenString][1],
                overflow: 'hidden',
                borderBottomLeftRadius: 10,
                paddingHorizontal: 10,
                height: 19,
              },
              styles.row,
            ]}>
            <Text style={[styles.buttonWhiteText, {fontSize: 13}]}>
              {takenString.toUpperCase()}
            </Text>
            <Ionicons
              style={{margin: 0, paddingLeft: 10, alignSelf: 'center'}}
              name={icons[takenString]}
              size={18}
              color={WHITE}
            />
          </View>
        </View>
        <Text style={[styles.text, {fontSize: 16}]}>
          <Text style={{fontWeight: 'bold'}}>{item.doses} </Text>
          {item.doses == 1 ? 'dose' : 'doses'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const RenderRefill = ({item}: {item: TodoItem}) => (
  <View
    style={[
      styles.tileContainer,
      styles.row,
      {justifyContent: 'space-between', alignItems: 'center'},
    ]}>
    <Text style={styles.tileHeading}>
      {renderName(item.medication.genericName)}
    </Text>
    <Text
      style={[
        {
          backgroundColor: ORANGE,
        },
        styles.circleTextHighlight,
      ]}>
      {item.supply} doses left
    </Text>
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
        return (
          compareByDate(today, todo.date.toDate()) <= 0 &&
          isToday(todo, new Date())
        );
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

const Divider = ({text}: {text: string}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1, height: 1, backgroundColor: BLUE}} />
      <View>
        <Text
          style={{
            width: 120,
            textAlign: 'center',
            color: BLUE,
            fontWeight: 'bold',
          }}>
          {text}
        </Text>
      </View>
      <View style={{flex: 1, height: 1, backgroundColor: BLUE}} />
    </View>
  );
};

const RefillDay = ({todos}: {todos: TodoItem[]}) => {
  const dateString = todos[0].refillDate.toDate().toDateString();
  const isToday = dateString === new Date().toDateString();

  return (
    <View style={{marginBottom: 10}}>
      <Text
        style={[
          {
            color: isToday ? BLUE : '#636363',
            fontWeight: isToday ? 'bold' : 'normal',
            marginHorizontal: 10,
            letterSpacing: 2.5,
          },
        ]}>
        {dateString + (isToday ? ' - Today' : '')}
      </Text>
      {todos.map(todo => {
        return <RenderRefill key={todo.id} item={todo} />;
      })}
    </View>
  );
};

const RefillList = ({todos}: {todos: TodoItem[]}) => {
  const refillsByDate: any = {};

  todos.forEach(todo => {
    const dateString = todo.refillDate.toDate().toDateString();
    if (!(dateString in refillsByDate)) {
      refillsByDate[dateString] = [];
    }
    refillsByDate[dateString] = [...refillsByDate[dateString], todo];
  });

  const sortedDateStrings = [...Object.keys(refillsByDate)].sort((s1, s2) =>
    compareByDate(new Date(s1), new Date(s2)),
  );

  return (
    <ScrollView>
      <SafeAreaView
        style={[
          styles.container,
          {flexDirection: 'column', marginTop: 0, paddingTop: 0},
        ]}>
        {todos.length == 0 ? (
          <View style={{paddingVertical: 100}}>
            <Ionicons
              style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
              name="checkmark-circle-outline"
              size={100}
              color={BLUE}
            />
            <Text
              style={[
                styles.infoTitle,
                styles.textAlignCenter,
                {color: DARK_GRAY},
              ]}>
              Nothing to do!
            </Text>
          </View>
        ) : (
          <View>
            {sortedDateStrings.map(dateString => (
              <RefillDay key={dateString} todos={refillsByDate[dateString]} />
            ))}

            {/* {todos.map(item => (
              <RenderRefill key={item.id} item={item} />
            ))} */}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const MedicationsList = ({todos}: {todos: TodoItem[]}) => {
  return (
    <ScrollView>
      <SafeAreaView
        style={[
          styles.container,
          {flexDirection: 'column', marginTop: 0, paddingTop: 0},
        ]}>
        {todos.length == 0 ? (
          <View style={{paddingVertical: 100}}>
            <Ionicons
              style={{margin: 0, paddingRight: 10, alignSelf: 'center'}}
              name="checkmark-circle-outline"
              size={100}
              color={BLUE}
            />
            <Text
              style={[
                styles.infoTitle,
                styles.textAlignCenter,
                {color: DARK_GRAY},
              ]}>
              Nothing to do!
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={[styles.infoTitle, {fontSize: 16, paddingHorizontal: 0}]}>
              {new Date().toDateString()}
            </Text>

            {todos
              .filter(item => compareByTime(item.time.toDate(), new Date()) < 0)
              .map(item => (
                <RenderTodoItem
                  key={item.id}
                  item={item}
                  calendarDate={new Date()}
                />
              ))}
            <Divider text={'Now: ' + displayTime(new Date())} />
            {todos
              .filter(
                item => compareByTime(item.time.toDate(), new Date()) >= 0,
              )
              .map(item => (
                <RenderTodoItem
                  key={item.id}
                  item={item}
                  calendarDate={new Date()}
                />
              ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const Home = (): JSX.Element => {
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [refills, setRefills] = useState<Array<TodoItem>>([]);

  // const isFocused = useIsFocused();

  useEffect(() => {
    // if (isFocused) {
    getTodoData(setRefills, setTodos);
    // }
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'medications', title: 'MEDICATIONS'},
    {key: 'refills', title: 'REFILLS'},
  ]);
  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <Text style={[styles.infoTitle, {fontSize: 37}]}>Today's Reminders</Text>
      <TabView
        navigationState={{index, routes}}
        renderScene={SceneMap({
          medications: () => <MedicationsList todos={todos} />,
          refills: () => <RefillList todos={refills} />,
        })}
        onIndexChange={setIndex}
        renderTabBar={props => (
          <TabBar
            style={[styles.tabBarStyle, {backgroundColor: WHITE}]}
            labelStyle={[styles.tabBarLabelStyle]}
            indicatorStyle={[
              styles.tabBarIndicatorStyle,
              {backgroundColor: DARK},
            ]}
            inactiveColor={'grey'}
            activeColor={WHITE}
            pressColor={WHITE}
            {...props}
          />
        )}
      />
    </View>
  );
};

export default Home;
