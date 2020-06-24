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
import Images from './MenuScreens/Images';
import ImageDownload from './MenuScreens/ImageDownload';
import AddPeopleToGroup from './AddPeopleToGroup';
import GroupParticipants from './GroupParticipants';
import Polls from './pollscreens/Polls'
import PollCreation from './pollscreens/PollCreation';
import PollLists from './pollscreens/PollLists';
import PollItem from './pollscreens/PollItem';
import GroupSettings from './GroupScreens/GroupSetting';
import ProfileView from './UserChatDisplayScreens/ProfileView'

const Stack = createStackNavigator();


export default function UserHome(props) {
    // console.log("The props in userHome", props);
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
                <Stack.Screen name="Images Share" component={Images} />
                <Stack.Screen name="Image Download" component={ImageDownload} />
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
                <Stack.Screen name="POLL" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                }} component={Polls} />
                <Stack.Screen name="Poll Creation" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                }} component={PollCreation} />
                <Stack.Screen name="Poll List" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                }} component={PollLists} />
                <Stack.Screen name="Poll item" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTintColor: '#fff',
                }} component={PollItem} />
                <Stack.Screen name="Group Settings" component={GroupSettings} />
                <Stack.Screen name="View Profile" options={{
                    headerStyle: {
                        backgroundColor: '#9477cb',
                    },
                    headerTitle: 'Profile',
                    headerTintColor: '#fff',
                }} component={ProfileView} />
            </Stack.Navigator>
        </MenuProvider>
    )
}