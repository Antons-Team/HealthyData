import React from 'react';
import {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';

import {TodoItem} from '../@types/Schema';
import {styles} from '../style/Styles';
import {displayTime} from '../utils/Display';

import {renderName} from '../utils/Display';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';

import {addDays, compareByDate, compareByTime} from '../utils/Dates';
import {
  getHasTaken,
  isToday,
  takeMedication,
  untakeMedication,
  updateSupply,
} from '../services/calendar';
import {BLUE, DARK, DARK_GRAY, ORANGE, WHITE} from '../style/Colours';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

/**
 * determines if the user has missed taking a medication
 * @param calendarDate the current date
 * @param medicationTime time that the medication is to be taken
 * @returns true iff the user has missed taking the medication
 */
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

/**
 * @returns  component for a single todo reminder
 */
export const RenderTodoItem = ({
  item,
  calendarDate,
}: {
  item: TodoItem;
  calendarDate: Date;
}) => {
  //  true iff the medication has already been taken
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
    // determine if the medication has been taken
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
    upcoming: [DARK_GRAY, '#A5BFD6'],
    missed: [DARK_GRAY, ORANGE, '#F29D9D'],
    taken: ['#aaa', '#aaa'],
  };

  return (
    <View style={{marginBottom: 8}}>
      <Text
        style={[{color: '#636363', marginHorizontal: 10, letterSpacing: 2.5}]}>
        {displayTime(item.time.toDate())}
      </Text>
      <TouchableOpacity
        activeOpacity={1}
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
          <Text
            style={[
              styles.tileHeading,
              {paddingVertical: 10, color: colors[takenString][0]},
            ]}>
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
        <Text
          style={[styles.text, {fontSize: 16, color: colors[takenString][0]}]}>
          <Text style={styles.textBold}>{item.doses} </Text>
          {item.doses == 1 ? 'dose' : 'doses'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * @returns  Button to update the number of doses
 */
export const DosesButton = ({
  todo,
  onUpdateSupply,
}: {
  todo: TodoItem;
  onUpdateSupply: () => void;
}) => {
  // true iff the update dosage modal is to be shown
  const [show, setShow] = useState(false);
  // the updated supply of medicaitons to be entered by the user
  const [supply, setSupply] = useState(todo.supply.toString());

  const oneDay = 1000 * 60 * 60 * 24; // in ms
  return (
    <View>
      <Text
        onPress={() => setShow(true)}
        style={[
          {
            backgroundColor:
              (todo.refillDate.toDate().getTime() - new Date().getTime()) /
                oneDay <
              10
                ? ORANGE
                : 'grey',
          },
          styles.circleTextHighlight,
        ]}>
        {todo.supply} doses left
      </Text>

      <Modal isVisible={show}>
        <View style={{backgroundColor: WHITE, borderRadius: 50, padding: 20}}>
          <Text style={[styles.infoTitle, {marginBottom: 20}]}>
            Update supply of {renderName(todo.medication.genericName)}
          </Text>
          <Text style={[styles.textBold, {fontSize: 18, paddingBottom: 20}]}>
            Current supply:
            <Text style={[styles.textBold, {fontSize: 18, color: BLUE}]}>
              {' '}
              {todo.supply}{' '}
            </Text>
            doses
          </Text>

          <Text style={[styles.textBold, {fontSize: 18}]}>New supply:</Text>

          <View
            style={[
              styles.row,
              {alignSelf: 'center', paddingVertical: 10, alignItems: 'center'},
            ]}>
            <TextInput
              style={styles.textInputBlue}
              value={supply}
              onChangeText={setSupply}
              keyboardType="numeric"
            />
            <Text
              style={[
                styles.addMedicationTitle,
                {textAlignVertical: 'center'},
              ]}>
              doses
            </Text>
          </View>
          <Text
            style={[
              styles.blueButton,
              styles.textBold,
              styles.textAlignCenter,
              {color: WHITE, marginTop: 20},
            ]}
            onPress={() => {
              setShow(false);
              updateSupply(todo, parseInt(supply)).then(() => {
                onUpdateSupply();
              });
            }}>
            DONE
          </Text>
        </View>
      </Modal>
    </View>
  );
};

/**
 * gets all reminders for the current date
 */
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

        return (
          // next refill is within 30 days
          todo.refillDate.toDate() < date &&
          // currently taking the medication
          compareByDate(todo.date.toDate(), new Date()) >= 0 &&
          // supply is not enough to last until the end date
          compareByDate(todo.refillDate.toDate(), todo.date.toDate()) <= 0
        );
      });
      setRefills(refills);
    })
    .catch(e => {
      console.error(e);
    });
};

/**
 * @returns divider component to show between items in a list
 */
const Divider = ({text}: {text: string}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1, height: 2, backgroundColor: BLUE}} />
      <View>
        <Text
          style={{
            width: 120,
            textAlign: 'center',
            color: WHITE,
            fontWeight: 'bold',
            backgroundColor: BLUE,
            borderRadius: 10,
          }}>
          {text}
        </Text>
      </View>
      <View style={{flex: 1, height: 2, backgroundColor: BLUE}} />
    </View>
  );
};

/**
 * @returns  Component for a refill reminder
 */
export const RenderRefill = ({
  item,
  onUpdateSupply,
}: {
  item: TodoItem;
  onUpdateSupply: () => void;
}) => (
  <View
    style={[
      styles.tileContainer,
      styles.row,
      {justifyContent: 'space-between', alignItems: 'center'},
    ]}>
    <Text style={styles.tileHeading}>
      {renderName(item.medication.genericName)}
    </Text>
    <DosesButton todo={item} onUpdateSupply={onUpdateSupply} />
  </View>
);

/**
 * @returns Refill item component with time displayed on top
 */
const RefillDay = ({
  todos,
  onUpdateSupply,
}: {
  todos: TodoItem[];
  onUpdateSupply: () => void;
}) => {
  const dateString = todos[0].refillDate.toDate().toDateString();
  const isToday = dateString === new Date().toDateString();

  return (
    <View style={{marginBottom: 10}}>
      <Text
        style={[
          {
            color: isToday ? WHITE : '#636363',
            fontWeight: isToday ? 'bold' : 'bold',
            marginHorizontal: 10,
            letterSpacing: 2.5,
            backgroundColor: isToday ? BLUE : WHITE,
            borderRadius: 30,
            width: 240,
            paddingHorizontal: 5,
          },
        ]}>
        {dateString + (isToday ? ' - Today' : '')}
      </Text>
      {todos.map(todo => {
        return (
          <RenderRefill
            key={todo.id}
            item={todo}
            onUpdateSupply={onUpdateSupply}
          />
        );
      })}
    </View>
  );
};

/**
 * @returns list component of all refill reminders
 */
const RefillList = ({
  todos,
  onUpdateSupply,
}: {
  todos: TodoItem[];
  onUpdateSupply: () => void;
}) => {
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
          {flexDirection: 'column', marginTop: 0, paddingTop: 20},
        ]}>
        {todos.length == 0 ? (
          <View style={{paddingVertical: 100}}>
            <Ionicons
              style={styles.leftIcon}
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
              <RefillDay
                onUpdateSupply={onUpdateSupply}
                key={dateString}
                todos={refillsByDate[dateString]}
              />
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

/**
 * @returns list component of all medication reminders
 */
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
              style={styles.leftIcon}
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
          <View style={{marginTop: 20}}>
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

/**
 * @returns Screen for daily reminders
 */
const Home = (): JSX.Element => {
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [refills, setRefills] = useState<Array<TodoItem>>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getTodoData(setRefills, setTodos);
    }
  }, [isFocused]);

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
          refills: () => (
            <RefillList
              onUpdateSupply={() => getTodoData(setRefills, setTodos)}
              todos={refills}
            />
          ),
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
