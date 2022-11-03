import React, { useState, useEffect } from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
// var RNFS = require('react-native-fs');
import AsyncStorage from '@react-native-async-storage/async-storage';

var stompClient = null;

export const ChatScreen = (props) => {

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

    useEffect(() => {
        if (props && props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser && props.navigation.state.params.currentUUID){
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
            // console.log(uuidUser);
        }
      }, [props]);

    const socketURL = 'http://10.0.2.2:8080/ws';//'https://ws.postman-echo.com/raw';//'https://socketsbay.com/wss/v2/2/demo/';//'http://localhost:8080/ws';
    

    //--------------------- Websockets section
    const connect = () => {
        let Sock = new SockJS(socketURL);
        console.log("Sock details");
        // console.log(Sock);
        stompClient = over(Sock);
        // stompClient = Stomp.client(socketURL);

        console.log(stompClient);
        stompClient.connect({}, onConnected, onConnectError);//{"client-id": props.navigation.state.params.currentUser }
    }
    // const connect = () => {
    //     stompClient = Stomp.Client();

    //     stompClient.configure({
    //     brokerURL: 'http://10.0.2.2:8080/ws',
    //     onConnected, onConnectError
    //     });

    //     client.activate();
    // }

    const onConnected = () => {
        console.warn("Connected");
        // console.log(stompClient);
        // let response = Stomp.topic("/topic").subscribe();

        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/topic/group1', onMessageReceived, {"id":uuidUser, "durable":true, "auto-delete":false});//{"id":1234, "durable":true, "auto-delete":false}
        // stompClient.subscribe('/chatroom/public', onMessageReceived); //{"activemq.subscriptionName": props.navigation.state.params.currentUser}
        // stompClient.subscribe('/user/Consumer.myConsumer1.VirtualTopic.MY-SUPER-TOPIC', onMessageReceived);
        // stompClient.subscribe('Consumer.'+props.navigation.state.params.currentUser+'.VirtualTopic.MY-SUPER-TOPIC', onMessageReceived);
        // console.warn("after subscribe");
        // console.log(stompClient);
        // stompClient.subscribe('/user/'+props.navigation.state.params.currentUser+'/private', onPrivateMessageReceived, {customUser: props.navigation.state.params.currentUser});
        // setDoConnect(false);
    }

    const onPrivateMessageReceived = (msg) => {
        // console.warn(msg.body);
        let newMsg = JSON.parse(msg.body);
        newMsg['status'] = 'SEEN';
        // console.warn(newMsg);
        setData(data => [...data, newMsg]);
    }

    const onMessageReceived = (msg) => {
        console.warn("Received");
        console.warn(msg.body);
        let newMsg = JSON.parse(msg.body);
        newMsg['status'] = 'SEEN';
        // console.warn(newMsg);
        setData(data => [...data, newMsg]);
    }

    const sendMessage = (msg) => {
        setText('');
        // console.warn("sending the msg");
        if (!props.navigation.state.params.currentUser){
            console.warn('Username not set');
        }
        else{
            let newMessage = {
                source: props.navigation.state.params.currentUser,
                message: msg,
                date: (new Date()).toString(),
                chatRoomId: '',
                type: 'MESSAGE'
            }
            // console.warn(newMessage);
            // stompClient.send("/app/message", {}, JSON.stringify(newMessage));
            stompClient.send("/app/message", {}, JSON.stringify(newMessage));
            // stompClient.publish("/app/message", {}, JSON.stringify(newMessage));
        }
    }

    const sendPrivateMessage = (msg) => {
        setText('');
        // console.warn("sending the msg");
        if (!props.navigation.state.params.currentUser){
            console.warn('Username not set');
        }
        else if (!toUser){
            console.warn('Destination User not set');
        }
        else{
            let newMessage = {
                source: props.navigation.state.params.currentUser,
                destination: toUser,
                message: msg,
                date: (new Date()).toString(),
                chatRoomId: '',
                type: 'MESSAGE'
            }
            // console.warn(newMessage);
            stompClient.send("/app/private-message", {}, JSON.stringify(newMessage));
        }
    }

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
                (<View style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
                    <View style={{flex:2}}></View>
                    <View style={{flex:8, alignItems:'flex-end'}}>
                        <Text>{item.message}</Text>
                    </View>
                </View>)
                :
                (<View style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
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
            <View style={{flex:1, backgroundColor:'green'}}>
                <Text>
                    User: {props.navigation.state.params.currentUser}
                </Text>
                </View>
            <View style={{flex:12, backgroundColor:'white', flexDirection:'column'}}>
                {
                    data.map((item)=>(
                        showChat(item)
                    ))
                }
                {emptySpace(6)}
                {
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
                }
                
            </View>
            <View style={{flex:1, flexDirection:'row'}}>
                <TextInput
                    onChangeText={setToUser}
                    value={toUser}
                    placeholder="User"
                />
            </View>
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
            <Button
                    onPress={()=>sendMessage(text)}
                    title="Send"
                    color="blue"
                    accessibilityLabel="Click to send"
                    />
            </View>
            </View>
        </View>
    );
}