import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PeopleSearchTabScreen from './People'
import MessagesSearchTabScreen from './Messages';
import FilesSearchTabScreen from './Files';

const Tab = createMaterialTopTabNavigator();

export default function SearchBar() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'white',
                labelStyle: { fontSize: 17 },
                style: styles.tabs,
                indicatorStyle: {
                    bottom: 0,
                    backgroundColor: 'white',
                    borderRadius: 10
                },
            }}>
            <Tab.Screen name="People" component={PeopleSearchTabScreen} />
            <Tab.Screen name="Messages" component={MessagesSearchTabScreen} />
            <Tab.Screen name="Files" component={FilesSearchTabScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabs: {
        backgroundColor: '#9477cb',
    }
});