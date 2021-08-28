// note: the medication data is duplicated instead of foreign keyed
// apparently this is best practise for document based NoSQL dbs so wherever
// a new todo item is added you query for the correct medication data
// and insert that as well

import { Timestamp } from '@firebase/firestore-types';

// we'll enforce referential transparency using these types instead of 
// in the firestore schema, e.g. if the user adds 'panadol' add the panadol
// MedicationItem to the TodoItem

export type UserDocument = {
    id: string,
    firstName: string | null,
    lastName: string | null,
    phoneNumber: string | null,
    country: string | null,
    state: string | null,
    todos: Array<TodoItem>,
}

export type MedicationItem = {
    id: string;
    name: string;
    brand_name: string;
    dosage_amount: number;
    dosage_units: string;
    description: string;
    warnings: string;
    side_effects: string;
};

export type TodoItem = {
    id: string;
    date: Timestamp;
    amount: number;
    medication: MedicationItem;
};