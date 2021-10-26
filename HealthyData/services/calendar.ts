import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {MedicationItem, MedicationsTakenItem, TodoItem} from '../@types/Schema';
import {DateData} from 'react-native-calendars/src/types';
import {useScrollToTop} from '@react-navigation/native';
import {
  addDays,
  compareByDate,
  compareByTime,
  daysOfTheWeek,
} from '../utils/Dates';
import Medications from '../components/Medications';
import DropDownPicker from 'react-native-dropdown-picker';
import {decorator} from '@babel/types';

export const updateSupply = (todo: TodoItem, supply: number) => {
  return firestore()
    .doc(`users/${auth().currentUser?.uid}/todos/${todo.id}`)
    .update({
      supply,
      refillDate: firestore.Timestamp.fromDate(calculateRefillDate(todo)),
    });
};

export const getCurrentTodos = () => {
  return firestore()
    .collection(`users/${auth().currentUser?.uid}/todos`)
    .where('date', '>=', firestore.Timestamp.fromDate(new Date()))
    .get()
    .then(snapshot => {
      const docs = snapshot.docs;

      const data = docs.map(doc => {
        return {id: doc.id, ...doc.data()} as TodoItem;
      });

      return data;
    });
};

const calculateRefillDate = (todo: TodoItem): Date => {
  let refillDate = new Date();

  if (todo.intervalDays === null && todo.days !== null) {
    const daysPerWeek = Object.values(todo.days).filter(Boolean).length;
    refillDate = addDays(todo.supply / daysPerWeek, refillDate);
    let dayOfWeek = 0;
    let count = todo.supply % daysPerWeek;
    for (let i = 0; i < 7; ++i) {
      if (Object.values(todo.days)) {
        --count;
      }
      if (count == 0) {
        dayOfWeek = i;
        break;
      }
    }
    refillDate = addDays(dayOfWeek, refillDate);
  } else if (todo.intervalDays?.startingDate !== undefined) {
    const intervalStartDate = todo.intervalDays.startingDate.toDate();
    refillDate = addDays(
      todo.intervalDays.interval * todo.supply,
      intervalStartDate,
    );
  }
  refillDate.setSeconds(0, 0);

  return refillDate;
};

const generateMedicationsTakenId = (todo: TodoItem, time: Date) => {
  time.setSeconds(0, 0);
  return `${auth().currentUser?.uid}${time.toISOString()}${todo.medication.id}`;
};

export const takeMedication = async (todo: TodoItem, time: Date) => {
  time.setSeconds(0, 0);
  const takenMedication = {
    medication: todo.medication,
    time: firestore.Timestamp.fromDate(time),
    medicationId: todo.medication.id,
  };

  const id = generateMedicationsTakenId(todo, time);

  firestore()
    .doc(`users/${auth().currentUser?.uid}`)
    .collection('medicationsTaken')
    .doc(id)
    .set(takenMedication);

  todo.supply = Math.max(todo.supply - todo.doses, 0);

  firestore()
    .doc(`users/${auth().currentUser?.uid}/todos/${todo.id}`)
    .update({
      supply: todo.supply,
      refillDate: firestore.Timestamp.fromDate(calculateRefillDate(todo)),
    });
};

export const untakeMedication = async (todo: TodoItem, time: Date) => {
  const id = generateMedicationsTakenId(todo, time);

  firestore()
    .doc(`users/${auth().currentUser?.uid}/medicationsTaken/${id}`)
    .delete();

  todo.supply = Math.max(todo.supply + todo.doses, 0);

  firestore()
    .doc(`users/${auth().currentUser?.uid}/todos/${todo.id}`)
    .update({
      supply: todo.supply,
      refillDate: firestore.Timestamp.fromDate(calculateRefillDate(todo)),
    });
};

export const getHasTaken = async (medication: MedicationItem, time: Date) => {
  time.setSeconds(0, 0);
  return firestore()
    .collection(`users/${auth().currentUser?.uid}/medicationsTaken`)
    .where('medicationId', '==', medication.id)
    .where('time', '==', firestore.Timestamp.fromDate(time))
    .limit(1)
    .get()
    .then(snapshot => {
      return !snapshot.empty;
    });
};

export const getIsTaking = async (medication: MedicationItem) => {
  return firestore()
    .collection(`users/${auth().currentUser?.uid}/todos`)
    .where('medicationId', '==', medication.id)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 0) {
        return false;
      }

      return snapshot.docs.some(doc => {
        const todo = {...doc.data(), id: doc.id} as TodoItem;

        return todo.date.toDate() > new Date();
      });
    });
};

export const getNextDose = (todo: TodoItem) => {
  const today = new Date();
  if (todo.days == null) {
    // interval days
    if (todo.intervalDays == null) {
      //unreachable
      return;
    }
    const interval = todo.intervalDays.interval;
    const startDate = todo.intervalDays.startingDate.toDate();
    const oneDay = 1000 * 60 * 60 * 24; // in ms
    const daysInbetween =
      Math.floor(startDate?.getTime() / oneDay) -
      Math.floor(today.getTime() / oneDay);

    const intervalElapsed = daysInbetween % interval;
    if (intervalElapsed == 0 && compareByTime(todo.time.toDate(), today) > 0) {
      // doing it today
      return today;
    } else {
      today.setDate(today.getDate() + (interval - intervalElapsed));
      return today;
    }
  } else {
    // same days every week
    const days = [...daysOfTheWeek];
    if (
      todo.days[days[today.getDay()]] &&
      compareByTime(todo.time.toDate(), today) > 0
    ) {
      return today;
    }
    today.setDate(today.getDate() + 1);

    while (!todo.days[days[today.getDay()]]) {
      today.setDate(today.getDate() + 1);
    }
    return today;
  }
};

export const isToday = (todo: TodoItem, date: Date) => {
  if (compareByDate(todo.date.toDate(), date) < 0) {
    return false;
  }

  if (todo.days == null) {
    const interval = todo.intervalDays?.interval;
    const startDate = todo.intervalDays?.startingDate.toDate();
    if (startDate && interval) {
      const oneDay = 1000 * 60 * 60 * 24; // in ms
      const daysInbetween =
        Math.floor(startDate?.getTime() / oneDay) -
        Math.floor(date.getTime() / oneDay);
      return daysInbetween % interval == 0;
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
  const monthStart = new Date(month.dateString);
  monthStart.setDate(1);
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthStart.getMonth() + 1);

  return (
    firestore()
      .collection(`users/${auth().currentUser?.uid}/todos`)
      // last day to take medication is after start of the month
      .where('date', '>=', firestore.Timestamp.fromDate(monthStart))
      .get()
      .then(snapshot => {
        const docs = snapshot.docs;

        const data = docs
          .map(doc => {
            return {id: doc.id, ...doc.data()} as TodoItem;
          })
          // first day to take medication is before end of month
          .filter(todo => {
            return todo.today.toDate() < monthEnd;
          });

        const allDays = {};
        let loop = new Date(monthStart);
        while (loop <= monthEnd) {
          const dateString = loop.toISOString().split('T')[0];

          const todaysTodos: {todo: TodoItem; name: string}[] = [];
          const todaysRefills: TodoItem[] = [];
          data.forEach(todo => {
            if (isToday(todo, loop)) {
              todaysTodos.push({
                todo,
                name: todo.medication.genericName,
                type: 'todo',
                day: new Date(dateString),
              });
            }
            if (
              todo.refillDate.toDate().toDateString() === loop.toDateString()
            ) {
              todaysRefills.push(todo);
              // todaysTodos.push({
              //   todo,
              //   name: todo.medication.genericName,
              //   type: 'refill',
              //   day: new Date(dateString),
              // });
            }
          });

          todaysTodos.sort((item1, item2) =>
            compareByTime(item1.todo.time.toDate(), item2.todo.time.toDate()),
          );

          const todosAndRefill =
            todaysRefills.length > 0
              ? [
                  {
                    type: 'refill',
                    todos: todaysRefills,
                    day: new Date(dateString),
                    name: 'refill',
                  },
                  ...todaysTodos,
                ]
              : todaysTodos;

          allDays[dateString] = todosAndRefill;

          const newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
        }
        return allDays;
      })
  );
};

export const getCurrentlyTakingTodos = () => {
  return (
    firestore()
      .collection(`users/${auth().currentUser?.uid}/todos`)
      // last day to take medication is after now
      .where('date', '>=', firestore.Timestamp.fromDate(new Date()))
      .get()
      .then(snapshot => {
        const docs = snapshot.docs;

        const data = docs.map(doc => {
          return {id: doc.id, ...doc.data()} as TodoItem;
        });

        return data;
      })
  );
};

export const getPreviouslyTakenTodos = () => {
  return (
    firestore()
      .collection(`users/${auth().currentUser?.uid}/todos`)
      // last day to take medication is before now
      .where('date', '<=', firestore.Timestamp.fromDate(new Date()))
      .get()
      .then(snapshot => {
        const docs = snapshot.docs;

        const data = docs.map(doc => {
          return {id: doc.id, ...doc.data()} as TodoItem;
        });

        return data;
      })
  );
};
