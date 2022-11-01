import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
// import { TouchableHighlight } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const HomeScreen = (props) => {

    let chatContacts = [{
            lastActivity: 1666880022,
            contactName: "Dean",
            lastChat: 'Hi',
            imageUrl: 'someurl'
        },
        {
            lastActivity: 1666880122,
            contactName: "John",
            lastChat: 'Hello',
            imageUrl: 'someurl'
        }
    ];

    const [user, setUser] = useState('');
    const [uuidUser, setUuidUser] = useState('');

    useEffect(()=>{
        checkUserinStorage();
    }, []);

    useEffect(()=>{
        if (props && props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.currentUser && props.navigation.state.params.currentUUID){
            setUser(props.navigation.state.params.currentUser);
            setUuidUser(props.navigation.state.params.currentUUID);
        }
        console.warn(props);
    }, [props]);

    const checkUserinStorage = async() => {
        // console.warn("Checking username");
        try {
            let userId = await AsyncStorage.getItem('__USERNAME__');
            if (userId!=null && userId!=""){
                setUser(userId);
                console.warn("Found userName");
                let uuidOfUser = await AsyncStorage.getItem('__UUID__');
                if (uuidOfUser!=null && uuidOfUser!=""){
                    setUuidUser(uuidOfUser);
                    console.warn("Found uuid");
                }
                else{
                    console.warn("Could not found uuid");
                }
            }
            else{
                console.warn("Could not find userName");
                props.navigation.navigate('Login');
            }
          } catch (e) {
            console.warn(e);
          }
    }

    const showChat = (item, props) => {
        return (
            <Text onPress={()=>props.navigation.navigate('Chat', {currentUser: user, currentUUID: uuidUser})} key={item.lastActivity} style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
                <View style={{flex:1}}></View>
                <View style={{flex:20, alignItems:'flex-start'}}>
                    <Text style={{fontWeight: "bold"}}>{item.contactName}</Text>
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

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            <Text>{"User: "+user}</Text>
            {
                chatContacts.map((item)=>
                    showChat(item, props)
                )
            }
            {emptySpace(6)}
        </View>
    );

}