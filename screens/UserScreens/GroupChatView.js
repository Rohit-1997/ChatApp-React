import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import { View, StyleSheet,Text, ActivityIndicator } from 'react-native';
import Primary from './UserChatDisplayScreens/GroupPrimary';
import Others from './UserChatDisplayScreens/GroupOthers';
import { StackActions, useFocusEffect, useNavigationState } from '@react-navigation/native';
import { BackHandler } from 'react-native';


const Tab = createMaterialTopTabNavigator();


export default function GroupChatView(props) {
    const parameters = props.route.params;             // To store a reference to the parameters passed
    const navigation = useNavigationState(state => state);

    console.log("printing the navigation state: ", navigation);

    // styling the header
    props.navigation.setOptions({
        title: props.route.params.GroupName,
        headerLeft :() =>{
            return (
                <HeaderBackButton onPress={() => props.navigation.navigate("Header", {screen: 'Groups'})}/>
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

    // The useFocus effect to naivgate back to the header screen
    useFocusEffect(() => {
        // The call back function handle the back button press
        function onBackPress() {
            props.navigation.navigate("Header", {
                screen: 'Groups'
            })
            return true;
        }
        // adding a event listener for the harware back button
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
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