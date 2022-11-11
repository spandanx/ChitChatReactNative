import React, { useState, useEffect, useRef } from 'react';
import {View, Text, Button, TextInput, StyleSheet, ScrollView} from 'react-native';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
// var RNFS = require('react-native-fs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {socketURL} from '../properties/networks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uuid from 'react-native-uuid';
import {styles} from '../style/styles';


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

    useEffect(() => {
        console.log(props);
        if (props.navigation.isFocused()) {
            console.warn("FOCUS CHANGED IN CHAT"+props.navigation.isFocused());
        }
      }, [props.navigation.isFocused()]);

    useEffect(() => {
        if (props && props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser && props.navigation.state.params.currentUUID){
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
            // props.navigation.state.params.modifyChatFunction
            // props.navigation.state.params.stompClient
            // console.log(uuidUser);
            // console.warn(props.navigation.state.params.chatDetails.displayName);
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
    //     console.warn("CLICKED BACK");
    //   }

      useEffect(() => {
        return () => {
            console.warn("EXITING FROM []");
            // props.navigation.state.params.exitFunction();
        };
      }, []);

    //   useEffect(()=>{
    //     console.warn("CHATARRAY CHANGE DETECTED");
    //     console.warn(props.navigation.state.params.chatDetails.chatArray);
    //   }, [props.navigation.state.params.chatDetails.chatArray]);

    // useEffect(()=>{
    //     console.warn("ALLCHAT changed ---------");
    //     console.warn(props.navigation.state.params.allChat);
    //   }, [props.navigation.state.params.allChat]);

    //   useEffect(() => {
        
    //   });
        //'https://ws.postman-echo.com/raw';//'https://socketsbay.com/wss/v2/2/demo/';//'http://localhost:8080/ws';
    

    //--------------------- Websockets section
    const connect = async() => {
        console.warn("CONNECTING");
        console.warn(props.navigation.state.params.stompClient.connected);
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
        //     console.warn("SUBSCRIBED to QUEUE");
        // }
        // else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
        //     props.navigation.state.params.stompClient.subscribe('/topic/'+props.navigation.state.params.chatDetails.subscriptionURL, onMessageReceived, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid, "durable":true, "auto-delete":false});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.warn("SUBSCRIBED to TOPIC");
        // }
        // else{
        //     console.warn("WRONG CHAT TYPE");
        // }
        // // props.navigation.state.params.chatDetails.subscriptionURL
        // if (props.navigation.state.params.stompClient){
        //     console.warn("SUBSCRIPTIONS");
        //     console.warn(props.navigation.state.params.stompClient.subscriptions);
        // }
        
    }
    const onUnsubscribe = () => {
        console.warn("Unsubscribed");
    }

    const unsubscribe = async() => {
        // if (props.navigation.state.params.chatDetails.ChatType=='PRIVATE'){
        //     //queue subscription
        //     console.warn(subscription);
        //     props.navigation.state.params.stompClient.unsubscribe('/queue/'+props.navigation.state.params.chatDetails.subscriptionURL, onUnsubscribe, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.warn("UNSUBSCRIBED from QUEUE");
        // }
        // else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
        //     console.warn(subscription);
        //     props.navigation.state.params.stompClient.unsubscribe('/topic/'+props.navigation.state.params.chatDetails.subscriptionURL, onUnsubscribe, {"id":props.navigation.state.params.currentUUID+"_"+props.navigation.state.params.chatDetails.uuid});//{"id":1234, "durable":true, "auto-delete":false}
        //     console.warn("UNSUBSCRIBED from TOPIC");
            
        // }
        // else{
        //     console.warn("WRONG CHAT TYPE");
        // }
    }

    const onConnected = () => {
        console.warn("Connected");
        console.warn("ISCONNECTED AFTER "+stompClient.connected);
        // console.log(stompClient);
        // let response = Stomp.topic("/topic").subscribe();
        subscribeToGroup();
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        // stompClient.subscribe('/chatroom/public', onMessageReceived); //{"activemq.subscriptionName": props.navigation.state.params.currentUser}
        // stompClient.subscribe('/user/Consumer.myConsumer1.VirtualTopic.MY-SUPER-TOPIC', onMessageReceived);
        // stompClient.subscribe('Consumer.'+props.navigation.state.params.currentUser+'.VirtualTopic.MY-SUPER-TOPIC', onMessageReceived);
        // console.warn("after subscribe");
        // console.log(stompClient);
        // stompClient.subscribe('/user/'+props.navigation.state.params.currentUser+'/private', onPrivateMessageReceived, {customUser: props.navigation.state.params.currentUser});
        // setDoConnect(false);
    }

    // const onPrivateMessageReceived = (msg) => {
    //     // console.warn(msg.body);
    //     let newMsg = JSON.parse(msg.body);
    //     newMsg['status'] = 'SEEN';
    //     // console.warn(newMsg);
    //     setData(data => [...data, newMsg]);
    // }

    const onMessageReceived = (msg) => {
        console.warn("Received");
        console.warn(msg.body);
        let msgBody = JSON.parse(msg.body);
        if (msgBody.type == 'SEND_MESSAGE'){
            msgBody.data['status'] = 'SEEN';
            setData(data => [...data, msgBody.data]);
        }
        else{
            console.warn("WRONG MESSAGE TYPE RECEIVED");
        }
    }

    const sendMessage = (msg) => {
        setText('');
        // console.warn("sending the msg");
        if (!props.navigation.state.params.currentUser){
            console.warn('Username not set');
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
            // console.warn(newMessage);
            // stompClient.send("/app/message", {}, JSON.stringify(newMessage));
            // stompClient.send("/app/message", {}, JSON.stringify(newMessage));
            // stompClient.publish("/app/message", {}, JSON.stringify(newMessage));
            if (props.navigation.state.params.chatDetails.ChatType=='PRIVATE'){
                //send to queue
                props.navigation.state.params.stompClient.send("/app/private-message/"+props.navigation.state.params.chatDetails.destinationURL, {}, JSON.stringify(newMessage));
                console.warn("SENT to QUEUE");
                let localModifiedArray = props.navigation.state.params.chatDetails.chatArray;
                localModifiedArray.push(newMessage.data);
                props.navigation.state.params.modifyChatFunction(localModifiedArray, props.navigation.state.params.chatIndex);
            }
            else if (props.navigation.state.params.chatDetails.ChatType=='GROUP'){
                //sent to topic
                props.navigation.state.params.stompClient.send("/app/message/"+props.navigation.state.params.chatDetails.subscriptionURL, {}, JSON.stringify(newMessage));
                console.warn("SENT to TOPIC");
            }
            else{
                console.warn("WRONG CHAT TYPE TO SEND");
            }
        }
    }

    // const sendPrivateMessage = (msg) => {
    //     setText('');
    //     // console.warn("sending the msg");
    //     if (!props.navigation.state.params.currentUser){
    //         console.warn('Username not set');
    //     }
    //     else if (!toUser){
    //         console.warn('Destination User not set');
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
    //         // console.warn(newMessage);
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
            await AsyncStorage.getItem('alpha').then((value)=>console.warn(value));
            // console.warn("write complete");
          } catch (e) {
            console.warn(e);
          }
    }

    const disconnect = () => {
        if (stompClient==null){
            let Sock = new SockJS(socketURL);
            stompClient = over(Sock);
        }
        // console.warn("Check if connected");
        // console.warn(stompClient.connected);
        if (stompClient.connected){
            stompClient.disconnect(onDisconnected, onDisconnectError, {});
        }
        else{
            console.warn("Not connected");
            // console.warn(props);
            // console.warn(props.navigation.state.params.currentUser);
        }
    }

    const onDisconnected = () => {
        console.warn("Disconected");
    }

    const onDisconnectError = () => {
        console.warn("Error while disconnecting");
    }

    //--------------------- Websockets section


    const emptySpace = (n) => {
        let array = [];
        for (let i = 0; i<n; i++){
            array.push(
                <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:2}}></View>
                    <View style={{flex:8, alignItems:'flex-end'}}>
                    </View>
                </View>
            );
        }
        return array;
    }

    const showChat = (item) => {
        return (
            item.sender && item.sender==user ? 
                // (<View style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
                //     <View style={{flex:2}}></View>
                //     <View style={{flex:8, alignItems:'flex-end'}}>
                //         <Text>{item.message}</Text>
                //     </View>
                // </View>)
                // :
                // (<View style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
                //     <View style={{flex:8, alignItems:'flex-start'}}>
                //         <Text>{item.message}</Text>
                //     </View>
                //     <View style={{flex:2}}></View>
                // </View>)
                (<View style={{height: 50, flex:1, flexDirection:'row', borderColor:'black', borderBottomWidth:1, backgroundColor: '#E0E5FD', borderRadius: 3}}>
                    <View style={{flex:2}}></View>
                    <View style={{flex:8, alignItems:'flex-end'}}>
                        <Text>{item.message}</Text>
                    </View>
                </View>)
                :
                (<View style={{height: 50, flex:1, flexDirection:'row', borderColor:'black', borderBottomWidth:1, backgroundColor: '#E0E5FD', borderRadius: 3}}>
                    <View style={{flex:8, alignItems:'flex-start'}}>
                        <Text>{item.message}</Text>
                    </View>
                    <View style={{flex:2}}></View>
                </View>)
        );
    }

    const styles = StyleSheet.create({
        input: {
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
        },
      });

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            {/* <View style={{flex:1, backgroundColor:'green'}}>
                <Text>
                    User: {props.navigation.state.params.currentUser}
                </Text>
            </View> */}
            <View style={{flex:12, backgroundColor:'white', flexDirection:'column'}}>
                <ScrollView style={styles.scrollView}>
                {/* {
                    props.navigation.state.params.chatDetails.chatArray.map((item)=>(
                        showChat(item)
                    ))
                } */}
                {/* {
                    console.warn(props.navigation.state.params.chatDetails)
                } */}
                {
                    // console.warn(props.navigation.state.params.chatDetails)
                    props.navigation.state.params.chatDetails.chatArray.slice(0).reverse().map((item)=>(
                        showChat(item)
                    ))
                }
                {emptySpace(6)}
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
                    />
                </View>
                <View style={{flex:2}}>
                    <Icon
                        name="send"
                        color="blue"
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