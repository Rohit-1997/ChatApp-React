// This component holds all the stack routes after the user logs in
import * as React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import PageHeader from './PageHeader';
import UserChatView from './UserChatView';
import SearchBar from './SearchScreen/SearchScreen';
import GroupNameAddScreen from './GroupScreens/GroupNameAddScreen';
import Groups from './UserTabScreens/Groups';
import GroupChatView from './GroupChatView';
import GroupCreation from './GroupCreation';
import { MenuProvider } from 'react-native-popup-menu';
import AddPeopleToGroup from './AddPeopleToGroup';
import GroupParticipants from './GroupParticipants';
const Stack = createStackNavigator();


export default function UserHome(props) {
    // console.log("The props in userHome", props);
    return (
        <MenuProvider>
            <Stack.Navigator>
                <Stack.Screen name="Header" component={PageHeader} />
                <Stack.Screen name="Chat View" component={UserChatView} />
                <Stack.Screen name="Search Tabs" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                    // headerTitleStyle: {
                    //     fontWeight: 'bold',
                    // },
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
                <Stack.Screen name="Add People" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                }} component={AddPeopleToGroup} />
                <Stack.Screen name="Group Participants" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                }} component={GroupParticipants} />
            </Stack.Navigator>
        </MenuProvider>
    )
}