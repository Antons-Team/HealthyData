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
    <RenderTodoItem item={item.todo} today={item.day} />
  );
  // <View style={styles.item}>
  //   <Text style={styles.info}>{displayTime(item.todo.time.toDate())}</Text>
  //   <Text style={styles.time}>{item.name}</Text>
  //   <Text style={styles.info}>{item.todo.doses} doses</Text>
  // </View>
};

const CalendarScreen = (): JSX.Element => {
  const [items, setItems] = useState({
    // '2021-10-23': [{name: 'item 1 - any js object', height:1, day:'a'}, {name: 'item 1 - any js object', height:1, day:'b'}, {name: 'item 1 - any js object', height:1, day:'c'}],
    '2021-10-02': [{name: 'item 1 - any js object'}],
  });

  const loadMonth = async (month: DateData) => {
    const res = await getTodosMonth(month);
    setItems({...items, ...res});
    // setItems({'2021-10-03': [{name: 'item 1 - any js object'}]});
    return month;
  };

  return (
    <Agenda
      items={items}
      renderItem={(item, firstItemInDay) => {
        return <AgendaItem item={item} />;
      }}
      loadItemsForMonth={loadMonth}
    />
  );
};

export default CalendarScreen;
