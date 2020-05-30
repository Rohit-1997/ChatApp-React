import * as React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Individual from './UserTabScreens/Individual';
import Groups from './UserTabScreens/Groups';

const Tab = createMaterialTopTabNavigator();
console.log("The test printing the tab navigator", Tab);

export default function PageHeader(props) {
    // Styling the headers
    props.navigation.setOptions({
        title: "MSIT Connect",
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#9477cb'
        },
        headerLeft: () => (
            <Icon
                name="three-bars"
                style={{ paddingLeft: 15 }}
                size={35}
                color='#FFFFFF'
                onPress={() => props.navigation.openDrawer()}
            />
        ),

        headerRight: () => (
            <Icon
                style={{ paddingRight: 15 }}
                name='search'
                size={25}
                color='#FFFFFF'
                onPress={() => props.navigation.openDrawer()}
            />
        ),
    })

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'white',
                labelStyle: { fontSize: 17 },
                style: styles.tabs
            }}>
            <Tab.Screen name="Individual" component={Individual} />
            <Tab.Screen name="Groups" component={Groups} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({

    tabs: {
        backgroundColor: '#9477cb'
    },
});