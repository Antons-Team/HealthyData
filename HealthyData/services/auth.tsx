import auth from '@react-native-firebase/auth';

export const signInAnonymous = async () => {
  try {
    const user = await auth().signInAnonymously();
    return user;
  } catch (e) {
    console.error(e);
  }
};

export const signUpEmail = async (email: string, password: string) => {
  try {
    const user = await auth().createUserWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const signInEmail = async (email: string, password: string) => {
  try {
    const user = await auth().signInWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    console.error(error);
  }
};
