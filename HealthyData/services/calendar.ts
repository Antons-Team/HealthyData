import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from '@react-native-firebase/auth';
import { TodoItem } from '../@types/Schema';
import { DateData } from 'react-native-calendars/src/types';


const isToday = (todo: TodoItem, date: Date) => {
  if (todo.days == null) {
    const interval = todo.intervalDays?.interval;
    const startDate = todo.intervalDays?.startingDate.toDate();
    if (startDate && interval) {

      const oneDay = 1000 * 60 * 60 * 24; // in ms
      const daysInbetween = (Math.floor(startDate?.getTime() / oneDay) 
          - Math.floor(date.getTime() / oneDay));

      console.log(daysInbetween, interval, daysInbetween % interval,  'days');
                
      return (daysInbetween % interval) == 0; 
    }
    return false;
  }


  const today = date.getDay();
  if (today == 0) {
    return todo.days.sunday;
  } else if (today == 1) {
    return todo.days.monday;
  } else if (today == 2) {
    return todo.days.tuesday;
  } else if (today == 3) {
    return todo.days.wednesday;
  } else if (today == 4) {
    return todo.days.thursday;
  } else if (today == 5) {
    return todo.days.friday;
  } else {
    return todo.days.saturday;
  }
};


export const getTodosMonth = async (month: DateData) => {


  // const monthStart = firestore.Timestamp.fromDate(new Date(month.dateString));
  const monthStart = new Date(month.dateString);
  monthStart.setDate(1);  
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthStart.getMonth() + 1);

  
  return firestore().collection(`users/${auth().currentUser?.uid}/todos`)
    // last day to take medication is after start of the month
    .where( 'date', '>=', firestore.Timestamp.fromDate(monthStart))
    .get()
    .then(snapshot => {
      const docs = snapshot.docs;
    
      const data = docs
        .map(doc => {
          return (doc.data()) as TodoItem;
        })
      // first day to take medication is before end of month
        .filter(todo => {
          return todo.today.toDate() < monthEnd;});


      const allDays = {};
      let loop = new Date(monthStart);
      while(loop <= monthEnd){
        // const dateString = `${loop.getFullYear()}-${
        //   loop.getMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false})
        // }-${
        //   loop.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false})
        // }`;  
        const dateString = loop.toISOString().split('T')[0];
        const todaysTodos: { todo: TodoItem; name: string }[] = [];
        data.forEach(todo => {
          if (isToday(todo, loop)) {
            todaysTodos.push({todo, 'name': todo.medication.genericName, type: 'todo' });
          }
          if (todo.refillDate.toDate().toDateString() === loop.toDateString()) {
            todaysTodos.push({todo, 'name': todo.medication.genericName, type: 'refill'});
          }
        });
        allDays[dateString]= todaysTodos;

        const newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
      }
      return allDays;
    });

  //   const data = docs.map(doc => {
  //     return (doc.data()) as TodoItem;
  //   });

  //   const todos = data.filter(todo => {
  //     const today = new Date();
  //     return today < todo.date.toDate() && isToday(todo);
  //   });
  //   setTodos(todos);

  //   // get refill data
  //   const refills = data.filter(todo => {
  //     let date = new Date();
  //     date = addDays(30, date);
  //     return todo.refillDate.toDate() < date;
  //   });
  //   setRefills(refills);

  // }).catch(e => {
  //   console.error(e);
  // });
};