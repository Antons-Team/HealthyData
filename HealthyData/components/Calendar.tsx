import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {displayTime, displayDate} from '../utils/Display';

import {Agenda} from 'react-native-calendars';
import {DateData} from 'react-native-calendars/src/types';
import {getTodosMonth} from '../services/calendar';
import {styles} from '../style/Styles';
import {BLUE, LIGHT} from '../style/Colours';
import {RenderTodoItem} from './Home';
import {isTemplateMiddle} from 'typescript';

const AgendaItem = ({item}) => {
  return item.type === 'refill' ? (
    <View style={[styles.item, {borderColor: BLUE}]}>
      <Text style={styles.info}>refill</Text>
      <Text style={styles.time}>{item.name}</Text>
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
    />
  );
};

export default CalendarScreen;
