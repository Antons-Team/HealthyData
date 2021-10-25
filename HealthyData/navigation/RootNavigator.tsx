import React, {ReactElement} from 'react';
import {useEffect} from 'react';
import {useAuth} from '../auth/provider';
import AuthNavigator from './AuthNavigator';
import auth from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  LocalAuthSettings,
  LocalAuthState,
  SignedInState,
} from '../auth/reducer';
import Loading from '../components/Loading';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import LocalAuth from './LocalAuth';
import TouchID from 'react-native-touch-id';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WHITE} from '../style/Colours';
import {checkPermission} from '../services/notifications';
import firebase from 'react-native-firebase';

const RootNavigator = (): ReactElement => {
  const {
    state: authState,
    handleSignIn,
    handleSignOut,
    setLocalAuthSettings,
    setLocalAuthState,
    setFingerprintEnabled,
  } = useAuth();

  // checkPermission().then(() => {
  //   console.log('done');
  // });

  useEffect(() => {
    console.log('did');
    const channel = new firebase.notifications.Android.Channel(
      'pillx',
      'pillx channel name',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('');
    firebase.notifications().android.createChannel(channel);

    // This listener triggered when notification has been received in foreground
    firebase.notifications().onNotification(notification => {
      const {title, body} = notification;
      notification.android.setChannelId('pillx');
      notification.android.setPriority(
        firebase.notifications.Android.Priority.High,
      );
      firebase.notifications().displayNotification(notification);
    });

    firebase.notifications().onNotificationOpened(notificationOpen => {
      const {title, body} = notificationOpen.notification;
      firebase.notifications().removeAllDeliveredNotifications();
    });

    // const date = new Date();
    // date.setSeconds(date.getSeconds() + 20);
    // console.log(date.toTimeString());

    // const notification = new firebase.notifications.Notification();
    // notification.setTitle('hello');
    // notification.setSubtitle('shit');
    // notification.android.setChannelId('pillx');

    // firebase.notifications().scheduleNotification(notification, {
    //   fireDate: date.getTime(),
    // });

    GoogleSignin.configure({
      webClientId:
        '517643624241-iv7hii7n7nju0mokp420eng8lbvkv6f8.apps.googleusercontent.com',
    });

    getLocalAuthSettings();
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        handleSignIn();
      } else {
        handleSignOut();
      }
    });
    return subscriber;
  }, []);

  const getLocalAuthSettings = async () => {
    await getFingerprintEnabled();
    try {
      const localAuth = await EncryptedStorage.getItem('localAuthSettings');
      if (localAuth !== null) {
        // local auth already set
        const localAuthSettings: LocalAuthSettings = JSON.parse(localAuth);
        setLocalAuthSettings(localAuthSettings);
        setLocalAuthState(
          localAuthSettings.fingerprint || localAuthSettings.pin
            ? LocalAuthState.signedOut
            : LocalAuthState.signedIn,
        );
      } else {
        setLocalAuthState(LocalAuthState.asking);
        //maybe dont need this
      }
    } catch (e) {
      console.error(e);
      setLocalAuthState(LocalAuthState.asking);
      //maybe dont need this?
    }
  };

  const getFingerprintEnabled = async () => {
    try {
      await TouchID.isSupported();
      setFingerprintEnabled(true);
    } catch (e) {
      setFingerprintEnabled(false);
    }
  };

  if (
    authState.isSignedIn === SignedInState.loading ||
    authState.localAuthState === LocalAuthState.loading
  ) {
    return <Loading />;
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: WHITE,
        },
      }}>
      {authState.isSignedIn === SignedInState.signedOut ? (
        <AuthNavigator />
      ) : (
        <LocalAuth />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
