import firebase, {messaging} from 'react-native-firebase';
import firestore from '@react-native-firebase/firestore';
import {TodoItem} from '../@types/Schema';
import auth from '@react-native-firebase/auth';
import {renderName} from '../utils/Display';
import {compareByDate, daysOfTheWeek} from '../utils/Dates';

const scheduleNotification = (todo: TodoItem, time: number) => {
  const notification = new firebase.notifications.Notification();
  notification.setTitle(
    `Reminder: take ${renderName(todo.medication.genericName)}  -  ${todo.doses} doses`,
  );
  notification.setSubtitle(`${todo.doses} doses`);
  notification.android.setChannelId('pillx');

  firebase.notifications().scheduleNotification(notification, {
    fireDate: time,
  });

  firestore()
    .doc(`users/${auth().currentUser?.uid}/todos/${todo.id}`)
    .collection('notifications')
    .add({
      time: firestore.Timestamp.fromDate(new Date(time)),
      notificationId: notification.notificationId,
    });
};

export const scheduleNotifications = (todo: TodoItem) => {
  if (todo.days === null && todo.intervalDays !== null) {
    // interval days
    const date = todo.intervalDays.startingDate.toDate();
    date.setHours(
      todo.time.toDate().getHours(),
      todo.time.toDate().getMinutes(),
    );

    while (compareByDate(date, todo.date.toDate()) < 0) {
      scheduleNotification(todo, date.getTime());

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
        scheduleNotification(todo, date.getTime());
        date.setDate(date.getDate() + 7);
      }
    }
  }
};
