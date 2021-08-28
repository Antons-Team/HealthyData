// note: the medication data is duplicated instead of foreign keyed
// apparently this is best practise for document based NoSQL dbs so wherever
// a new todo item is added you query for the correct medication data
// and insert that as well

import { Timestamp } from '@firebase/firestore-types';

// we'll enforce referential transparency using these types instead of 
// in the firestore schema, e.g. if the user adds 'panadol' add the panadol
// MedicationItem to the TodoItem

export type MedicationItem = {
    id: string;
    name: string;
    brand_name: string;
    description: string;
    dosage_amount: number;
    dosage_units: string;
};

export type TodoItem = {
    id: string;
    date: Timestamp;
    amount: number;
    medication: MedicationItem;
};