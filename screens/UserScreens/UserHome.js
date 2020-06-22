// This component holds all the stack routes after the user logs in
import * as React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import PageHeader from './PageHeader';
import UserChatView from './UserChatView';
import SearchBar from './SearchScreen/SearchScreen';
import GroupNameAddScreen from './GroupScreens/GroupNameAddScreen';
import GroupChatView from './GroupChatView';
import GroupCreation from './GroupCreation';
import { MenuProvider } from 'react-native-popup-menu';
import Images from './MenuScreens/Images';
import ImageDownload from './MenuScreens/ImageDownload';


const Stack = createStackNavigator();

export default function UserHome(props) {
    return (
        <MenuProvider backHandler={true}>
        <Stack.Navigator>
            <Stack.Screen name="Header" component={PageHeader} />
            <Stack.Screen name="Chat View" component={UserChatView} />
            <Stack.Screen name="Search Tabs" options={{
                headerStyle: {
                    backgroundColor: '#9477cb',
                },
                headerTintColor: '#fff',
            }} component={SearchBar} />

            <Stack.Screen name="Group Chat View" component={GroupChatView} />
            <Stack.Screen name="New Group Name" options={{
                headerStyle: {
                    backgroundColor: '#9477cb',
                },
                headerTintColor: '#fff',
            }} component={GroupNameAddScreen} />
            <Stack.Screen name="New Group" options={{
                headerStyle: {
                    backgroundColor: '#9477cb',
                },
                headerTintColor: '#fff',
            }} component={GroupCreation} />
            <Stack.Screen name="Images Share" component={Images}/>
            <Stack.Screen name="Image Download" component={ImageDownload} />
        </Stack.Navigator>
        </MenuProvider>
    )
}