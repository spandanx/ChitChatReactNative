import React, { useState, useEffect, useRef } from 'react';
import {View, Text, Button, TextInput, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
// var RNFS = require('react-native-fs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {socketURL} from '../properties/networks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import uuid from 'react-native-uuid';
import {styles} from '../style/styles';
import { chatBackgroundImage } from '../properties/images-urls';

import Toast from 'react-native-root-toast';
import {toastProperties} from '../style/styles';
// import backgroundImage from '../images/background.jpg';
// import  from './background.jpg';

// const image = { uri: 'https://user-images.githubusercontent.com/56664469/203856075-4a772509-5f00-4b34-bfa9-28f193ff58e1.jpg' };
// const image = { uri: backgroundImage};
// const image = require("background.jpg");
// const image = { uri: '../images/background.jpg' };
//https://iili.io/H3Ydy9p.jpg
//https://iili.io/H37bogI.jpg
// const image = { uri: 'https://www.shutterstock.com/image-illustration/seamless-purple-white-stripe-pattern-260nw-334515410.jpg' };


var stompClient = null;

export const ChatScreen = (props) => {

    // const scrollViewRef = useRef();

    const [data, setData] = useState(
        [{
            date: 1666880022,
            message: "Hi",
            type: 'CHAT',
            source: 'ID1',
            destination: '',
            status: 'SEEN'
        },
        {
            date: 1666880122,
            message: "Hey",
            type: 'CHAT',
            source: 'ID2',
            destination: '',
            status: 'DELIVERED'
        },
        {
            date: 1666880322,
            message: "Hi again",
            type: 'CHAT',
            source: 'ID1',
            destination: '',
            status: 'SENT'
        }]
    );
    
    // let currentId = '';

    // useEffect(() => {
    //     currentId = props.navigation.state.params.currentUser;
    //   }, [props.navigation.state.params.currentUser]);

    // const [doConnect, setDoConnect] = useState(false);
    const [text, setText] = useState("");
    const [toUser, setToUser] = useState("");
    const [user, setUser] = useState("");
    const [uuidUser, setUuidUser] = useState("");
    const [subscription, setSubscription] = useState({});
    const [groupName, setGroupname] = useState(props.navigation.state.params.chatDetails.displayName);

    useEffect(() => {
        console.log(props);
        if (props.navigation.isFocused()) {
            console.log("FOCUS CHANGED IN CHAT"+props.navigation.isFocused());
        }
      }, [props.navigation.isFocused()]);

    useEffect(() => {
        if (props && props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser && props.navigation.state.params.currentUUID){
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
            // props.navigation.state.params.modifyChatFunction
            // props.navigation.state.params.stompClient
            // console.log(uuidUser);
            // console.log(props.navigation.state.params.chatDetails.displayName);
            // console.log(props);
            connect();
            // return () => {
            //     console.log("EXIT FROM CHATSCREEN");
            //     unsubscribe();
            // };
        }
      }, [props]);

    //   function handleBackButtonClick() {
    //     navigation.goBack();
    //     console.log("CLICKED BACK");
    //   }

    //   useEffect(() => {
        // console.log("NAVIGATION");
        // console.log(props.navigation);
        // props.navigation.setParams({
        //     headerRight: () => (
        //       <Button onPress={() => console.log("CLICKED HEADER ----")} title="Update count" />
        //     ),
        // });
        // props.navigation.goBack();
        // return () => {
        //     console.log("EXITING FROM []");
        // };
    //   }, []);

    //   useEffect(()=>{
    //     console.log("CHATARRAY CHANGE DETECTED");
    //     console.log(props.navigation.state.params.chatDetails.chatArray);
    //   }, [props.navigation.state.params.chatDetails.chatArray]);

    // useEffect(()=>{
    //     console.log("ALLCHAT changed ---------");
    //     console.log(props.navigation.state.params.allChat);
    //   }, [props.navigation.state.params.allChat]);

    //   useEffect(() => {
        
    //   });
        //'https://ws.postman-echo.com/raw';//'https://socketsbay.com/wss/v2/2/demo/';//'http://localhost:8080/ws';
    

    //--------------------- Websockets section
    const connect = async() => {
        console.log("CONNECTING");
        console.log(props.navigation.state.params.stompClient.connected);
        // stom
        // if (stompClient.connect){
            // let Sock = new SockJS(socketURL);
            // stompClient = over(Sock);

            // console.log(stompClient);
            // stompClient.connect({}, onConnected, onConnectError);//{"client-id": props.navigation.state.params.currentUser }
            subscribeToGroup();
        // }
        // else{
        // }
    }
    // const connect = () => {
    //     stompClient = Stomp.Client();

    //     stompClient.configure({
    //     brokerURL: 'http://10.0.2.2:8080/ws',
    //     onConnected, onConnectError
    //     });

    //     client.activate();
    // }
    const subscribeToGroup = () => {
        // if (props.navigation.state.params.chatDetails.ChatType=='PRIVATE'){
        //     //queue subscription
        //     props.navigation.state.params.stompClient.subscribe('/queue/'+props.navigation.state.params.chatDetails.subscriptionURL, onMessageReceived, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.log("SUBSCRIBED to QUEUE");
        // }
        // else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
        //     props.navigation.state.params.stompClient.subscribe('/topic/'+props.navigation.state.params.chatDetails.subscriptionURL, onMessageReceived, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid, "durable":true, "auto-delete":false});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.log("SUBSCRIBED to TOPIC");
        // }
        // else{
        //     console.log("WRONG CHAT TYPE");
        // }
        // // props.navigation.state.params.chatDetails.subscriptionURL
        // if (props.navigation.state.params.stompClient){
        //     console.log("SUBSCRIPTIONS");
        //     console.log(props.navigation.state.params.stompClient.subscriptions);
        // }
        
    }
    const onUnsubscribe = () => {
        console.log("Unsubscribed");
    }

    const unsubscribe = async() => {
        // if (props.navigation.state.params.chatDetails.ChatType=='PRIVATE'){
        //     //queue subscription
        //     console.log(subscription);
        //     props.navigation.state.params.stompClient.unsubscribe('/queue/'+props.navigation.state.params.chatDetails.subscriptionURL, onUnsubscribe, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.log("UNSUBSCRIBED from QUEUE");
        // }
        // else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
        //     console.log(subscription);
        //     props.navigation.state.params.stompClient.unsubscribe('/topic/'+props.navigation.state.params.chatDetails.subscriptionURL, onUnsubscribe, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.log("UNSUBSCRIBED from TOPIC");
            
        // }
        // else{
        //     console.log("WRONG CHAT TYPE");
        // }
    }

    const onConnected = () => {
        console.log("Connected");
        console.log("ISCONNECTED AFTER "+stompClient.connected);
        // console.log(stompClient);
        // let response = Stomp.topic("/topic").subscribe();
        subscribeToGroup();
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        // stompClient.subscribe('/chatroom/public', onMessageReceived); //{"activemq.subscriptionName": props.navigation.state.params.currentUser}
        // stompClient.subscribe('/user/Consumer.myConsumer1.VirtualTopic.MY-SUPER-TOPIC', onMessageReceived);
        // stompClient.subscribe('Consumer.'+props.navigation.state.params.currentUser+'.VirtualTopic.MY-SUPER-TOPIC', onMessageReceived);
        // console.log("after subscribe");
        // console.log(stompClient);
        // stompClient.subscribe('/user/'+props.navigation.state.params.currentUser+'/private', onPrivateMessageReceived, {customUser: props.navigation.state.params.currentUser});
        // setDoConnect(false);
    }

    // const onPrivateMessageReceived = (msg) => {
    //     // console.log(msg.body);
    //     let newMsg = JSON.parse(msg.body);
    //     newMsg['status'] = 'SEEN';
    //     // console.log(newMsg);
    //     setData(data => [...data, newMsg]);
    // }

    // const onMessageReceived = (msg) => {
    //     console.log("Received");
    //     console.log(msg.body);
    //     let msgBody = JSON.parse(msg.body);
    //     if (msgBody.type == 'SEND_MESSAGE'){
    //         msgBody.data['status'] = 'SEEN';
    //         setData(data => [...data, msgBody.data]);
    //     }
    //     else{
    //         console.log("WRONG MESSAGE TYPE RECEIVED");
    //     }
    // }

    const reSendMessage = (msg) => {

        let newMessage = 
            {
                type: "SEND_MESSAGE",
                data: msg
            }

        if (props.navigation.state.params.chatDetails.ChatType=='PRIVATE'){
            //send to queue
            console.log("props.navigation.state.params.stompClient.connected");
            console.log(props.navigation.state.params.stompClient.connected);
            if (props.navigation.state.params.stompClient.connected){
                newMessage.data.status = "SENT";

                let localModifiedArray = props.navigation.state.params.chatDetails.chatArray;
                let chatIndex = -1;
                for (let i = localModifiedArray.length; i>=0; i--){
                    if (localModifiedArray.messageID==msg.messageID){
                        chatIndex = i;
                    }
                }
                if (chatIndex!=-1){
                    // localModifiedArray.push(newMessage.data);...
                    localModifiedArray[chatIndex] = newMessage.data;
                    props.navigation.state.params.modifyChatFunction(localModifiedArray, props.navigation.state.params.chatIndex);
                    Toast.show('Message sent.', toastProperties);
                    console.warn("Message sent");

                    props.navigation.state.params.stompClient.send("/app/private-message/"+props.navigation.state.params.chatDetails.destinationURL, {}, JSON.stringify(newMessage));
                    console.log("SENT to QUEUE");
                }
                else{
                    console.log("CHAT NOT FOUND");
                }                
            }
            else{
                Toast.show('Could not send message, check you internet connection!', toastProperties);
                console.warn('Could not send message, check you internet connection!');
            }
        }
        else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
            
            console.log("GROUP MESSAGE SEND NOT Supported yet!");
        }
        else{
            console.log("WRONG CHAT TYPE TO SEND");
        }

    }

    const sendMessage = (msg) => {
        console.log("SUBSCRIPTION - "+props.navigation.state.params.userContactNo);
        console.log(props.navigation.state.params.stompClient.subscriptions);
        setText('');
        // console.warn("CONTACTNO - "+props.navigation.state.params.userContactNo);
        // console.log("sending the msg");
        if (!props.navigation.state.params.currentUser){
            console.log('Username not set');
        }
        else{
            
            let newMessage = 
            {
                type: "SEND_MESSAGE",
                data:
                {
                    senderContactNo: props.navigation.state.params.userContactNo,
                    senderUUID: props.navigation.state.params.currentUUID,
                    chatUUID: props.navigation.state.params.chatDetails.uuid,
                    messageID: uuid.v4(),
                    message: msg,
                    date: (new Date()).toString(),
                    chatRoomId: '',
                    type: 'MESSAGE',
                    ChatType: props.navigation.state.params.chatDetails.ChatType,
                    status: 'SENT'
                }
            }
            // console.log(newMessage);
            // stompClient.send("/app/message", {}, JSON.stringify(newMessage));
            // stompClient.send("/app/message", {}, JSON.stringify(newMessage));
            // stompClient.publish("/app/message", {}, JSON.stringify(newMessage));
            if (props.navigation.state.params.chatDetails.ChatType=='PRIVATE'){
                //send to queue
                console.log("props.navigation.state.params.stompClient.connected");
                console.log(props.navigation.state.params.stompClient.connected);
                if (props.navigation.state.params.stompClient.connected){
                    props.navigation.state.params.stompClient.send("/app/private-message/"+props.navigation.state.params.chatDetails.destinationURL, {}, JSON.stringify(newMessage));
                    console.log("SENT to QUEUE");
                    let localModifiedArray = props.navigation.state.params.chatDetails.chatArray;
                    localModifiedArray.push(newMessage.data);
                    props.navigation.state.params.modifyChatFunction(localModifiedArray, props.navigation.state.params.chatIndex);
                }
                else{
                    let localModifiedArray = props.navigation.state.params.chatDetails.chatArray;
                    newMessage.data.status = "FAILED";
                    localModifiedArray.push(newMessage.data);
                    props.navigation.state.params.modifyChatFunction(localModifiedArray, props.navigation.state.params.chatIndex);
                    Toast.show('Could not send message, check you internet connection!', toastProperties);
                    console.warn('Could not send message, check you internet connection!');
                }
            }
            else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
                //sent to topic
                props.navigation.state.params.stompClient.send("/app/message/"+props.navigation.state.params.chatDetails.subscriptionURL, {}, JSON.stringify(newMessage));
                console.log("SENT to TOPIC");
            }
            else{
                console.log("WRONG CHAT TYPE TO SEND");
            }
        }
    }

    // const sendPrivateMessage = (msg) => {
    //     setText('');
    //     // console.log("sending the msg");
    //     if (!props.navigation.state.params.currentUser){
    //         console.log('Username not set');
    //     }
    //     else if (!toUser){
    //         console.log('Destination User not set');
    //     }
    //     else{
    //         let newMessage = {
    //             source: props.navigation.state.params.currentUser,
    //             destination: toUser,
    //             message: msg,
    //             date: (new Date()).toString(),
    //             chatRoomId: '',
    //             type: 'MESSAGE'
    //         }
    //         // console.log(newMessage);
    //         stompClient.send("/app/private-message", {}, JSON.stringify(newMessage));
    //     }
    // }

    const onConnectError = (error) => {
        console.error("ERROR");
        console.error(error);
    }

    const writeToFile = async() => {
        try {
            let value = "jshja";
            // await AsyncStorage.setItem('alpha', value);
            await AsyncStorage.getItem('alpha').then((value)=>console.log(value));
            // console.log("write complete");
          } catch (e) {
            console.log(e);
          }
    }

    const disconnect = () => {
        if (stompClient==null){
            let Sock = new SockJS(socketURL);
            stompClient = over(Sock);
        }
        // console.log("Check if connected");
        // console.log(stompClient.connected);
        if (stompClient.connected){
            stompClient.disconnect(onDisconnected, onDisconnectError, {});
        }
        else{
            console.log("Not connected");
            // console.log(props);
            // console.log(props.navigation.state.params.currentUser);
        }
    }

    const onDisconnected = () => {
        console.log("Disconected");
    }

    const onDisconnectError = () => {
        console.log("Error while disconnecting");
    }

    //--------------------- Websockets section


    // const emptySpace = (n) => {
    //     let array = [];
    //     for (let i = 0; i<n; i++){
    //         array.push(
    //             <View style={{flex:1, flexDirection:'row'}}>
    //                 <View style={{flex:2}}></View>
    //                 <View style={{flex:8, alignItems:'flex-end'}}>
    //                 </View>
    //             </View>
    //         );
    //     }
    //     return array;
    // }
    const triggerTranslation = (contact) => {
        // console.log("CONTACT CHAT - ");
        // console.log(contact.senderContactNo);
        return props.navigation.state.params.contactTranslation(contact.senderContactNo);
    }

    const showChat = (item) => {
        return (
            item.senderUUID==props.navigation.state.params.currentUUID ?
                (<View style={{height: 80, flex:1, flexDirection:'row', borderRadius: 3}} key={item.messageID}>
                    <View style={{flex:2}}></View>
                    <View style={{marginRight:5, marginBottom: 25, borderRadius:10, alignItems:'flex-end', backgroundColor: '#E0E5FD', paddingHorizontal: 5, paddingVertical: 10}}>
                        {/* <Text>{"Sender: "+item.senderUUID}</Text>
                        <Text>{"Current: "+props.navigation.state.params.currentUUID}</Text> */}
                        <Text style={{fontWeight: 'bold', color:'blue'}}>{"You"}</Text>
                        <Text style={{backgroundColor: '#E0E5FD', marginBottom: 5}}>{item.message}</Text>
                        {
                            item.status=='FAILED'?
                                <AntDesign name="reload1" size={10} color={"red"} onPress={() => reSendMessage(item)}>{" Retry"}</AntDesign>
                            :
                                <Text></Text>
                        }
                    </View>
                </View>)
                :
                (<View style={{height: 80, flex:1, flexDirection:'row', borderRadius: 3}} key={item.messageID}>
                    <View style={{marginRight:5, marginBottom: 25, padding: 5, borderRadius:10, alignItems:'flex-start', backgroundColor: '#E0E5FD'}}>
                        {props.navigation.state.params.chatDetails.ChatType=='PRIVATE' &&
                            <Text style={{fontWeight: 'bold', color:'blue'}}>{props.navigation.state.params.chatDetails.displayName}</Text>
                        }
                        {
                            props.navigation.state.params.chatDetails.ChatType=='GROUP' &&
                            <Text style={{fontWeight: 'bold', color:'blue'}}>{triggerTranslation(item)}</Text>
                        }
                        <Text>{item.message}</Text>
                    </View>
                    <View style={{flex:2}}></View>
                </View>)
        );
    }

    // const styles = StyleSheet.create({
    //     input: {
    //       height: 40,
    //       margin: 12,
    //       borderWidth: 1,
    //       padding: 10,
    //     },
    //   });

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            {/* <View style={{flex:1, backgroundColor:'green'}}>
                <Text>
                    User: {props.navigation.state.params.currentUser}
                </Text>
            </View> */}
            <View style={{flex:12, backgroundColor:'white', flexDirection:'column'}}>
            <ImageBackground source={{uri: chatBackgroundImage}} resizeMode="cover" style={{flex: 1, justifyContent: "center"}}>
                <ScrollView style={styles.scrollView}>
                {/* {
                    props.navigation.state.params.chatDetails.chatArray.map((item)=>(
                        showChat(item)
                    ))
                } */}
                {/* {
                    console.log(props.navigation.state.params.chatDetails)
                } */}
                {
                    // console.log(props.navigation.state.params.chatDetails)
                    props.navigation.state.params.chatDetails.chatArray.slice(0).reverse().map((item)=>(
                        showChat(item)
                    ))
                }
                {/* {emptySpace(6)} */}
                {/* {
                <Button
                    onPress={()=>connect()}
                    title="Connect"
                    color="#841584"
                    accessibilityLabel="Click to connect"
                    />
                }
                {
                <Button
                    onPress={()=>disconnect()}
                    title="Disconnect"
                    color="red"
                    accessibilityLabel="Click to disconnect"
                    />
                }
                {
                    <Button
                    onPress={()=>writeToFile()}
                    title="Write"
                    color="blue"
                    accessibilityLabel="Save"
                    />
                } */}
                    
                </ScrollView>
                </ImageBackground>
            </View>
            {/* <View style={{flex:1, flexDirection:'row'}}>
                <TextInput
                    onChangeText={setToUser}
                    value={toUser}
                    placeholder="User"
                />
            </View> */}
            <View style={{flex:1, flexDirection:'row'}}>
                <View style={{flex:8}}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setText}
                        value={text}
                        placeholder="Message"
                        placeholderTextColor = 'black'
                        color='black'
                    />
                </View>
                <View style={{flex:2}}>
                    <Icon
                        name="send"
                        color="blue"
                        disabled={text===""}
                        onPress={()=>sendMessage(text)}
                        size={30}
                        style={{padding: 15}}
                        >
                        </Icon>
                    {/* <Button
                            onPress={()=>sendMessage(text)}
                            title="Send"
                            color="blue"
                            accessibilityLabel="Click to send"
                            /> */}
                </View>
            </View>
        </View>
    );
}