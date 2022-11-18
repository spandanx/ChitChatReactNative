import React, { useState, useEffect } from 'react';
import {View, Button, TextInput, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {phoneToIdUrlPath, idToPhoneUrlPath} from '../properties/networks';

export const LoginScreen = (props) => {

    const [user, setUser] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [wait, setWait] = useState(true);
    const [userUuid, setUserUuid] = useState('');
    const [phoneRegister, setPhoneRegister] = useState(false);
    const [idRegister, setIdRegister] = useState(false);


    useEffect(()=>{
        checkUserinStorage();
        console.warn("User : "+user);
    }, []);

    useEffect(()=>{
        if (phoneRegister && idRegister && userUuid!=''){
            setUserId(user, userUuid, phoneNo);
            props.navigation.navigate('Home', {currentUser: user, currentUUID: userUuid, userContactNo: phoneNo});
        }

    }, [phoneRegister, idRegister, userUuid]);

    const postData = (url, body, successFunc, key, errorMessage) =>{

        fetch(url+'?'+key+"="+body.key, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length==0){
                    console.warn("Does not exist, so creating"+key);
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.warn("DONE "+url);
                            successFunc(true);
                          })
                        .catch((err) => console.warn(err));
                }
                else{
                    console.warn(errorMessage);
                }
              })
            .catch((err) => console.warn(err));

        
    }

    const register = (contactNumber) => {

        if (contactNumber.length>0 && contactNumber[0]=='+'){
            contactNumber = contactNumber.substring(1, contactNumber.length);
        }
        let newUUID = uuid.v4();
        // setUserUuid(newUUID);

        let body = {
            "id" : newUUID,
            "phonenumber" : contactNumber
        }
        //checking if phone number exists
        console.warn("Checking if already exist");
        fetch(phoneToIdUrlPath+"?phonenumber="+contactNumber, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.warn(responseJson);
                if (responseJson.length==0){
                    console.warn("Phone number does not exist, so creating it");
                    postData(phoneToIdUrlPath, body, setPhoneRegister, 'phonenumber', 'Contact number already exists, try with another number.');
                    postData(idToPhoneUrlPath, body, setIdRegister, 'id', 'Could not generate UUID. Please restart the app.');
                }
                else{
                    console.warn("Found existing phone number");
                    // console.warn("ID - "+  responseJson[0].id);
                    storeUserinStorage('__UUID__', responseJson[0].id);
                    setUserUuid(responseJson[0].id);
                    setPhoneRegister(true);
                    setIdRegister(true);
                }
              })
            .catch((err) => console.warn(err));
    }

    const checkUserinStorage = async() => {
        try {
            let userId = await AsyncStorage.getItem('__USERNAME__');
            if (userId!=null && userId!=""){
                setUser(userId);
                console.warn("Found userName");
                let existingUUID = await AsyncStorage.getItem('__UUID__');
                if (existingUUID!=null && existingUUID!=""){
                    console.warn("Found UUID");
                    let existingPhNo = await AsyncStorage.getItem('__CONTACTNO__');
                    if (existingPhNo!=null && existingPhNo!=""){
                        console.warn("Found ContactNumber");
                        props.navigation.navigate('Home', {currentUser: userId, currentUUID: existingUUID, userContactNo: existingPhNo});
                    }
                    else{
                        console.warn("could not found ContactNumber");
                    }
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

    const storeUserinStorage = async(key, value) => {
        try {
            if (value!=null && value!=''){
                await AsyncStorage.setItem(key, value);
            }
          } catch (e) {
            console.warn(e);
          }
    }

    const setUserId = async(userId, newUUID, phoneNo) => {
        storeUserinStorage('__USERNAME__', userId);
        storeUserinStorage('__UUID__', newUUID);
        storeUserinStorage('__CONTACTNO__', phoneNo);
        storeUserinStorage('__CHATINFO__', JSON.stringify({}));
    }

    const clickUserSet = (userId) => {
        if (!userId || !phoneNo){
            console.warn("User details not set");
        }
        else{
            console.warn("Registering if does not exist");
            register(phoneNo);
            // setUserId(userId, newUUID);
            // props.navigation.navigate('Home', {currentUser: userId, currentUUID: newUUID});
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
                    <TextInput 
                        onChangeText={setPhoneNo}
                        value={phoneNo}
                        placeholder="Enter phone number"
                        keyboardType="numeric"
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