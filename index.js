/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Notifications } from 'react-native-notifications';

Notifications.registerRemoteNotifications();

Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
    // TODO: Send the token to my server so it could send back push notifications...
    console.log("Device Token Received", event.deviceToken);
});
Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
    console.error(event);
});

AppRegistry.registerComponent(appName, () => App);
