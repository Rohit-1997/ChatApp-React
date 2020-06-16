import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Thumbnail } from 'native-base';
import { View, StyleSheet } from 'react-native';
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
                    <Thumbnail small source={{ uri: parameters.senderPicture }} />
                </View>
            )
        },
        headerTitleStyle: {
            alignSelf: 'center'
        },
        headerStyle: {
            backgroundColor: '#9477cb'
        },
        headerTintColor: '#fff'
    })
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "white",
                tabTextColor: "white",
                // inactiveTintColor: "blue",
                labelStyle: { fontSize: 17 },
                style: styles.tabs,
                indicatorStyle: {
                    bottom: 0,
                    backgroundColor: 'white',
                    borderRadius: 10
                },
            }}>
            <Tab.Screen name="Primary">
                {() => <Primary senderName={parameters.senderName} currentUser={parameters.currentUser} senderEmail={parameters.senderEmail} />}
            </Tab.Screen>
            <Tab.Screen name="Others">
                {() => <Others senderName={parameters.senderName} currentUser={parameters.currentUser} senderEmail={parameters.senderEmail} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({
    tabs: {
        backgroundColor: '#9477cb'
    },
});