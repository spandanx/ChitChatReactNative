import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

export const HomeScreen = (props) => {

    const [user, setUser] = useState('');
    const [isClicked, setIsClick] = useState(false);

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

    const showChat = (item, props) => {
        return (
            <Text onPress={()=>props.navigation.navigate('Chat', {currentUser: user})} key={item.lastActivity} style={{flex:1, flexDirection:'row', borderColor:'black', borderWidth:1}}>
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
            {user && isClicked? 
            chatContacts.map((item)=>
                showChat(item, props)
            )
            :
            <View style={{flex:1, flexDirection:'column'}}>
                <TextInput 
                    onChangeText={setUser}
                    value={user}
                    placeholder="Enter username"
                />
                <Button
                    onPress={()=>setIsClick(true)}
                    title="Send"
                    color="blue"
                    accessibilityLabel="Set username"
                />
            </View>
            }
            {emptySpace(6)}
        </View>
    );

}