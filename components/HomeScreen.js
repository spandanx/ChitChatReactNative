import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, Button, ActivityIndicator, ScrollView, PermissionsAndroid, TouchableOpacity } from 'react-native';
// import { TouchableHighlight } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {socketURL} from '../properties/networks';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {phoneToIdUrlPath} from '../properties/networks';
import Contacts from 'react-native-contacts';
import {styles} from '../style/styles';
import uuid from 'react-native-uuid';
import OptionsMenu from "react-native-option-menu";
// import PushNotification from "react-native-push-notification";
// import {Notifications} from 'react-native-notifications';
// import notifee from '@notifee/react-native';
import notifee, {EventType} from '@notifee/react-native';
// import { useToast } from "react-native-toast-notifications";
import Toast from 'react-native-root-toast';
import {toastProperties} from '../style/styles';


var stompClient = null;

export const HomeScreen = (props) => {


//     [{
//         lastActivity: 1666880022,
//         displayName: "Dean",
//         lastChat: 'Hi',
//         imageUrl: 'someurl',
//         ChatType: 'PRIVATE',
//         uuid: 'dummyuuid1',
//         subscriptionURL: '/queue/user1'
//     },
//     {
//         lastActivity: 1666880122,
//         displayName: "John",
//         lastChat: 'Hello',
//         imageUrl: 'someurl',
//         ChatType: 'PRIVATE',
//         uuid: 'dummyuuid2',
//         subscriptionURL: '/queue/user2'
//     },
//     {
//         lastActivity: 1666880122,
//         displayName: "Dummy_group1",
//         lastChat: 'Hello',
//         imageUrl: 'someurl',
//         ChatType: 'GROUP',
//         uuid: 'dummy_group_uuid1',
//         subscriptionURL: '/topic/group1'
//     }
// 

    const [chatContacts, setChatContacts] = useState({});
    const [user, setUser] = useState('');
    const [uuidUser, setUuidUser] = useState('');
    const [userContactNo, setUserContactNo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [contactsModalVisible, setContactsModalVisible] = useState(false);
    const [contactNumber, setContactNumber] = useState("");
    const [contactName, setContactName] = useState("");
    const [allContacts, setAllContacts] = useState([]);
    const [allValidContacts, setAllValidContacts] = useState(new Map());
    const [phNoToContactMap, setPhNoToContactMap] = useState({});
    const [selectMap, setSelectMap] = useState(new Map());
    const [selectedContacts, setSelectedContacts] = useState({});
    const [connected, setConnected] = useState(false);
    const [allChat, setAllChat] = useState(new Map());
    const [openedChat, setOpenedChat] = useState("");
    const [toBeEditGroup, setToBeEditGroup] = useState({});
    const [groupNameToEdit, setGroupNameToEdit] = useState("");
    const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);

    // const toast = useToast();

    useEffect(()=>{
        checkUserinStorage();
        // connect();
        fetchChatInfo();
        getContacts();
        registerNotification();
        // createChannels();
        // return () => {
        //     console.log("EXIT FROM []");
        // }
          // | zoom-in

        return notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
              case EventType.DISMISSED:
                console.log('User dismissed notification', detail.notification);
                break;
              case EventType.PRESS:
                console.log('User pressed notification', detail.notification);
                console.log('Index - '+detail.notification.data.index);
                redirectFromNotification(detail.notification.data.index);
                break;
            }
          });

    }, []);

    useEffect(()=>{
        console.warn("useEffect uuidUser detected");
        if (uuidUser!=''){
            console.warn("Connecting");
            connect();
        }
        // return () => {
        //     console.log("EXIT FROM uuidUser");
        // }
    }, [uuidUser]);

    // useEffect(()=>{
    //     toast.show("Loaded the homescreen", {
    //         type: "normal",
    //         placement: "bottom",
    //         duration: 2000,
    //         offset: 30,
    //         animationType: "slide-in",
    //       });
    // },[toast]);

    // useEffect(() => {
    //     console.log("ON FOCUS************************");
 
    //     // Call only when screen open or when back on screen 
    //     if(isFocused){ 
    //         console.log("ON FOCUS IF ************************"); 
            
    //     }
    // }, [isFocused]);

    // useEffect(()=>{
    //     if (connected === true && Object.keys(chatContacts).length > 0){
    //         loopSubscribe(chatContacts);
    //     }
    //     // if (stompClient!=null){
    //     //     console.log("STOMP CLIENT ------ "+stompClient);
    //     // }
    //     // if (Object.keys(chatContacts).length > 0){
    //     //     console.log("chatContacts ------ ");
    //     //     console.log(chatContacts);
    //     // }
    // }, [connected, chatContacts]);

    useEffect(()=>{
        if (props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser!='' && props.navigation.state.params.currentUUID!='' && props.navigation.state.params.userContactNo!=''){
            console.log("SETTING ALL ************************");
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
            setUserContactNo(props.navigation.state.params.userContactNo);

            checkUserinStorage();
            // connect();
            fetchChatInfo();
            getContacts();
        }
        console.log("PROPS CHANGED");
        console.log((props.navigation.state!=undefined) + ", "+(props.navigation.state.params!=undefined)+", "+(props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser!='')+", "+(props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUUID!='')+", "+(props.navigation.state && props.navigation.state.params && props.navigation.state.params.userContactNo!=''));
        // console.log(props);
        // return () => {
        //     console.log("EXIT FROM props");
        // }
    }, [props.navigation.state.params?.currentUser, props.navigation.state.params?.currentUUID, props.navigation.state.params?.userContactNo]);

    // useEffect(()=>{
    //     storeChatInfo();

    //     // return () => {
    //     //     console.log("EXIT FROM chatContacts");
    //     // }
    // }, [chatContacts]);

    // useEffect(()=>{
    //     filterValidContacts();
    // }, [allContacts]);

    // useEffect(() => {
    //     if (props.navigation.isFocused()) {
    //         console.log("FOCUS CHANGED IN HOME"+props.navigation.isFocused());
    //         setOpenedChat("");
    //         console.log("Changed Opened Chat value: "+openedChat);
    //     }
    //   }, [props.navigation.isFocused()]);

    // const createChannels = () => {
    //     PushNotification.createChannel(
    //         {
    //           channelId: "id2", // (required)
    //           channelName: "Special messasge", // (required)
    //           channelDescription: "Notification for special message", // (optional) default: undefined.
    //           importance: 4, // (optional) default: 4. Int value of the Android notification importance
    //           vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    //         },
    //         (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    //       );
    // }

    const redirectFromNotification = async(index) => {
        let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
        if (chatInfo!=null){
            console.warn("FETCHED ALL CHAT");
            let localChatContact = JSON.parse(chatInfo);
            navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo(), chatDetails: localChatContact[index], stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: index});
        }
    }

    const registerNotification = () => {
        // Notifications.registerRemoteNotifications();

        // Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        // console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
        // completion({alert: false, sound: false, badge: false});
        // });

        // Notifications.events().registerNotificationOpened((notification, completion) => {
        // console.log(`Notification opened: ${notification.payload}`);
        // completion();
        // });
        // Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        //     console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
        //     completion({alert: false, sound: false, badge: false});
        //   });
      
        //   Notifications.events().registerNotificationOpened((notification, completion) => {
        //     console.log(`Notification opened: ${notification.payload}`);
        //     completion();
        //   });
              
        //     Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
        //     console.log("Notification Received - Background", notification.payload);
      
        //     // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        //     completion({alert: true, sound: true, badge: false});
        //       });
    }
    
    // const testFunction = (data) => {
    //     console.log("TEST FUNCTION");
    //     console.log(data);
    // }

    const handleNotification = async(item, index) => {

        console.log("NOTIFICATION");

        console.log(item);

        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
        id: 'Chat',
        name: 'Chat Notification',
        });

        // Display a notification
        await notifee.displayNotification({
        title: 'New messages from '+item.displayName,
        body: item.data,
        android: {
            channelId,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
            id: 'Chat',
            },
        },
        data: {index: index}
        });

        // // PushNotification.cancelAllLocalNotifications();
        // PushNotification.getChannels(function (channel_ids) {
        //     console.warn(channel_ids); // ['channel_id_1']
        // });

        // PushNotification.channelExists("test-channel", function (exists) {
        //     console.warn(exists); // true/false
        //   });

        // PushNotification.localNotification({
        //     channelId: "test-channel",
        //     title: "You clicked on " + item.displayName,
        //     message: item.displayName,
        //     bigText: item.displayName + " is one of the largest and most beatiful cities in ",
        //     color: "red",
        //     id: item.uuid
        // },
        // (created) => console.log(`createChannel returned '${created}'`)
        // );

        // PushNotification.localNotificationSchedule({
        //     channelId: "test-channel",
        //     title: "Alarm",
        //     message: "You clicked on " + item.country + " 20 seconds ago",
        //     date: new Date(Date.now() + 20 * 1000),
        //     allowWhileIdle: true,
        // });
        //   PushNotification.localNotification({
        //     channelId:'id2', //his must be same with channelid in createchannel
        //     title:'hello',
        //     message:'test message',
        //     data: {name: 'abb', user_func: testFunction}
        //     // test_function: 
        //   })
        // let localNotification = Notifications.postLocalNotification({
        //     body: "Local notification!",
        //     title: "Local Notification Title",
        //     silent: false,
        //     category: "SOME_CATEGORY",
        //     userInfo: { },
        //     fireDate: new Date(),
        // });
    }

    const checkAndSubscribe = async(destination, callback, params) => {
        console.log("checkAndSubscribe");
        if (!stompClient){
            console.warn("Stompcliet does not esist!");
            return;
        }
        if (params.id in stompClient.subscriptions){
            console.warn("Subscription already exists");
        }
        else{
            stompClient.subscribe(destination, callback, params);//{"id":uuidUser, "durable":true, "auto-delete":false}
            console.log("SUBSCRIBED");
        }
    }

    const getCurrentUUID = () => {
        if (props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUUID!=''){
            return props.navigation.state.params.currentUUID;
        }
        else{
            return uuidUser;
        }
    }

    const getCurrentUser = () => {
        if(props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser!=''){
            return props.navigation.state.params.currentUser;
        }
        else{
            return user;
        }
    }

    const getUserContactNo = () => {
        if (props.navigation.state && props.navigation.state.params && props.navigation.state.params.userContactNo!=''){
            return props.navigation.state.params.userContactNo;
        }
        else{
            return userContactNo;
        }
    }

    const truncateSpaces = (text) => {
        let truncatedtext = "";
        for (let i = 0; i<text.length; i++){
            if (text[i]!=' '){
                truncatedtext += text[i];
            }
        }
        return truncatedtext;
    }

    const  numberToContactTranslation = (number) => {
        let tempnumber = number;
        if (tempnumber && tempnumber.length>0 && tempnumber[0]=='+'){
            tempnumber = number.substring(1, number.length);
        }
        // console.log("TRANSLATION");
        // console.log(phNoToContactMap);
        // console.log("NUMBER"+number);
        if (tempnumber in phNoToContactMap){
            return phNoToContactMap[tempnumber];
        }
        else {
            return number;
        }
    }

    const subscribeToChatContact = async(contact) => {
        console.log(contact.displayName);
        if (contact.ChatType=='PRIVATE'){
            //queue subscription
            checkAndSubscribe('/queue/'+contact.subscriptionURL, onMessageReceived, {"id":contact.subscriptionURL+"_"+uuidUser});//{"id":1234, "durable":true, "auto-delete":false}
            console.log("SUBSCRIBED to QUEUE"+contact.displayName);
        }
        else if (contact.ChatType=='GROUP'){
            checkAndSubscribe('/topic/'+contact.subscriptionURL, onMessageReceived, {"id":contact.subscriptionURL+"_"+uuidUser, "durable":true, "auto-delete":false});//{"id":1234, "durable":true, "auto-delete":false}
            console.log("SUBSCRIBED to TOPIC"+contact.displayName);
        }
        else{
            console.log("WRONG CHAT TYPE");
        }
    }

    const loopSubscribe = async(contacts) => {
        console.log("LOOP ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        Object.keys(contacts).map(function(key, index) {
            subscribeToChatContact(contacts[key]);
          })
    }

    const filterValidContacts = async(contacts) => {
        // let validContacts = [];
        // setAllValidContacts([]);
        for (let contact of contacts) {
            if (contact.phoneNumbers.length>0){
                let phoneNumberOfContact = truncateSpaces(contact.phoneNumbers[0].number);
                if (phoneNumberOfContact.length>0 && phoneNumberOfContact[0]=='+'){
                    phoneNumberOfContact = phoneNumberOfContact.substring(1, phoneNumberOfContact.length);
                }
                let url = phoneToIdUrlPath+'?phonenumber='+phoneNumberOfContact;
                fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.length==0){
                        console.log("Contact number does not exist "+ url);
                    }
                    else{
                        // console.log(contact);
                        contact['userUUID'] = responseJson[0].id;
                        contact['truncatedPhoneNo'] = responseJson[0].phonenumber;
                        // console.log(contact);
                        // console.log(responseJson);
                        if (allValidContacts.length==0){
                            // setAllValidContacts([contact]);
                            setAllValidContacts({[responseJson[0].id] : contact});
                        }
                        else{
                            // setAllValidContacts(allValidContacts => [...allValidContacts, contact]);
                            setAllValidContacts(allValidContacts => ({ ...allValidContacts, [responseJson[0].id]: contact}));
                        }

                        if (Object.keys(phNoToContactMap).length==0){
                            setPhNoToContactMap({[responseJson[0].phonenumber]: contact.displayName});
                        }
                        else{
                            setPhNoToContactMap(phNoToContactMap => ({ ... phNoToContactMap, [responseJson[0].phonenumber]: contact.displayName}));
                        }
                        // validContacts.push(contact);
                        //----------
                    }
                    
                })
                .catch((err) => console.log(err));
            }
            
        };
        // setAllValidContacts(validContacts);
        console.log("FILTER DONE");
    }

    // const storeChatInfo = async(allcontacts) => {
    //     try {
    //         console.log("STORING------");
    //         console.log();
    //         await AsyncStorage.setItem("__CHATINFO__", JSON.stringify(allcontacts));
    //         console.log("Stored info");
    //       } catch (e) {
    //         console.log(e);
    //       }
    // }

    const modifyChat = async(modifiedArray, chatIndex) => {
        console.log("MODIFY CALLED");
        // console.log(modifiedArray);

        // let localChatContact = chatContacts;
        // let destinationContact = localChatContact[chatIndex];
        // let previousChatArray = destinationContact.chatArray;
        console.log("INDEX: "+chatIndex);
        // console.log("ALL");
        // console.log(chatContacts);
        // previousChatArray.push(newChat);

        let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                console.log("FETCHED ALL CHAT");
                let localChatContact = JSON.parse(chatInfo);

                // console.log("BEFORE MOD");
                // console.log(localChatContact[chatIndex].chatArray);
                localChatContact[chatIndex].chatArray = modifiedArray;
                // console.log("AFTER MOD");
                // console.log(localChatContact[chatIndex].chatArray);
                // console.log("FULL");
                // console.log(localChatContact);
                setInStorage('__CHATINFO__', localChatContact);
                setChatContacts(localChatContact);
                // storeChatInfo(localChatContact);
                // console.log("EXPECTED CHAT INDEX "+chatUUIDIndex);
                // console.log("OPENED CHAT INDEX "+openedChat);
                // console.log(openedChat);
                // console.log("ISFOCUSED");
                // console.log(props.navigation.isFocused());
                // if (props.navigation.isFocused()===false && openedChat==chatUUIDIndex){
                // console.warn("chatContacts[chatUUIDIndex]");
                // console.warn(chatContacts[chatIndex]);
                // console.warn("localChatContact");
                // console.warn(localChatContact);
                navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo(), chatDetails: localChatContact[chatIndex], stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: chatIndex});
            // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: chatUUIDIndex
            }
        // }

    }

    const fetchChatInfo = async() => {
        try {
            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                console.log("FETCHED ALL CHAT");
                setChatContacts(JSON.parse(chatInfo));
                console.log(chatInfo);
            }
            else{
                console.log("Could not find userName");
                props.navigation.navigate('Login');
            }
          } catch (e) {
            console.log(e);
          }
    }

    const connect = () => {
        let Sock = new SockJS(socketURL);
        stompClient = over(Sock);
        console.log(stompClient);
        stompClient.connect({}, onConnected, onConnectError);//{"client-id": props.navigation.state.params.currentUser }
    }

    const onConnected = async() => {
        console.log("Connected");
        // setConnected(true);
        // await delay(2000);
        subcribeToInfoQueue();
        loopSubscribe(chatContacts);
    }

    const onConnectError = (error) => {
        console.error("COULD NOT CONNECT!");
        console.error(error);
        Toast.show('There is a problem connecting to the server, please check internet connection!', toastProperties);
    }

    const subcribeToInfoQueue = async() => {
        // console.log("SUBSCRIBING to "+'/queue/__self__'+uuidUser);
        let uuidUser = getCurrentUUID();
        if (uuidUser!=''){
            checkAndSubscribe('/queue/__self__'+uuidUser, onMessageReceived, {"id":"__self__"+uuidUser});//{"id":uuidUser, "durable":true, "auto-delete":false}
            console.log("SUBSCRIBED to "+'/queue/__self__'+uuidUser);
            console.log("SUBSCRIPTIONS");
            console.log(stompClient.subscriptions);
        }
    }

    // const newMessagePing = () => {

    // }

    const onMessageReceived = async(msg) => {
        console.warn("Messages recieved----");
        console.log("BEFORE receiving");
        console.log(msg);
        let incomingInfo = JSON.parse(msg.body);
        // console.log("BEFORE");
        // console.log(chatContacts);

        if (incomingInfo.type=="PRIVATE_CHAT_INTRO"){
            console.log("Extending");

            let contactUUID = incomingInfo.data.uuid;

            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                let localChatContact = JSON.parse(chatInfo);
                let modifiedChatContacts = {};

                if (!contactUUID in localChatContact){
                    subscribeToChatContact(incomingInfo.data);
                }

                if (Object.keys(localChatContact).length==0){
                    modifiedChatContacts = {[contactUUID] : incomingInfo.data};
                }
                else{
                    modifiedChatContacts = { ...localChatContact, [contactUUID]: incomingInfo.data};
                }
                // console.log(incomingInfo.data);
                //queue subscription
                // checkAndSubscribe(incomingInfo.data.subscriptionURL, onMessageReceived, {});
                setInStorage('__CHATINFO__', modifiedChatContacts);
                setAllContacts(modifiedChatContacts);
                
                //subscribe only if it is a new contact

            }
            else{
                console.warn("__CHATINFO__ NOT FOUND");
            }
            
            
        }
        else if (incomingInfo.type=="GROUP_CHAT_INTRO"){
            // incomingInfo.data["chatArray"] = [];
            let contactUUID = incomingInfo.data.uuid;

            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                let localChatContact = JSON.parse(chatInfo);

                //subscribe only if it is a new contact
                if (!contactUUID in localChatContact){
                    subscribeToChatContact(incomingInfo.data);
                }

                let modifiedChatContacts = {};

                if (Object.keys(localChatContact).length==0){
                    modifiedChatContacts = {[contactUUID] : incomingInfo.data};
                }
                else{
                    modifiedChatContacts = { ...localChatContact, [contactUUID]: incomingInfo.data};
                }

                setInStorage('__CHATINFO__', modifiedChatContacts);
                setAllContacts(modifiedChatContacts);
                //topic durable subscription
                // checkAndSubscribe(incomingInfo.data.subscriptionURL, onMessageReceived, {"id":uuidUser, "durable":true, "auto-delete":false});
    
                
            }
            else{
                console.warn("__CHATINFO__ NOT FOUND");
            }
        }
        else if (incomingInfo.type=="SEND_MESSAGE"){
            console.warn("MESSAGE AT SEND_MESSAGE");
            console.log(incomingInfo.data);
            // console.log("chatContacts");
            // console.log(chatContacts);
            let chatUUIDIndex = null;
            // let prefix = "";
            if (incomingInfo.data.ChatType=="PRIVATE"){
                chatUUIDIndex = incomingInfo.data.senderUUID;
                // prefix = "PRIVATE_";
            }
            else if (incomingInfo.data.ChatType=="GROUP"){
                chatUUIDIndex = incomingInfo.data.chatUUID;
                // prefix = "GROUP_";
            }
            else{
                console.warn("WRONG CHAT TYPE");
                return;
            }
            console.log("chatUUIDIndex: "+ chatUUIDIndex);
            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                console.warn("FETCHED ALL CHAT");
                // setChatContacts(JSON.parse(chatInfo));
                // console.log(chatInfo);
                let localChatContact = JSON.parse(chatInfo);
                let destinationContact = localChatContact[chatUUIDIndex];
                let previousChatArray = destinationContact.chatArray;
                // console.log(previousChatArray);
                // console.log("MODIFICATION");
                previousChatArray.push(incomingInfo.data);
                // console.log(previousChatArray);
                localChatContact[chatUUIDIndex].chatArray = previousChatArray;
                // console.log("FULL");
                // console.log(localChatContact);
                setChatContacts(localChatContact);
                setInStorage('__CHATINFO__', localChatContact);
                // storeChatInfo(localChatContact);
                console.log("EXPECTED CHAT INDEX "+(chatUUIDIndex));

                let openChatInfo = await AsyncStorage.getItem('__SELECTEDCHAT__');
                if (openChatInfo!=null){
                    console.log("FETCHED ALL CHAT");
                    let openedChatStorage = JSON.parse(openChatInfo);
                    
                    console.log("OPENED CHAT INDEX "+openedChatStorage);
                    console.log("REQUIRED CHAT INDEX "+chatUUIDIndex);
                    console.log("ISFOCUSED");
                    console.log(props.navigation.isFocused());
                    if (props.navigation.isFocused()===false && openedChatStorage==chatUUIDIndex){
                        console.warn("NAVIGATING");
                        navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo(), chatDetails: localChatContact[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: chatUUIDIndex});
                        // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: chatUUIDIndex
                    }
                    else{
                        console.warn("NOT NAVIGATING");
                        console.warn("111223232");
                        handleNotification(localChatContact[chatUUIDIndex], chatUUIDIndex);
                    }
                }
                else{
                    console.warn("COULD NOT __SELECTEDCHAT__ IN STORAGE");
                }
            }
            else{
                console.log("CHATINFO IS NULL");
            }
            
        }
        else if (incomingInfo.type=="GROUP_NAME_CHANGE"){
            // {   type: "GROUP_NAME_CHANGE",
            //     data:
            //     {
            //         groupUuid: toBeEditGroup.uuid,
            //         propertyTitle: "displayName",
            //         newName: groupNameToEdit,
            //     }
            // }
            console.log("Changing group name");
            changeContactProperty(incomingInfo.data.groupUuid, incomingInfo.data.propertyTitle, incomingInfo.data.newName);
        }
        else{
            console.log("Other category");
        }
        // console.log("AFTER receiving");
        // console.log(chatContacts);
        // console.log("AFTER");
        // console.log(chatContacts);
    }

    const checkUserinStorage = async() => {
        // console.log("Checking username");
        try {
            let userId = await AsyncStorage.getItem('__USERNAME__');
            if (userId!=null && userId!=""){
                setUser(userId);
                console.log("Found userName");
            }
            else{
                console.log("Could not find userName");
                props.navigation.navigate('Login');
            }
            let uuidOfUser = await AsyncStorage.getItem('__UUID__');
            if (uuidOfUser!=null && uuidOfUser!=""){
                setUuidUser(uuidOfUser);
                console.warn("Found uuid - "+uuidOfUser);
            }
            else{
                console.warn("Could not find uuid");
            }
            let userContact = await AsyncStorage.getItem('__CONTACTNO__');
                if (userContact!=null && userContact!=""){
                    setUserContactNo(userContact);
                    // console.log("Found uuid");
                }
                else{
                    console.log("Could not find contactNumber");
                }
          } catch (e) {
            console.log(e);
          }
          
    }

    const setInStorage = async(key, value) => {
        try {
            console.log("STORING------");
            console.log();
            await AsyncStorage.setItem(key, JSON.stringify(value));
            console.log("Stored info");
          } catch (e) {
            console.log(e);
          }
    }

    const navigateToChatScreenAndMarkOpenChat = async(props, ScreenName, params) => {
        // console.log("PARAMS");
        // console.log(params);
        // let chatUUIDIndex = null;
        params["contactTranslation"] = numberToContactTranslation;
        if (params.chatDetails.ChatType=="PRIVATE"){
            setInStorage("__SELECTEDCHAT__", params.chatDetails.uuid);
            // setOpenedChat(params.chatDetails.uuid);
            console.log("SELECTED CHAT INDEX "+params.chatDetails.uuid);
            // console.log("IS IT SET? "+ openedChat);
            // console.log("CHATDETAILS");
            // console.log(params.chatDetails);
            // chatUUIDIndex = params.chatDetails.senderUUID;
        }
        else{
            setInStorage("__SELECTEDCHAT__", params.chatDetails.uuid);
            setOpenedChat(params.chatDetails.uuid);
            console.log("SELECTED CHAT INDEX "+params.chatDetails.uuid);
            // chatUUIDIndex = params.chatDetails.chatUUID;
        }
        // setOpenedChat(params.chatDetails.uuid);
        props.navigation.navigate(ScreenName, params);
    }

    const showChat = (item, props, index) => {
        // , allChat: chatContacts, chatIndex: index
        return (
            // <Text onPress={()=>navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: item, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: index})} key={item.uuid} style={{height: 50, flex:1, borderColor:'black', borderBottomWidth:1, backgroundColor: '#E0E5FD', borderRadius: 3}}>

            //     <View style={{flex:1, flexDirection:'row'}}>
            //         <View style={{flex:1, justifyContent: 'flex-start', backgroundColor:"orange"}}>
            //             <Text style={{fontWeight: "bold"}}>{item.displayName}</Text>
            //         </View>
            //         <View style={{flex:1, backgroundColor: "grey", justifyContent: 'flex-end'}}>
            //             <MaterialIcons name="more-vert" size={20} backgroundColor="white" color={"black"}
            //                 onPress={()=>console.log("CLICKED ON BUTTON")} >
            //             </MaterialIcons>
            //         </View>
            //     </View>
            // </Text>
            <View style={{flexDirection: 'row', height: 50, flex:1, borderColor:'black', borderBottomWidth:1, backgroundColor: '#E0E5FD', borderRadius: 3}} key={item.uuid}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text onPress={()=>navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo, chatDetails: item, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: index})} style={{fontWeight: "bold"}}>{item.displayName}</Text>
                    {/* <Text onPress={()=>handleNotification(item, index)} style={{fontWeight: "bold"}}>{item.displayName}</Text> */}
                    
                    {
                        item.ChatType=="GROUP" && 
                        <OptionsMenu
                            customButton={<MaterialIcons name="more-vert" size={20} backgroundColor="white" color={"black"}/>}
                            destructiveIndex={1}
                            options={["Edit Group Name", "Cancel"]}
                            actions={[() => initiateEditGroupName(item)]}/>
                    }
                    {
                        item.ChatType=="PRIVATE" && 
                        <OptionsMenu
                            customButton={<MaterialIcons name="more-vert" size={20} backgroundColor="white" color={"black"}/>}
                            destructiveIndex={1}
                            options={["No function yet"]}
                            actions={[]}/>
                    }
                </View>
            </View>
        );
    }

    const initiateEditGroupName = (contact) => {
        // const [toBeEditGroup, setToBeEditGroup] = useState({});
        // const [groupNameToEdit, setGroupNameToEdit] = useState("");
        setToBeEditGroup(contact);
        setGroupNameToEdit(contact.displayName);
        setEditGroupModalVisible(true);
        // console.log("ALPHA");
        // ...
    }

    const editGroupNameModal = (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 22, flexDirection:'row'}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editGroupModalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setEditGroupModalVisible(!editGroupModalVisible);
                }}
                >
                <View style={styles.centeredView}>
                    <View style={{
                        // margin: 30,
                        height: 250,
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}>
                        <Icon
                            name="close"
                            backgroundColor="blue"
                            onPress={() => setEditGroupModalVisible(false)}
                            style={{ borderRadius: 20, padding: 10, elevation: 2, backgroundColor: "white", alignSelf: 'flex-end', marginTop: -5, position: 'absolute'}}
                            color='red'
                            size={20}
                            >
                        </Icon>
                        <Text style={styles.modalText}>
                            <Text style={{flex:6, fontWeight: 'bold'}}>Edit Group Name</Text>
                        </Text>
                        <View style={{marginBottom: 10, height: 100}}>
                            <TextInput
                                onChangeText={setGroupNameToEdit}
                                value={groupNameToEdit}
                                placeholder="Group Name"
                                style={{borderWidth: 1, borderRadius: 5, marginBottom: 20}}
                            />
                        </View>

                        <View style={{marginBottom: 10, height: 50}}>
                            <Button
                                onPress={()=>brodcastGroupNameChange()}
                                title="Rename"
                                color="#29088A"
                                accessibilityLabel="Rename"
                                />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

    const brodcastGroupNameChange = async() => {
        // const [toBeEditGroup, setToBeEditGroup] = useState({});
        // const [groupNameToEdit, setGroupNameToEdit] = useState("");
        setEditGroupModalVisible(false);
        changeContactProperty(toBeEditGroup.uuid, "displayName", groupNameToEdit);
        let groupNameChangeMessage = 
        {   type: "GROUP_NAME_CHANGE",
            data:
            {
                groupUuid: toBeEditGroup.uuid,
                propertyTitle: "displayName",
                newName: groupNameToEdit,
            }
        }
        stompClient.send("/app/message/"+toBeEditGroup.subscriptionURL, {}, JSON.stringify(groupNameChangeMessage));
    }

    const changeContactProperty = async(chatUUIDIndex, propertyTitle, propertyValue) => {
        // let prefix = "GROUP_";

        let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                let localChatContact = JSON.parse(chatInfo);
                console.log("changeContactProperty");
                console.log(chatUUIDIndex+", "+propertyTitle+", "+propertyValue);
                console.log("ALL");
                // console.log(chatContacts);
                localChatContact[chatUUIDIndex][propertyTitle] = propertyValue;
                setChatContacts(localChatContact);
                setInStorage('__CHATINFO__', localChatContact);

                let openChatInfo = await AsyncStorage.getItem('__SELECTEDCHAT__');
                if (openChatInfo!=null){
                    console.log("FETCHED ALL CHAT");
                    let openedChatStorage = JSON.parse(openChatInfo);

                    // storeChatInfo(localChatContact);
                    //#########################... MODIFICATION NEEDED
                    if (props.navigation.isFocused()===false && openedChatStorage==(chatUUIDIndex)){
                        navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo(), chatDetails: localChatContact[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: chatUUIDIndex});
                        // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: chatUUIDIndex
                    }
                }
            }
        // let localChatContact = chatContacts;...
    }

    const emptySpace = (n) => {
        let array = [];
        for (let i = 0; i<n; i++){
            array.push(
                <View key={i} style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:2}}></View>
                    <View style={{flex:8, alignItems:'flex-end'}}>
                    </View>
                </View>
            );
        }
        return array;
    }

    // async function requestPermissions() {
    //     let status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
    //     console.log('status', status)
    // }

    

    const getContacts = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
            buttonPositive: 'Please accept bare mortal',
        })
            .then((res) => {
                console.log('Permission: ', res);
                Contacts.getAll()
                    .then((contacts) => {
                        // console.log("CONTACTS");
                        // work with contacts
                        // for (let contact of contacts) { console.log(contact); }
                        // setAllContacts(contacts);
                        filterValidContacts(contacts);
                        // console.log(contacts);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((error) => {
                console.error('Permission error: ', error);
            });
    }

    // const addContact = (
    //     <View style={styles.centeredView}>
    //         <Modal
    //             animationType="slide"
    //             transparent={true}
    //             visible={modalVisible}
    //             onRequestClose={() => {
    //                 // Alert.alert("Modal has been closed.");
    //                 setModalVisible(!modalVisible);
    //             }}
    //             >
    //             <View style={styles.centeredView}>
    //                 <View style={styles.modalView}>
    //                     <Text style={styles.modalText}>
    //                         <Text style={{flex:6}}>Enter contact details</Text>
    //                         <Text style={{flex:2}}>  </Text>
    //                         <Text style={{flex:1}}>
    //                             <Icon
    //                                 name="close"
    //                                 backgroundColor="blue"
    //                                 onPress={()=>setModalVisible(false)}
    //                                 >
    //                                 </Icon>
    //                         </Text>
    //                     </Text>
    //                     <TextInput
    //                         onChangeText={setContactNumber}
    //                         value={contactNumber}
    //                         placeholder="Contact Number"
    //                         keyboardType="numeric"
    //                     />
    //                     <TextInput
    //                         onChangeText={setContactName}
    //                         value={contactName}
    //                         placeholder="Contact Name"
    //                     />
    //                     <Button
    //                         onPress={()=>processNewContact(contactNumber)}
    //                         title="Add contact"
    //                         color="blue"
    //                         accessibilityLabel="Add contact"
    //                         />
    //                 </View>
    //             </View>
    //         </Modal>
    //         <Pressable
    //         style={[styles.button, styles.buttonOpen]}
    //         onPress={() => setModalVisible(true)}
    //         >
    //         <Icon
    //             name="plus"
    //             backgroundColor="blue"
    //             >
    //             </Icon>
    //         </Pressable>
    //     </View>
    // );

    const checkIfSelected = (contact) => {
        if (contact.phoneNumbers.length>0){
            if (selectMap.has(truncateSpaces(contact.phoneNumbers[0].number))){
                return {borderLeftWidth: 3, borderLeftColor: 'green', borderRightWidth: 3, borderRightColor: 'green'};
            }
        }
        return {borderLeftWidth: 0};
    }

    const processSingleContact = async(contact) => {
        let contactNumber = truncateSpaces(contact.phoneNumbers[0].number);
        let uuid = contact.userUUID;
        // console.log("processSingleContact");
        // console.log(contactNumber);
        // console.log(userContactNo);
        // console.log(contactNumber!=userContactNo);
        if (contactNumber!=userContactNo){
            //This Contact will be seen from the Sender's screen
            let newContact = {
                lastActivity: 1666880122,
                displayName: contact.displayName,
                lastChat: '',
                imageUrl: '',
                ChatType: 'PRIVATE',
                uuid: uuid,
                senderUuid: uuidUser,
                destinationURL: uuid+'_'+uuidUser,
                subscriptionURL: uuidUser+'_'+uuid,
                chatArray: []
            }
            // console.log("NewContact");
            // console.log(newContact);
            //This Contact will be sent to the Receiver's screen
            let introMessageToSend = 
            {
                type: "PRIVATE_CHAT_INTRO",
                data:
                {
                    lastActivity: 1666880122,
                    displayName: userContactNo,
                    lastChat: '',
                    imageUrl: '',
                    ChatType: 'PRIVATE',
                    uuid: uuidUser,
                    destinationURL: uuidUser+'_'+uuid,
                    subscriptionURL: uuid+'_'+uuidUser,
                    chatArray: []
                }
            }
            
            //sending INTRO message to receiver so that the receiver subscribes to the chat
            stompClient.send("/app/private-message/__self__"+contact.userUUID, {}, JSON.stringify(introMessageToSend));
            console.log("SENDING TO- __self__"+contact.userUUID);
            //subscribing to the chat
            //Adding the new contact to the sender's home screen.
            console.log("BEFORE ADDING NEW CONTACT");
            // console.log(chatContacts);
            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                console.log("FETCHED ALL CHAT");
                let localChatContact = JSON.parse(chatInfo);

                if (!uuid in localChatContact){
                    checkAndSubscribe('/queue/'+newContact.subscriptionURL, onMessageReceived, {"id":newContact.subscriptionURL+"_"+uuidUser});
                }

                let modifiedChatContacts = {};

                console.log("UUID value - "+uuid);
                if (Object.keys(localChatContact).length==0){
                    // console.log("000000");
                    modifiedChatContacts = {[uuid] : newContact};
                }
                else{
                    // console.log("11111111111111");
                    modifiedChatContacts = { ...localChatContact, [uuid]: newContact};
                    // console.log("chatContacts");
                    // console.log(chatContacts);
                }

                setInStorage("__CHATINFO__", modifiedChatContacts);
                setChatContacts(modifiedChatContacts);
                console.log("AFTER ADDING NEW CONTACT");
                // console.log(chatContacts);
                //######### UNCOMMENT
                // queue subscription to be done in the chat itself
                navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo(), chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: uuid});
                // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: uuid
                //######### UNCOMMENT
            }
            else{
                console.warn("__CHATINFO__ NOT FOUND");   
            }
        }
        else{
            console.log("You cannot chat with yourself, please use a different contact number");
        }
    }

    const processMultipleContacts = async(contacts) => {
        // let contactNumber = selectedContacts[0].phoneNumbers[0].number;
        let groupUUID = uuid.v4();
        // let uuid = contact.userUUID;
        //This Contact will be seen from the Sender's screen
        let newContact = {
            lastActivity: 1666880122,
            displayName: "Unnamed Group",
            lastChat: '',
            imageUrl: '',
            ChatType: 'GROUP',
            uuid: groupUUID,
            destinationURL: groupUUID,
            subscriptionURL: groupUUID,
            "chatArray": []
        }
        console.log(contacts.length);
        for (let i = 0; i<contacts.length; i++){
            console.log("ITERATING");
            console.log(truncateSpaces(contacts[i].phoneNumbers[0].number));
            console.log(truncateSpaces(userContactNo));
            console.log(truncateSpaces(contacts[i].phoneNumbers[0].number)!=truncateSpaces(userContactNo));
            if (truncateSpaces(contacts[i].phoneNumbers[0].number)!=truncateSpaces(userContactNo)){
                // console.log("NewContact");
                // console.log(newContact);
                let introMessageToSend = 
                {
                    type: "GROUP_CHAT_INTRO",
                    data:
                    {
                        lastActivity: 1666880122,
                        displayName: "Unnamed Group",
                        lastChat: '',
                        imageUrl: '',
                        ChatType: 'GROUP',
                        uuid: groupUUID,
                        destinationURL: groupUUID,
                        subscriptionURL: groupUUID,
                        "chatArray": []
                    }
                }
                
                // //sending INTRO message to receiver so that the receiver subscribes to the chat
                stompClient.send("/app/private-message/__self__"+contacts[i].userUUID, {}, JSON.stringify(introMessageToSend));
                // console.log("SENDING TO- __self__"+contacts[i].userUUID);
            }
            else{
                console.log("DISCARDING");
            }
        }
        //Adding the new contact to the sender's home screen.

        let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                let localChatContact = JSON.parse(chatInfo);
                let modifiedChatContacts = {};
                
                if (Object.keys(localChatContact).length==0){
                    modifiedChatContacts = {[groupUUID] : newContact};
                }
                else{
                    modifiedChatContacts = { ...localChatContact, [groupUUID]: newContact};
                }
                //######### UNCOMMENT
                // topic subscription
                setInStorage('__CHATINFO__', modifiedChatContacts);
                setAllContacts(modifiedChatContacts);

                checkAndSubscribe('/topic/'+newContact.subscriptionURL, onMessageReceived, {"id":newContact.subscriptionURL+"_"+uuidUser, "durable":true, "auto-delete":false});
                
                navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: getUserContactNo(), chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: groupUUID});
        
        
                // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat});
                // ######### UNCOMMENT

            }
            else{
                console.warn("__CHATINFO__ not found");
            }
    }

    const goToChat = async() => {
        // let contactNumber = selectedContacts[0].phoneNumbers[0].number;
        // let uuid = selectedContacts[0].userUUID;
        let contact = selectedContacts[0];
        console.log(selectedContacts);
        setSelectedContacts([]);
        setSelectMap(new Map());
        setContactsModalVisible(false);
        processSingleContact(contact);
    }

    const createGroup = async() => {
        setSelectedContacts([]);
        setSelectMap(new Map());
        setContactsModalVisible(false);
        processMultipleContacts(selectedContacts);
    }

    const groupModal = (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={contactsModalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setContactsModalVisible(!contactsModalVisible);
                }}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Icon
                            name="close"
                            backgroundColor="blue"
                            onPress={() => setContactsModalVisible(false)}
                            style={{
                                borderRadius: 20,
                                padding: 10,
                                elevation: 2,
                                backgroundColor: "white",

                                alignSelf: 'flex-end',
                                marginTop: -5,
                                position: 'absolute'}}
                            color='red'
                            size={20}
                            >
                        </Icon>
                        <Text style={styles.modalText}>
                            <Text style={{flex:6}}>Contacts</Text>
                            <Text style={{flex:2}}>  </Text>
                        </Text>
                        <View style={{marginBottom: 10, height: 300}}>
                            {/* <Text style={{flex:1}}>{allValidContacts[0].displayName}</Text> */}
                            {/* <Text>{selectedContacts.length}</Text> */}
                            <ScrollView horizontal={false}>
                                {/* {allValidContacts.map((contact, index) => { */}
                                { Object.keys(allValidContacts).map(function(key, index) {

                                    return (
                                        <TouchableOpacity
                                            onPress={()=>onPress(allValidContacts[key])} style={checkIfSelected(allValidContacts[key])}>

                                            <Text style={{height:70, width: 300, padding: 5, borderBottomWidth: 1, borderRadius: 2, backgroundColor:'#F6F6F6'}} >
                                                <View style={{flex:1, flexDirection:'row'}}>
                                                    <View style={{flex:1}}>
                                                        <Text style={{justifyContent: 'flex-start'}}>
                                                            <MaterialIcons name="person" size={30} backgroundColor="blue"
                                                                onPress={()=>setContactsModalVisible(false)} >
                                                            </MaterialIcons>
                                                        </Text>
                                                    </View>
                                                    <View style={{flex:7}}>
                                                        <Text style={{justifyContent: 'flex-end', fontWeight: 'bold'}}>{allValidContacts[key].displayName}</Text>
                                                        <Text style={{justifyContent: 'flex-end', fontWeight: 'bold'}}>{allValidContacts[key].phoneNumbers.length>0? allValidContacts[key].phoneNumbers[0].number : ''}</Text>
                                                    </View>
                                                </View>
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                                </ScrollView>
                        </View>
                        <View style={{height: 50, marginTop: 10}}>
                            <Text>
                                <View style={{flexDirection:"row"}}>
                                    {selectedContacts.length == 1 &&
                                        <View style={{flex:1}}>
                                            <Button
                                                onPress={()=>goToChat()}
                                                title="Go to chat"
                                                color="grey"
                                                accessibilityLabel="Go to chat"
                                                />
                                        </View>
                                    }
                                    {
                                        <View style={{flex:1}}>
                                            <Text>    </Text>
                                        </View>
                                    }
                                    {selectedContacts.length >= 1 &&
                                        <View style={{flex:1}}>
                                            <Button
                                                onPress={()=>createGroup()}
                                                title="Create group"
                                                color="grey"
                                                accessibilityLabel="Create group"
                                                />
                                        </View>
                                    }
                                </View>
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
            <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setContactsModalVisible(true)}
            >
            <Icon
                name="plus"
                backgroundColor="blue"
                >
                </Icon>
            </Pressable>
        </View>
    );


    const addContactToSelection = (contact) => {
        let localMap = new Map(selectMap);
        localMap.set(truncateSpaces(contact.phoneNumbers[0].number), contact);
        setSelectMap(localMap);
        if (selectedContacts.length>0){
            setSelectedContacts(selectedContacts => [...selectedContacts, contact]);
        }
        else{
            setSelectedContacts([contact]);
        }
        console.log("Added contact");
    }

    const removeContactFromSelection = (contact) => {
        let localMap = new Map(selectMap);
        localMap.delete(truncateSpaces(contact.phoneNumbers[0].number));
        setSelectMap(localMap);
        setSelectedContacts(selectedContacts.filter(item => item.phoneNumbers[0].number !== contact.phoneNumbers[0].number));
        console.log("Removed contact");
    }

    const onPress = (contact) => {
        // const [selectMap, setSelectMap] = useState(new Map());
        // const [selectedContacts, setSelectedContacts] = useState({});
        console.log("NORMAL PRESS");
        if (contact.phoneNumbers.length>0){
            if (selectMap.has(truncateSpaces(contact.phoneNumbers[0].number))){
                removeContactFromSelection(contact);
            }
            else{
                addContactToSelection(contact);
            }
            // console.log(selectedContacts);
        }
        else{
            console.error("Cannot proceed with contact having no phone number!");
        }
        // console.log(contact.);
    }

    const refresh = () => {
        console.warn("Refreshing");
        Toast.show('Refreshing...', toastProperties);
        checkUserinStorage();
        connect();
        fetchChatInfo();
        getContacts();
        registerNotification();
    }

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            <View style={{flex:1, flexDirection:'row'}}>
                <Text style={{flex:5, color:'black'}}>{"User: "+getCurrentUser()}</Text>
                <Text style={{flex:5}}>{"UUID: "+getCurrentUUID()}</Text>
                <Text style={{flex:5, color: 'black'}}>{"Contact: "+getUserContactNo()}</Text>
                {/* <Text style={{flex:5}}>{user+", "+userContactNo}</Text>
                <Text style={{flex:5}}>{"uuidUser "+uuidUser}</Text> */}
                {/* <Text style={{flex:5}}>{"props "+props.navigation.state.params.currentUUID}</Text> */}
                {/* <Text style={{flex:1}}>{addContact}</Text> */}
                <Text style={{flex:1, marginRight: 10, marginTop: 6}}>
                    <Icon
                        name="refresh"
                        backgroundColor="white"
                        onPress={() => refresh()}
                        style={{
                            borderRadius: 20,
                            padding: 10,
                            elevation: 2,
                            backgroundColor: "white",

                            alignSelf: 'flex-end',
                            marginTop: 20,
                            position: 'absolute'
                        }}
                        color='black'
                        size={20}
                        >
                        </Icon>
                </Text>
                <Text style={{flex:1}}>{groupModal}</Text>
                
            </View>
            <View style={{flex:12, flexDirection:'row'}}>
                <ScrollView style={styles.scrollView}>
                    {/* {
                        chatContacts.map((item)=>
                            showChat(item, props)
                        )
                    } */}
                    {editGroupNameModal}
                    {
                        Object.keys(chatContacts).map(function(key, index) {
                            // console.log(index);
                            return showChat(chatContacts[key], props, key);
                          })
                    }
                    {/* {getContacts()} */}
                    {emptySpace(6)}
                </ScrollView>
            </View>
        </View>
    );

}