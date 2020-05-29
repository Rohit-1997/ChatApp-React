import * as React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Individual from './UserTabScreens/Individual';
import Groups from './UserTabScreens/Groups';

const Tab = createMaterialTopTabNavigator();
console.log("The test printing the tab navigator", Tab);

export default function PageHeader(props) {
    // Styling the headers
    props.navigation.setOptions({
        title: "Msit Connect",
        headerLeft: () => (
            <Icon 
                name="three-bars" 
                style={{ paddingLeft: 15 }}
                size={35}
                color='#000'
                onPress={() => props.navigation.openDrawer()}
            />
        )
    })

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#000',
                labelStyle: {fontSize: 17}
            }}>
            <Tab.Screen name="Individual" component={Individual}/>
            <Tab.Screen name="Groups" component={Groups} />
        </Tab.Navigator>
    )
}