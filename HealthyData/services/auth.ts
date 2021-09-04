/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import auth from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {LocalAuthSettings} from '../auth/reducer';
import firestore from '@react-native-firebase/firestore';
import { LoginManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
    await auth().createUserWithEmailAndPassword(email, password).then(cred => {
      return firestore().collection('users').doc(cred.user.uid).set({
        firstName: null,
        lastName: null,
        phoneNumber: null,
        country: null,
        state: null,
        todos: [],
      });
    });
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
  LoginManager.logOut();
  await GoogleSignin.revokeAccess();
  await GoogleSignin.signOut();
};

export const saveLocalAuthSettings = async (settings: LocalAuthSettings) => {
  await EncryptedStorage.setItem('localAuthSettings', JSON.stringify(settings));
};

export const resetLocalAuth = async () => {
  await EncryptedStorage.removeItem('localAuthSettings');
};
