import * as React from 'react';
import {Text, View} from 'react-native';
import {DrawerActions} from '@react-navigation/material-top-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import UserHome from './UserScreens/UserHome';
import {Icon, Button} from 'native-base';


const Drawer = createDrawerNavigator();


// The test component
function TestScreen(props) {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Go Back Home" onPress={() => props.navigation.goBack()}/>
        </View>
    )
}

export default function UserDashboard(props) {

    return (
        <Drawer.Navigator initialRouteName="UserHome">
            <Drawer.Screen name="UserHome" component={UserHome}/>
            <Drawer.Screen name="Profile Settings" component={TestScreen} />
            <Drawer.Screen name="Notifications" component={TestScreen} />
        </Drawer.Navigator>
    )
}
