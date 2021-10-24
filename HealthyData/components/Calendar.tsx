import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {displayTime, displayDate, renderName} from '../utils/Display';

import {Agenda} from 'react-native-calendars';
import {DateData} from 'react-native-calendars/src/types';
import {getTodosMonth} from '../services/calendar';
import {styles} from '../style/Styles';
import {BLUE, LIGHT, ORANGE, WHITE} from '../style/Colours';
import {RenderRefill, RenderTodoItem} from './Home';
import {isTemplateMiddle} from 'typescript';
import {TodoItem} from '../@types/Schema';

const AgendaItem = ({item}) => {
  return item.type === 'refill' ? (
    <View style={[styles.item, {borderColor: BLUE, flexDirection:"column", marginRight: 2, paddingBottom: 10}]}>
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
            width: 60
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
              {justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.5},
            ]}>
            <Text style={styles.tileHeading}>
              {renderName(todo.medication.genericName)}
            </Text>
            <Text
              style={[
                {
                  backgroundColor: ORANGE,
                  padding: 0
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

const CalendarScreen = (): JSX.Element => {
  const [items, setItems] = useState({});

  return (
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
  );
};

export default CalendarScreen;
