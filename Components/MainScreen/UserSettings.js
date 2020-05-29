import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

function Feed({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Feed Screen</Text>
            <Button
                title="Open drawer"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
        </View>
    );
}

function Notifications() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Notifications Screen</Text>
        </View>
    );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator >
            <Drawer.Screen name="Feed" component={Feed} />
            <Drawer.Screen name="Notifications" component={Notifications} />
        </Drawer.Navigator>
    );
}

export default function UserSettings() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    );
}
