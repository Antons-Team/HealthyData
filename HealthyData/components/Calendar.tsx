import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {renderName} from '../utils/Display';

import {Agenda} from 'react-native-calendars';
import {DateData} from 'react-native-calendars/src/types';
import {getCurrentTodos, getTodosMonth} from '../services/calendar';
import {styles} from '../style/Styles';
import {BLUE, ORANGE, WHITE} from '../style/Colours';
import {RenderTodoItem} from './Home';
import {TodoItem} from '../@types/Schema';
import {FloatingAction} from 'react-native-floating-action';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNCalendarEvents from 'react-native-calendar-events';
import {compareByDate, daysOfTheWeek} from '../utils/Dates';

/**
 * @returns Component for a single calendar todo item
 */
const AgendaItem = ({item, firstItemInDay}) => {
  return (
    <View
      style={{
        marginTop: firstItemInDay ? 30 : 0,
      }}>
      {item.type === 'refill' ? (
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
      )}
    </View>
  );
};

/**
 * @returns all calendar events for the user in a single month
 */
const loadMonth = async (
  month: DateData,
  items: {},
  setItems: {(value: React.SetStateAction<{}>): void; (arg0: any): void},
) => {
  const res = await getTodosMonth(month);
  setItems({...items, ...res});
  return month;
};

/**
 * exports the users medication reminders device calendar
 */
const addTodosToCalendar = () => {
  // get all current reminders for the user
  getCurrentTodos().then(todos => {
    todos.forEach(todo => {
      const dateString = todo.refillDate.toDate().toISOString();

      // get all events that have already been added to the calendar
      RNCalendarEvents.fetchAllEvents(
        todo.today.toDate().toISOString(),
        todo.date.toDate().toISOString(),
      )
        .then(events => {
          // true iff the reminders to take a medication have already been added
          const todoAlreadyAdded = events.some(
            event =>
              event.title
                .toLowerCase()
                .includes(todo.medication.genericName.toLowerCase()) &&
              event.title.toLowerCase().startsWith('take'),
          );

          // true iff the reminders to refill the medication have already been added
          const refillAlreadyAdded = events.some(
            event =>
              event.title
                .toLowerCase()
                .includes(todo.medication.genericName.toLowerCase()) &&
              event.title.toLowerCase().startsWith('refill') &&
              event.endDate === todo.refillDate.toDate().toISOString(),
          );

          if (!refillAlreadyAdded) {
            // add a refill reminder to the calendar if it has not already been added
            RNCalendarEvents.saveEvent(
              `Refill ${todo.medication.genericName}`,
              {
                startDate: dateString,
                endDate: dateString,
              },
            ).catch(e => console.error(e));
          }

          if (!todoAlreadyAdded) {
            // add all reminders for a medication if it has not already been added
            if (todo.days === null && todo.intervalDays !== null) {
              // medication is taken on an interval
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
              // medication is taken on the same day each week
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
    });
  });
};

/**
 * @returns Screen component containing the calendar
 */
const CalendarScreen = (): JSX.Element => {
  const [items, setItems] = useState({});

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        renderItem={(item, firstItemInDay) => {
          return <AgendaItem {...{item, firstItemInDay}} />;
        }}
        loadItemsForMonth={month => loadMonth(month, items, setItems)}
        theme={{
          backgroundColor: WHITE,
        }}
      />
      <FloatingAction
        position="left"
        distanceToEdge={5}
        color={BLUE}
        floatingIcon={
          <Ionicons
            style={{margin: 0, alignSelf: 'center'}}
            name="ellipsis-vertical-outline"
            size={20}
            color={WHITE}
          />
        }
        actions={[
          {
            text: 'Export to Calendar',
            name: 'export',
            color: BLUE,
            icon: (
              <Ionicons
                style={{margin: 0, alignSelf: 'center'}}
                name="calendar-outline"
                size={20}
                color={WHITE}
              />
            ),
          },
        ]}
        onPressItem={() => {
          addTodosToCalendar();
        }}
      />
    </View>
  );
};

export default CalendarScreen;
