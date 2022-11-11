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
    const [selectMap, setSelectMap] = useState(new Map());
    const [selectedContacts, setSelectedContacts] = useState({});
    const [connected, setConnected] = useState(false);
    const [allChat, setAllChat] = useState(new Map());
    const [openedChat, setOpenedChat] = useState("");

    useEffect(()=>{
        checkUserinStorage();
        // connect();
        fetchChatInfo();
        getContacts();

        // return () => {
        //     console.warn("EXIT FROM []");
        // }
    }, []);

    useEffect(()=>{
        if (uuidUser!=''){
            connect();
        }
        // return () => {
        //     console.warn("EXIT FROM uuidUser");
        // }
    }, [uuidUser]);

    // useEffect(() => {
    //     console.warn("ON FOCUS************************");
 
    //     // Call only when screen open or when back on screen 
    //     if(isFocused){ 
    //         console.warn("ON FOCUS IF ************************"); 
            
    //     }
    // }, [isFocused]);

    // useEffect(()=>{
    //     if (connected === true && Object.keys(chatContacts).length > 0){
    //         loopSubscribe(chatContacts);
    //     }
    //     // if (stompClient!=null){
    //     //     console.warn("STOMP CLIENT ------ "+stompClient);
    //     // }
    //     // if (Object.keys(chatContacts).length > 0){
    //     //     console.warn("chatContacts ------ ");
    //     //     console.warn(chatContacts);
    //     // }
    // }, [connected, chatContacts]);

    useEffect(()=>{
        if (props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser!='' && props.navigation.state.params.currentUUID!='' && props.navigation.state.params.userContactNo!=''){
            console.warn("SETTING ALL ************************");
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
            setUserContactNo(props.navigation.state.params.userContactNo);

            checkUserinStorage();
            // connect();
            fetchChatInfo();
            getContacts();
        }
        console.warn("PROPS CHANGED");
        console.warn((props.navigation.state!=undefined) + ", "+(props.navigation.state.params!=undefined)+", "+(props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser!='')+", "+(props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUUID!='')+", "+(props.navigation.state && props.navigation.state.params && props.navigation.state.params.userContactNo!=''));
        console.warn(props);
        // return () => {
        //     console.warn("EXIT FROM props");
        // }
    }, [props.navigation.state.params?.currentUser, props.navigation.state.params?.currentUUID, props.navigation.state.params?.userContactNo]);

    useEffect(()=>{
        storeChatInfo();

        // return () => {
        //     console.warn("EXIT FROM chatContacts");
        // }
    }, [chatContacts]);

    // useEffect(()=>{
    //     filterValidContacts();
    // }, [allContacts]);

    // useEffect(() => {
    //     if (props.navigation.isFocused()) {
    //         console.warn("FOCUS CHANGED IN HOME"+props.navigation.isFocused());
    //         setOpenedChat("");
    //         console.warn("Changed Opened Chat value: "+openedChat);
    //     }
    //   }, [props.navigation.isFocused()]);

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

    const subscribeToChatContact = async(contact) => {
        console.warn(contact.displayName);
        if (contact.ChatType=='PRIVATE'){
            //queue subscription
            stompClient.subscribe('/queue/'+contact.subscriptionURL, onMessageReceived, {"id":uuidUser+"_"+contact.uuid});//{"id":1234, "durable":true, "auto-delete":false}
            console.warn("SUBSCRIBED to QUEUE"+contact.displayName);
        }
        else if (contact.ChatType=='GROUP'){
            stompClient.subscribe('/topic/'+contact.subscriptionURL, onMessageReceived, {"id":uuidUser+"_"+contact.uuid, "durable":true, "auto-delete":false});//{"id":1234, "durable":true, "auto-delete":false}
            console.warn("SUBSCRIBED to TOPIC"+contact.displayName);
        }
        else{
            console.warn("WRONG CHAT TYPE");
        }
    }

    const loopSubscribe = async(contacts) => {
        console.warn("LOOP ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
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
                        console.warn("Contact number does not exist "+ url);
                    }
                    else{
                        // console.warn(contact);
                        contact['userUUID'] = responseJson[0].id;
                        contact['truncatedPhoneNo'] = responseJson[0].phonenumber;
                        // console.warn(contact);
                        // console.warn(responseJson);
                        if (allValidContacts.length==0){
                            // setAllValidContacts([contact]);
                            setAllValidContacts({[responseJson[0].id] : contact});
                        }
                        else{
                            // setAllValidContacts(allValidContacts => [...allValidContacts, contact]);
                            setAllValidContacts(allValidContacts => ({ ...allValidContacts, [responseJson[0].id]: contact}));
                        }
                        // validContacts.push(contact);
                        //----------
                    }
                    
                })
                .catch((err) => console.warn(err));
            }
            
        };
        // setAllValidContacts(validContacts);
        console.warn("FILTER DONE");
    }

    const storeChatInfo = async() => {
        try {
            console.warn("STORING------");
            console.log(chatContacts);
            await AsyncStorage.setItem("__CHATINFO__", JSON.stringify(chatContacts));
            console.warn("Stored info");
          } catch (e) {
            console.warn(e);
          }
    }

    const modifyChat = async(modifiedArray, chatIndex) => {
        console.warn("MODIFY CALLED");
        console.warn(modifiedArray);

        let localChatContact = chatContacts;
        // let destinationContact = localChatContact[chatIndex];
        // let previousChatArray = destinationContact.chatArray;
        // console.warn(previousChatArray);
        // console.warn("MODIFICATION");
        // previousChatArray.push(newChat);
        // console.warn(previousChatArray);
        localChatContact[chatIndex].chatArray = modifiedArray;
        // console.warn("FULL");
        // console.warn(localChatContact);
        setChatContacts(localChatContact);
        storeChatInfo();
        // console.warn("EXPECTED CHAT INDEX "+chatUUIDIndex);
        // console.warn("OPENED CHAT INDEX "+openedChat);
        // console.warn(openedChat);
        // console.warn("ISFOCUSED");
        // console.warn(props.navigation.isFocused());
        // if (props.navigation.isFocused()===false && openedChat==chatUUIDIndex){
        navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatIndex], stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: chatIndex});
            // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: chatUUIDIndex
        // }

    }

    const fetchChatInfo = async() => {
        try {
            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
                console.warn("FETCHED ALL CHAT");
                setChatContacts(JSON.parse(chatInfo));
                console.warn(chatInfo);
            }
            else{
                console.warn("Could not find userName");
                props.navigation.navigate('Login');
            }
          } catch (e) {
            console.warn(e);
          }
    }

    const connect = () => {
        let Sock = new SockJS(socketURL);
        stompClient = over(Sock);
        console.log(stompClient);
        stompClient.connect({}, onConnected, onConnectError);//{"client-id": props.navigation.state.params.currentUser }
    }

    const onConnected = async() => {
        console.warn("Connected");
        // setConnected(true);
        // await delay(2000);
        subcribeToInfoQueue();
        loopSubscribe(chatContacts);
    }

    const onConnectError = (error) => {
        console.error("COULD NOT CONNECT!");
        console.error(error);
    }

    const subcribeToInfoQueue = async() => {
        // console.warn("SUBSCRIBING to "+'/queue/__self__'+uuidUser);
        let uuidUser = getCurrentUUID();
        if (uuidUser!=''){
            stompClient.subscribe('/queue/__self__'+uuidUser, onMessageReceived, {"id":uuidUser});//{"id":uuidUser, "durable":true, "auto-delete":false}
            console.warn("SUBSCRIBED to "+'/queue/__self__'+uuidUser);
            console.warn("SUBSCRIPTIONS");
            console.warn(stompClient.subscriptions);
        }
    }

    // const newMessagePing = () => {

    // }

    const onMessageReceived = async(msg) => {
        console.warn("INFO Messages recieved----");
        console.warn("BEFORE receiving");
        console.warn(msg);
        let incomingInfo = JSON.parse(msg.body);

        if (incomingInfo.type=="PRIVATE_CHAT_INTRO"){
            console.warn("Extending");

            // incomingInfo.data["chatArray"] = [];

            let contactUUID = incomingInfo.data.uuid;
            if (Object.keys(chatContacts).length==0){
                setChatContacts({[contactUUID] : incomingInfo.data});
            }
            else{
                setChatContacts(chatContacts => ({ ...chatContacts, [contactUUID]: incomingInfo.data}));
            }
            console.warn(incomingInfo.data);
            //queue subscription
            // stompClient.subscribe(incomingInfo.data.subscriptionURL, onMessageReceived, {});
            
            //subscribe only if it is a new contact
            if (!contactUUID in chatContacts){
                subscribeToChatContact(incomingInfo.data);
            }
            
        }
        else if (incomingInfo.type=="GROUP_CHAT_INTRO"){
            // incomingInfo.data["chatArray"] = [];
            let contactUUID = incomingInfo.data.uuid;
            if (Object.keys(chatContacts).length==0){
                setChatContacts({[contactUUID] : incomingInfo.data});
            }
            else{
                setChatContacts(chatContacts => ({ ...chatContacts, [contactUUID]: incomingInfo.data}));
            }
            //topic durable subscription
            // stompClient.subscribe(incomingInfo.data.subscriptionURL, onMessageReceived, {"id":uuidUser, "durable":true, "auto-delete":false});

            //subscribe only if it is a new contact
            if (!contactUUID in chatContacts){
                subscribeToChatContact(incomingInfo.data);
            }
            
        }
        else if (incomingInfo.type=="SEND_MESSAGE"){
            console.warn("MESSAGE AT SEND_MESSAGE");
            console.warn(incomingInfo.data);
            // console.warn("chatContacts");
            // console.warn(chatContacts);
            let chatUUIDIndex = null;
            let prefix = "";
            if (incomingInfo.data.ChatType=="PRIVATE"){
                chatUUIDIndex = incomingInfo.data.senderUUID;
                prefix = "PRIVATE_";
            }
            else{
                chatUUIDIndex = incomingInfo.data.chatUUID;
                prefix = "GROUP_";
            }
            console.warn("chatUUIDIndex: "+ chatUUIDIndex);
            let localChatContact = chatContacts;
            let destinationContact = localChatContact[chatUUIDIndex];
            let previousChatArray = destinationContact.chatArray;
            console.warn(previousChatArray);
            console.warn("MODIFICATION");
            previousChatArray.push(incomingInfo.data);
            console.warn(previousChatArray);
            localChatContact[chatUUIDIndex].chatArray = previousChatArray;
            // console.warn("FULL");
            // console.warn(localChatContact);
            setChatContacts(localChatContact);
            storeChatInfo();
            console.warn("EXPECTED CHAT INDEX "+(prefix+chatUUIDIndex));
            console.warn("OPENED CHAT INDEX "+openedChat);
            console.warn(openedChat);
            console.warn("ISFOCUSED");
            console.warn(props.navigation.isFocused());
            if (props.navigation.isFocused()===false && openedChat==(prefix+chatUUIDIndex)){
                navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: chatUUIDIndex});
                // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: chatContacts[chatUUIDIndex], stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: chatUUIDIndex
            }
        }
        else{
            console.warn("Other category");
        }
        // console.warn("AFTER receiving");
        // console.warn(chatContacts);
    }

    const checkUserinStorage = async() => {
        // console.warn("Checking username");
        try {
            let userId = await AsyncStorage.getItem('__USERNAME__');
            if (userId!=null && userId!=""){
                setUser(userId);
                // console.warn("Found userName");
            }
            else{
                console.warn("Could not find userName");
                props.navigation.navigate('Login');
            }
            let uuidOfUser = await AsyncStorage.getItem('__UUID__');
            if (uuidOfUser!=null && uuidOfUser!=""){
                setUuidUser(uuidOfUser);
                // console.warn("Found uuid");
            }
            else{
                console.warn("Could not find uuid");
            }
            let userContact = await AsyncStorage.getItem('__CONTACTNO__');
                if (userContact!=null && userContact!=""){
                    setUserContactNo(userContact);
                    // console.warn("Found uuid");
                }
                else{
                    console.warn("Could not find contactNumber");
                }
          } catch (e) {
            console.warn(e);
          }
          
    }

    const navigateToChatScreenAndMarkOpenChat = async(props, ScreenName, params) => {
        // console.log("PARAMS");
        // console.log(params);
        // let chatUUIDIndex = null;
        if (params.chatDetails.ChatType=="PRIVATE"){
            setOpenedChat("PRIVATE_"+params.chatDetails.uuid);
            console.warn("SELECTED CHAT INDEX "+"PRIVATE_"+params.chatDetails.uuid);
            // chatUUIDIndex = params.chatDetails.senderUUID;
        }
        else{
            setOpenedChat("GROUP_"+params.chatDetails.uuid);
            console.warn("SELECTED CHAT INDEX "+"GROUP_"+params.chatDetails.uuid);
            // chatUUIDIndex = params.chatDetails.chatUUID;
        }
        // setOpenedChat(params.chatDetails.uuid);
        props.navigation.navigate(ScreenName, params);
    }

    const showChat = (item, props, index) => {
        // , allChat: chatContacts, chatIndex: index
        return (
            <Text onPress={()=>navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: item, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: index})} key={item.uuid} style={{height: 50, flex:1, flexDirection:'row', borderColor:'black', borderBottomWidth:1, backgroundColor: '#E0E5FD', borderRadius: 3}}>
                <View style={{flex:1}}></View>
                <View style={{flex:20, alignItems:'flex-start'}}>
                    <Text style={{fontWeight: "bold"}}>{item.displayName}</Text>
                </View>
                <View style={{flex:1}}></View>
            </Text>
        );
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
                        // console.warn("CONTACTS");
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
        let contactNumber = contact.phoneNumbers[0].number;
        let uuid = contact.userUUID;
        if (contactNumber!=userContactNo){
            //This Contact will be seen from the Sender's screen
            let newContact = {
                lastActivity: 1666880122,
                displayName: contact.displayName,
                lastChat: '',
                imageUrl: '',
                ChatType: 'PRIVATE',
                uuid: uuid,
                destinationURL: uuid+'_'+uuidUser,
                subscriptionURL: uuidUser+'_'+uuid,
                "chatArray": []
            }
            // console.warn("NewContact");
            // console.warn(newContact);
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
                    "chatArray": []
                }
            }
            
            //sending INTRO message to receiver so that the receiver subscribes to the chat
            stompClient.send("/app/private-message/__self__"+contact.userUUID, {}, JSON.stringify(introMessageToSend));
            console.warn("SENDING TO- __self__"+contact.userUUID);
            //subscribing to the chat
            //Adding the new contact to the sender's home screen.
            if (Object.keys(chatContacts).length==0){
                // console.warn("000000");
                setChatContacts({[uuid] : newContact});
            }
            else{
                // console.warn("11111111111111");
                setChatContacts(chatContacts => ({ ...chatContacts, [uuid]: newContact}));
                // console.warn("chatContacts");
                // console.warn(chatContacts);
            }
            //######### UNCOMMENT
            // queue subscription to be done in the chat itself
            if (!uuid in chatContacts){
                stompClient.subscribe('/queue/'+newContact.subscriptionURL, onMessageReceived, {});
            }
            navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: uuid});
            // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat});//, allChat: chatContacts, chatIndex: uuid
            //######### UNCOMMENT
        }
        else{
            console.warn("You cannot chat with yourself, please use a different contact number");
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
        console.warn(contacts.length);
        for (let i = 0; i<contacts.length; i++){
            console.warn("ITERATING");
            console.warn(truncateSpaces(contacts[i].phoneNumbers[0].number));
            console.warn(truncateSpaces(userContactNo));
            console.warn(truncateSpaces(contacts[i].phoneNumbers[0].number)!=truncateSpaces(userContactNo));
            if (truncateSpaces(contacts[i].phoneNumbers[0].number)!=truncateSpaces(userContactNo)){
                // console.warn("NewContact");
                // console.warn(newContact);
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
                // console.warn("SENDING TO- __self__"+contacts[i].userUUID);
            }
            else{
                console.warn("DISCARDING");
            }
        }
        //Adding the new contact to the sender's home screen.
        if (Object.keys(chatContacts).length==0){
            setChatContacts({[groupUUID] : newContact});
        }
        else{
            setChatContacts(chatContacts => ({ ...chatContacts, [groupUUID]: newContact}));
        }
        //######### UNCOMMENT
        // topic subscription
        stompClient.subscribe('/topic/'+newContact.subscriptionURL, onMessageReceived, {"id":uuidUser, "durable":true, "auto-delete":false});
        
        navigateToChatScreenAndMarkOpenChat(props, 'Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat, chatIndex: groupUUID});


        // props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, userContactNo: userContactNo, chatDetails: newContact, stompClient: stompClient, modifyChatFunction: modifyChat});
        // ######### UNCOMMENT
    }

    const goToChat = async() => {
        // let contactNumber = selectedContacts[0].phoneNumbers[0].number;
        // let uuid = selectedContacts[0].userUUID;
        let contact = selectedContacts[0];
        console.warn(selectedContacts);
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
                            {/* <View style={{flexDirection:'column'}}>
                                <View style={{flex: 1}}>
                                    <Button
                                        onPress={()=>console.warn("")}
                                        title="Create group"
                                        color="blue"
                                        accessibilityLabel="Create group"
                                        />
                                </View>
                                <View style={{flex: 1}}>
                                    <Button
                                        onPress={()=>console.warn("")}
                                        title="Create group"
                                        color="blue"
                                        accessibilityLabel="Create group"
                                        />
                                </View>
                            </View> */}
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
        console.warn("Added contact");
    }

    const removeContactFromSelection = (contact) => {
        let localMap = new Map(selectMap);
        localMap.delete(truncateSpaces(contact.phoneNumbers[0].number));
        setSelectMap(localMap);
        setSelectedContacts(selectedContacts.filter(item => item.phoneNumbers[0].number !== contact.phoneNumbers[0].number));
        console.warn("Removed contact");
    }

    const onPress = (contact) => {
        // const [selectMap, setSelectMap] = useState(new Map());
        // const [selectedContacts, setSelectedContacts] = useState({});
        console.warn("NORMAL PRESS");
        if (contact.phoneNumbers.length>0){
            if (selectMap.has(truncateSpaces(contact.phoneNumbers[0].number))){
                removeContactFromSelection(contact);
            }
            else{
                addContactToSelection(contact);
            }
            // console.warn(selectedContacts);
        }
        else{
            console.error("Cannot proceed with contact having no phone number!");
        }
        // console.warn(contact.);
    }

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{flex:5}}>{"User: "+getCurrentUser()}</Text>
                    <Text style={{flex:5}}>{"UUID: "+getCurrentUUID()}</Text>
                    <Text style={{flex:5}}>{"Contact: "+getUserContactNo()}</Text>
                {/* <Text style={{flex:5}}>{user+", "+userContactNo}</Text>
                <Text style={{flex:5}}>{"uuidUser "+uuidUser}</Text> */}
                {/* <Text style={{flex:5}}>{"props "+props.navigation.state.params.currentUUID}</Text> */}
                {/* <Text style={{flex:1}}>{addContact}</Text> */}
                <Text style={{flex:1}}>{groupModal}</Text>
                
            </View>
            <View style={{flex:12, flexDirection:'row'}}>
                <ScrollView style={styles.scrollView}>
                    {/* {
                        chatContacts.map((item)=>
                            showChat(item, props)
                        )
                    } */}
                    {console.log("chatContacts")}
                    {console.log(chatContacts)}
                    {
                        Object.keys(chatContacts).map(function(key, index) {
                            // console.warn(index);
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