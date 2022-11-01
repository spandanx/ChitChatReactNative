import React, { useState, useEffect } from 'react';
import {View, Button, TextInput, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const LoginScreen = (props) => {

    const [user, setUser] = useState('');
    // const [isClicked, setIsClick] = useState(false);
    const [wait, setWait] = useState(true);

    useEffect(()=>{
        checkUserinStorage();
        console.warn("User : "+user);
    }, []);

    const checkUserinStorage = async() => {
        try {
            let userId = await AsyncStorage.getItem('__USERNAME__');
            if (userId!=null && userId!=""){
                setUser(userId);
                console.warn("Found userName");
                let existingUUID = await AsyncStorage.getItem('__UUID__');
                if (existingUUID!=null && existingUUID!=""){
                    console.warn("Found UUID");
                    props.navigation.navigate('Home', {currentUser: userId, currentUUID: existingUUID});
                }
                else{
                    console.warn("could not found UUID");
                }
            }
            else{
                console.warn("Could not find userName");
            }
          } catch (e) {
            console.warn(e);
          }
          setWait(false);
    }

    const storeUserinStorage = async(key, userId) => {
        try {
            await AsyncStorage.setItem(key, userId);
          } catch (e) {
            console.warn(e);
          }
    }

    const setUserId = (userId, newUUID) => {
        storeUserinStorage('__USERNAME__', userId);
        storeUserinStorage('__UUID__', newUUID);
    }

    const clickUserSet = (userId) => {
        if (!userId){
            console.warn("User not set");
        }
        else{
            let newUUID = uuid.v4();
            setUserId(userId, newUUID);
            props.navigation.navigate('Home', {currentUser: userId, currentUUID: newUUID});
            // setIsClick(true);
        }
    }

    return (
        <View style={{flex:1, flexDirection:'column'}}>
            {wait?
                <ActivityIndicator size="large" />
                :
                <View style={{flex:1, flexDirection:'column'}}>
                    <TextInput 
                        onChangeText={setUser}
                        value={user}
                        placeholder="Enter username"
                    />
                    <Button
                        onPress={()=>clickUserSet(user)}
                        title="Send"
                        color="blue"
                        accessibilityLabel="Set username"
                    />
                </View>
            }
        </View>
    );
}