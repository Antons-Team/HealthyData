import {messaging} from 'react-native-firebase';

export const checkPermission = async () => {
  const enabled = await messaging().hasPermission();
  if (enabled) {
    const token = await messaging().getToken();
    console.log('token', token);
  }
};
