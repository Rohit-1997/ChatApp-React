import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import { View, StyleSheet,Text } from 'react-native';
import Primary from './UserChatDisplayScreens/GroupPrimary';
import Others from './UserChatDisplayScreens/GroupOthers';


const Tab = createMaterialTopTabNavigator();


export default function GroupChatView(props) {
    const parameters = props.route.params;              // To store a reference to the parameters passed
    // styling the header
    props.navigation.setOptions({
        title: props.route.params.GroupName,
        // headerRight: () => {
        //     return (
        //         <View style={{ paddingRight: 10 }}>
        //             {/* <Thumbnail small source={{ uri: parameters.senderPicture }} /> */}
        //             <Text>Hey Hero</Text>
        //         </View>
        //     )
        // },
        headerLeft :() =>{
            return (
                <HeaderBackButton onPress={() => props.navigation.navigate("Groups")}/>
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

    // console.log("The test for user emails in chat view main: ", parameters);
    // console.log("The Test for the sender Email: ", parameters.senderEmail);
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
                {() => <Primary groupName={parameters.GroupName} docKey = {parameters.docKey} />}
            </Tab.Screen>
            <Tab.Screen name="Others">
                {() => <Others groupName={parameters.GroupName} docKey = {parameters.docKey} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({
    tabs: {
        backgroundColor: '#9477cb'
    },
});