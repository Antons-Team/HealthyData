import auth from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {LocalAuthSettings} from '../auth/reducer';

export const signInAnonymous = async () => {
  try {
    await auth().signInAnonymously();
  } catch (e) {
    console.error(e);
  }
};

export const signUpEmail = async (email: string, password: string) => {
  // TODO: error handling for empty inputs
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
};

export const signInEmail = async (email: string, password: string) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async () => {
  await auth().signOut();
};

export const saveLocalAuthSettings = async (settings: LocalAuthSettings) => {
  await EncryptedStorage.setItem('localAuthSettings', JSON.stringify(settings));
};

export const resetLocalAuth = async () => {
  await EncryptedStorage.removeItem('localAuthSettings');
};
