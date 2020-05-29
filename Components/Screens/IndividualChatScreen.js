import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PrimaryTabScreen from '../ChatScreens/Primary';
import OthersTabScreen from '../ChatScreens/Others';
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
            <Tab.Screen name="Primary" component={PrimaryTabScreen} />
            <Tab.Screen name="Others" component={OthersTabScreen} />
        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({

    tabs: {
        paddingTop: getStatusBarHeight() + 10,
        backgroundColor: '#9477cb'
        // backgroundColor: 'powderblue'
    },
});