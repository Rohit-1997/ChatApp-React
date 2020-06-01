import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Thumbnail } from 'native-base';
import {View} from 'react-native';
import Primary from './UserChatDisplayScreens/Primary';
import Others from './UserChatDisplayScreens/Others';


const Tab = createMaterialTopTabNavigator();


export default function UserChatView(props) {
    
    const parameters = props.route.params;              // To store a reference to the parameters passed
    // styling the header
    props.navigation.setOptions({
        title: props.route.params.senderName,
        headerRight: () => {
            return (
                <View style={{ paddingRight: 10 }}>
                    <Thumbnail small source={{ uri: parameters.senderPicture }}/>
                </View>
            )
        }
    })
    // console.log("The test for user emails in chat view main: ", parameters);
    console.log("The Test for the sender Email: ", parameters.senderEmail);
    return (
        <Tab.Navigator>
            <Tab.Screen name="Primary">
                {() => <Primary senderName={parameters.senderName} currentUser={parameters.currentUser} senderEmail={parameters.senderEmail}/>}
            </Tab.Screen>
            <Tab.Screen name="Others">
                {() => <Others senderName={parameters.senderName} currentUser={parameters.currentUser} senderEmail={parameters.senderEmail}/>}
            </Tab.Screen>
        </Tab.Navigator>
    )
}