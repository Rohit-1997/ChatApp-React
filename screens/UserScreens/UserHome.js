// This component holds all the stack routes after the user logs in

import * as React from 'react';
import {View, Text} from 'react-native';
import {Icon} from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import PageHeader from './PageHeader';
import UserChatView from './UserChatView';


const Stack = createStackNavigator();


export default function UserHome(props) {
    // console.log("The props in userHome", props);
    return (
        <Stack.Navigator>
            <Stack.Screen name="Header" component={PageHeader} />
            <Stack.Screen name="Chat View" component={UserChatView}/>
        </Stack.Navigator>
    )
}