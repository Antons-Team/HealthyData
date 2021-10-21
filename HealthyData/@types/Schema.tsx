// note: the medication data is duplicated instead of foreign keyed
// apparently this is best practise for document based NoSQL dbs so wherever
// a new todo item is added you query for the correct medication data
// and insert that as well

import {Timestamp} from '@firebase/firestore-types';
import {Days} from './Types';
// we'll enforce referential transparency using these types instead of
// in the firestore schema, e.g. if the user adds 'panadol' add the panadol
// MedicationItem to the TodoItem

export type UserDocument = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  country: string | null;
  state: string | null;
  todos: Array<TodoItem>;
};

export type SideEffect = {
  name: string;
  freq: string;
};

export type MedicationItem = {
  id: string;
  genericName: string;
  brandNames: string[];
  description: string[];
  indications: string[];
  sideEffects: SideEffect[];
};

export type MedicationsTakenItem = {
  id: string;
  time: Timestamp;
  medicationId: string;
  medication: MedicationItem;
};

export type TodoItem = {
  id: string;
  date: Timestamp;
  today: Timestamp;
  time: Timestamp;
  refillDate: Timestamp;
  supply: number;
  doses: number;
  days: Days | null;
  intervalDays: {interval: number; startingDate: Timestamp} | null;
  medication: MedicationItem;
  medicationId: string;
};
