import React, { useState, useEffect } from 'react';
import {View, Button, TextInput, ActivityIndicator, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {phoneToIdUrlPath, idToPhoneUrlPath, jwtTokenUser, publicPath} from '../properties/networks';
import Toast from 'react-native-root-toast';
import {toastProperties} from '../style/styles';
import { Dropdown } from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from '../style/styles';
import { phoneCodes } from '../properties/phone-codes';

export const LoginScreen = (props) => {

    const [user, setUser] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [wait, setWait] = useState(true);
    const [userUuid, setUserUuid] = useState('');
    const [phoneRegister, setPhoneRegister] = useState(false);
    const [idRegister, setIdRegister] = useState(false);
    const [validNumber, setValidNumber] = useState(false);
    const [loginWait, setLoginWait] = useState(false);
    const [opsDone, setOpsDone] = useState(false);

    //----- drop down
    const [countryPhoneCode, setCountryPhoneCode] = useState("");
    const [isFocus, setIsFocus] = useState(false);

    const dropdownData = phoneCodes;

    useEffect(()=>{
        checkUserinStorage();
        console.warn("User : "+user);
        setLoginWait(false);
    }, []);

    useEffect(()=>{
        console.warn("Opsdone detected");
        if (opsDone){
            setLoginWait(false);
            console.warn("Opsdone loginWait to false");
        }
    }, [opsDone]);

    useEffect(()=>{
        if (isANumber(phoneNo)){
            setValidNumber(true);
        }
        else{
            setValidNumber(false);
            Toast.show('Not a valid Number!', toastProperties);
        }
    }, [phoneNo]);

    useEffect(()=>{
        if (phoneRegister && idRegister && userUuid!=''){
            setUserId(user, userUuid, countryPhoneCode+phoneNo);
            console.log("SAVING PHONE NUMBER - "+countryPhoneCode+phoneNo);
            props.navigation.navigate('Home', {currentUser: user, currentUUID: userUuid, userContactNo: countryPhoneCode+phoneNo});
        }

    }, [phoneRegister, idRegister, userUuid]);

    const postData = (url, body, successFunc, key, errorMessage) =>{

        fetch(url+'?'+key+"="+body.key, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwtTokenUser
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
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+jwtTokenUser
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

    function isANumber(str){
        // if (str.length>0 && str[0]=='+'){
        //     return !/\D/.test(str.substring(1, str.length));
        // }
        return !/\D/.test(str);
      }

    const register = async(contactNumber) => {
        // if (contactNumber.length>0 && contactNumber[0]=='+'){
        //     contactNumber = contactNumber.substring(1, contactNumber.length);
        // }
        contactNumber = countryPhoneCode+contactNumber;
        console.warn("Phone number = "+contactNumber);
        console.log('Bearer '+jwtTokenUser);
        let newUUID = uuid.v4();
        // setUserUuid(newUUID);

        let body = {
            "id" : newUUID,
            "phonenumber" : contactNumber
        }
        //checking if phone number exists
        console.warn("Checking if already exist");
        console.warn(phoneToIdUrlPath);

        try{
            fetch(phoneToIdUrlPath+"?phonenumber="+contactNumber, {
            // fetch(publicPath, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+jwtTokenUser
                    // 'Authorization': 'Basic dXNlcjE6cGFzczE='
                }
                })
                .then((response) => 
                    response.status == "200"? response.json() : response
                    )
                .then((responseJson) => {
                    console.log("RESJSON - ");
                    console.warn(responseJson);
                    // console.log(responseJson.status);
                    if(responseJson.status == '401'){
                        Toast.show('Unauthorized!', toastProperties);
                        console.log('Unauthorized!');
                    }
                    else if(responseJson.status == '400'){
                        Toast.show('Bad Request!', toastProperties);
                        console.log('Bad request!');
                    }
                    else{
                        // responseJson = responseJson.json();
                        // console.log(typeof responseJson);
                        // console.log(responseJson.id);
                        // console.log(responseJson);
                        // console.log(responseJson[0].id);
                        if (responseJson.length==0){
                            console.warn("Phone number does not exist, so creating it");
                            Toast.show('Creating new account.', toastProperties);
                            postData(phoneToIdUrlPath, body, setPhoneRegister, 'phonenumber', 'Contact number already exists, try with another number.');
                            postData(idToPhoneUrlPath, body, setIdRegister, 'id', 'Could not generate UUID. Please restart the app.');
                        }
                        else{
                            console.warn("Found existing phone number");
                            Toast.show('Account already exists.', toastProperties);
                            storeUserinStorage('__UUID__', responseJson[0].id);
                            setUserUuid(responseJson[0].id);
                            setPhoneRegister(true);
                            setIdRegister(true);
                        }
                    }
                    console.warn("Ops done");
                    setOpsDone(true);
                    setLoginWait(false);
                  })
                .catch((err) => {
                    console.log("ERR");
                    console.warn(err);
                    setOpsDone(true);
                    setLoginWait(false);

                    console.warn("Setting opsDone to true");
                    Toast.show('Could not connect to the server, please check your internet connection!', toastProperties);
                });
        }
        catch(ex) {
            console.log("EX - ");
            console.log(ex);
        }
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

    const checkPhoneNumberlength = () => {
        if (str!=null && str.length!=10){
            return false;
        }
    }

    const clickUserSet = async(userId) => {
        if (!userId || !phoneNo || countryPhoneCode==""){
            console.warn("User details not set");
            Toast.show('User details not set!', toastProperties);
        }
        else if (phoneNo==null || phoneNo.length!=10){
            console.warn("Not a valid phone number");
            Toast.show('Not a valid phone number!', toastProperties);
        }
        else{
            console.warn("Registering if does not exist");
            setLoginWait(true);
            register(phoneNo);
            // setLoginWait(false);
            // register(phoneNo);
            // setUserId(userId, newUUID);
            // props.navigation.navigate('Home', {currentUser: userId, currentUUID: newUUID});
            // setIsClick(true);
        }
    }

    return (
        <View style={{flex:1, flexDirection:'column', alignItems: 'center', marginTop: 200}}>
            {wait?
                <ActivityIndicator size="large" />
                :
                <View style={{flex:1, flexDirection:'column', borderTopWidth: 1, borderTopWidth: 1}}>
                    <TextInput 
                        onChangeText={setUser}
                        value={user}
                        placeholder="Enter username"
                        placeholderTextColor = 'black'
                        color='black'
                    />
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select country' : '...'}
                        searchPlaceholder="Search..."
                        value={countryPhoneCode}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setCountryPhoneCode(item.value);
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <Feather
                            style={styles.icon}
                            color={isFocus ? 'blue' : 'black'}
                            name="phone"
                            size={20}
                            />
                        )}
                    />
                    <Text style={{color:'black'}}>{"Country code: + "+countryPhoneCode}</Text>
                    <TextInput 
                        onChangeText={setPhoneNo}
                        value={phoneNo}
                        placeholder="Enter phone number"
                        keyboardType="numeric"
                        placeholderTextColor = 'black'
                        color='black'
                        underlineColorAndroid= {validNumber? 'transparent': 'red'}
                    />
                    <Button
                        onPress={()=>clickUserSet(user)}
                        title="Login"
                        color="blue"
                        accessibilityLabel="Login"
                        disabled={loginWait}
                    />
                    {loginWait? 
                        <ActivityIndicator size="large" />
                        :
                        <></>
                    }
                </View>
            }
        </View>
    );
}