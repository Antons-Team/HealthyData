import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {displayTime, displayDate, renderName} from '../utils/Display';

import {Agenda} from 'react-native-calendars';
import {DateData} from 'react-native-calendars/src/types';
import {getCurrentTodos, getTodosMonth} from '../services/calendar';
import {styles} from '../style/Styles';
import {BLUE, LIGHT, ORANGE, RED, WHITE} from '../style/Colours';
import {RenderRefill, RenderTodoItem} from './Home';
import {isTemplateMiddle} from 'typescript';
import {TodoItem} from '../@types/Schema';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNCalendarEvents from 'react-native-calendar-events';
import {compareByDate, daysOfTheWeek} from '../utils/Dates';

const AgendaItem = ({item}) => {
  return item.type === 'refill' ? (
    <View
      style={[
        styles.item,
        {
          borderColor: BLUE,
          flexDirection: 'column',
          marginRight: 2,
          paddingBottom: 10,
        },
      ]}>
      <Text
        style={[
          {
            backgroundColor: BLUE,
            color: WHITE,
            height: 18,
            borderBottomRightRadius: 6,
            fontWeight: 'bold',
            paddingHorizontal: 5,
            fontSize: 13,
            width: 60,
          },
        ]}>
        REFILLS
      </Text>
      {item.todos.map((todo: TodoItem) => {
        return (
          <View
            key={todo.id}
            style={[
              styles.tileContainer,
              styles.row,
              {
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 0.5,
              },
            ]}>
            <Text style={styles.tileHeading}>
              {renderName(todo.medication.genericName)}
            </Text>
            <Text
              style={[
                {
                  backgroundColor: ORANGE,
                  padding: 0,
                },
                styles.circleTextHighlight,
              ]}>
              {todo.supply} doses
            </Text>
          </View>
        );
      })}
    </View>
  ) : (
    <RenderTodoItem item={item.todo} calendarDate={item.day} />
  );
  // <View style={styles.item}>
  //   <Text style={styles.info}>{displayTime(item.todo.time.toDate())}</Text>
  //   <Text style={styles.time}>{item.name}</Text>
  //   <Text style={styles.info}>{item.todo.doses} doses</Text>
  // </View>
};

const loadMonth = async (
  month: DateData,
  items: {},
  setItems: {(value: React.SetStateAction<{}>): void; (arg0: any): void},
) => {
  const res = await getTodosMonth(month);
  setItems({...items, ...res});
  return month;
};

const addTodosToCalendar = () => {
  getCurrentTodos().then(todos => {
    console.log('got todos');

    todos.forEach(todo => {
      const dateString = todo.refillDate.toDate().toISOString();

      RNCalendarEvents.fetchAllEvents(
        todo.today.toDate().toISOString(),
        todo.date.toDate().toISOString(),
      )
        .then(events => {
          const todoAlreadyAdded = events.some(
            event =>
              event.title
                .toLowerCase()
                .includes(todo.medication.genericName.toLowerCase()) &&
              event.title.toLowerCase().startsWith('take'),
          );

          const refillAlreadyAdded = events.some(
            event =>
              event.title
                .toLowerCase()
                .includes(todo.medication.genericName.toLowerCase()) &&
              event.title.toLowerCase().startsWith('refill') &&
              event.endDate === todo.refillDate.toDate().toISOString(),
          );

          console.log('fetched events');
          if (!refillAlreadyAdded) {
            RNCalendarEvents.saveEvent(
              `Refill ${todo.medication.genericName}`,
              {
                startDate: dateString,
                endDate: dateString,
              },
            ).catch(e => console.error(e));
          }

          if (!todoAlreadyAdded) {
            if (todo.days === null && todo.intervalDays !== null) {
              // interval days
              const date = todo.intervalDays.startingDate.toDate();
              date.setHours(
                todo.time.toDate().getHours(),
                todo.time.toDate().getMinutes(),
              );

              while (compareByDate(date, todo.date.toDate()) < 0) {
                RNCalendarEvents.saveEvent(
                  `Take ${todo.medication.genericName}`,
                  {
                    startDate: date.toISOString(),
                    endDate: date.toISOString(),
                  },
                ).catch(e => console.error(e));

                date.setDate(date.getDate() + 7);
              }
            } else if (todo.days !== null) {
              const daysArray = daysOfTheWeek.map(day => todo.days[day]);

              const startDay = todo.today.toDate().getDay();

              for (var i = 0; i < 7; i++) {
                if (!daysArray[(startDay + i) % 7]) {
                  continue;
                }

                const date = todo.today.toDate();
                date.setHours(
                  todo.time.toDate().getHours(),
                  todo.time.toDate().getMinutes(),
                );
                date.setDate(date.getDate() + i);

                while (compareByDate(date, todo.date.toDate()) < 0) {
                  RNCalendarEvents.saveEvent(
                    `Take ${todo.medication.genericName}`,
                    {
                      startDate: date.toISOString(),
                      endDate: date.toISOString(),
                    },
                  );
                  date.setDate(date.getDate() + 7);
                }
              }
            }
          }
        })
        .catch(e => console.error(e));

      // RNCalendarEvents.saveEvent(`Take ${todo.medication.genericName}`, {

      // })
    });
  });
};

const CalendarScreen = (): JSX.Element => {
  const [items, setItems] = useState({});

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        renderItem={(item, firstItemInDay) => {
          return <AgendaItem item={item} />;
        }}
        loadItemsForMonth={month => loadMonth(month, items, setItems)}
        theme={{
          backgroundColor: WHITE,
        }}
      />
      <FloatingAction
        actions={[
          {
            text: 'Export to Google Calendar',
            name: 'export',
            icon: (
              <Ionicons
                style={{margin: 0, paddingBottom: 10, alignSelf: 'center'}}
                name="clipboard-outline"
                size={40}
              />
            ),
          },
        ]}
        onPressItem={() => {
          try {
            addTodosToCalendar();
          } catch (e) {
            console.log(e);
          }
          // console.log("req")
          // RNCalendarEvents.requestPermissions(false);
          // RNCalendarEvents.checkPermissions(false).then(res => console.log(res));
        }}
      />
    </View>
  );
};

export default CalendarScreen;
