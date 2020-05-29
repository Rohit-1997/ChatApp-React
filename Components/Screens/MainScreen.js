import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IndividualScreen from '../MainScreen/Individual';
import GroupsScreen from '../MainScreen/Groups';
import ToDOScreen from '../MainScreen/ToDo';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const Tab = createMaterialTopTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'white',
                labelStyle: { fontSize: 17 },
                style: styles.tabs
            }}>
            <Tab.Screen name="Individual" component={IndividualScreen} />
            <Tab.Screen name="Groups" component={GroupsScreen} />
            <Tab.Screen name="ToDO" component={ToDOScreen} />
        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({

    tabs: {
        // paddingTop: getStatusBarHeight() + 10,
        backgroundColor: '#9477cb',
        // backgroundColor: 'powderblue'
    },
});