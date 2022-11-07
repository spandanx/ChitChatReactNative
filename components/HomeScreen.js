import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, Button, ActivityIndicator } from 'react-native';
// import { TouchableHighlight } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import {socketURL} from '../properties/networks';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {phoneToIdUrlPath} from '../properties/networks';


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
// ]

    const styles = StyleSheet.create({
        centeredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
          flexDirection:'row'
        },
        modalView: {
          margin: 20,
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
        },
        button: {
          borderRadius: 20,
          padding: 10,
          elevation: 2
        },
        buttonOpen: {
          backgroundColor: "white",
        },
        buttonClose: {
          backgroundColor: "#2196F3",
        },
        textStyle: {
          color: "white",
          fontWeight: "bold",
          textAlign: "center"
        },
        modalText: {
          marginBottom: 15,
          textAlign: "center"
        }
      });

    const [chatContacts, setChatContacts] = useState([]);
    const [user, setUser] = useState('');
    const [uuidUser, setUuidUser] = useState('');
    const [userContactNo, setUserContactNo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [contactNumber, setContactNumber] = useState("");
    const [contactName, setContactName] = useState("");

    useEffect(()=>{
        checkUserinStorage();
        connect();
        fetchChatInfo();
    }, []);

    useEffect(()=>{
        if (props && props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser && props.navigation.state.params.currentUUID){
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
        }
        // console.warn(props);
    }, [props]);

    useEffect(()=>{
        storeChatInfo();
    }, [chatContacts]);

    const storeChatInfo = async() => {
        try {
            await AsyncStorage.setItem("__CHATINFO__", JSON.stringify(chatContacts));
            console.warn("Stored info");
          } catch (e) {
            console.warn(e);
          }
    }
    const fetchChatInfo = async() => {
        try {
            let chatInfo = await AsyncStorage.getItem('__CHATINFO__');
            if (chatInfo!=null){
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
        // await delay(2000);
        subcribeToInfoQueue();
    }

    const onConnectError = (error) => {
        console.error("COULD NOT CONNECT!");
        console.error(error);
    }

    const subcribeToInfoQueue = async() => {
        // console.warn("SUBSCRIBING to "+'/queue/__self__'+uuidUser);
        stompClient.subscribe('/topic/__self__'+uuidUser, onMessageReceived, {"id":uuidUser, "durable":true, "auto-delete":false});//{"id":1234, "durable":true, "auto-delete":false}
        console.warn("SUBSCRIBED to "+'/topic/__self__'+uuidUser);
    }

    const onMessageReceived = async(msg) => {
        console.warn("INFO Messages recieved----");
        let incomingInfo = JSON.parse(msg.body);
        if (incomingInfo.type=="PRIVATE_CHAT_INTRO"){
            console.warn("Extending");
            if (chatContacts.length==0){
                console.warn("LENGTH 0");
                setChatContacts([incomingInfo.data]);
            }
            else{
                console.warn("LENGTH >0");
                setChatContacts(chatContacts => [...chatContacts, incomingInfo.data]);
            }
            console.warn(incomingInfo.data);
        }
        else{
            console.warn("Other category");
        }
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
                    setContactNumber(userContact);
                    // console.warn("Found uuid");
                }
                else{
                    console.warn("Could not find contactNumber");
                }
          } catch (e) {
            console.warn(e);
          }
          
    }

    const showChat = (item, props) => {
        return (
            <Text onPress={()=>props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser, chatDetails: item})} key={item.lastActivity} style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
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

    const processNewContact = async(contactNumber) => {
        setModalVisible(false);
        let url = phoneToIdUrlPath+'?phonenumber='+contactNumber;
        console.warn(url);
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
                console.warn("Contact number does not exist");
            }
            else{
                // console.warn(responseJson);
                webSocketConfigureAndForward(responseJson[0]);
            }
            
          })
        .catch((err) => console.warn(err));
    }

    const webSocketConfigureAndForward = (contact) => { //{"id": "abc", "phonenumber": "11425"}
        console.warn("Sending user details");
        if (contact.id!=uuidUser){

            let newContact = {
                lastActivity: 1666880122,
                displayName: contactName,
                lastChat: '',
                imageUrl: '',
                ChatType: 'PRIVATE',
                uuid: uuidUser,
                subscriptionURL: '/queue/'+uuidUser+'/'+contact.id
            }

            let introMessageToSend = 
            {
                type: "PRIVATE_CHAT_INTRO",
                data:
                {
                    lastActivity: 1666880122,
                    displayName: user,
                    lastChat: '',
                    imageUrl: '',
                    ChatType: 'PRIVATE',
                    uuid: uuidUser,
                    subscriptionURL: '/queue/'+contact.id+'/'+uuidUser
                }
            }
            stompClient.send("/app/private-message/__self__"+contact.id, {}, JSON.stringify(introMessageToSend));
            console.warn("SENT user details");
            if (chatContacts.length==0){
                setChatContacts([newContact]);
            }
            else{
                setChatContacts(chatContacts => [...chatContacts, newContact]);
            }
        }
        else{
            console.warn("You cannot chat with yourself, please use a different contact number");
        }
    }

    const addContact = (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            <Text style={{flex:6}}>Enter contact details</Text>
                            <Text style={{flex:2}}>  </Text>
                            <Text style={{flex:1}}>
                                <Icon
                                    name="close"
                                    backgroundColor="blue"
                                    onPress={()=>setModalVisible(false)}
                                    >
                                    </Icon>
                            </Text>
                        </Text>
                        <TextInput
                            onChangeText={setContactNumber}
                            value={contactNumber}
                            placeholder="Contact Number"
                            keyboardType="numeric"
                        />
                        <TextInput
                            onChangeText={setContactName}
                            value={contactName}
                            placeholder="Contact Name"
                        />
                        <Button
                            onPress={()=>processNewContact(contactNumber)}
                            title="Add contact"
                            color="blue"
                            accessibilityLabel="Add contact"
                            />
                    </View>
                </View>
            </Modal>
            <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}
            >
            <Icon
                name="plus"
                backgroundColor="blue"
                >
                </Icon>
            </Pressable>
        </View>
    );

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            <View style={{flex:1, flexDirection:'row'}}>
                <Text style={{flex:1}}>{"User: "+user}</Text>
                <Text style={{flex:5}}></Text>
                <Text style={{flex:1}}>{addContact}</Text>
            </View>
            {
                chatContacts.map((item)=>
                    showChat(item, props)
                )
            }
            {emptySpace(6)}
        </View>
    );

}