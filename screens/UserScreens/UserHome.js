// This component holds all the stack routes after the user logs in
import * as React from 'react';
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
import AddPeopleToGroup from './AddPeopleToGroup';
import GroupParticipants from './GroupParticipants';
import Polls from './pollscreens/Polls'
import PollCreation from './pollscreens/PollCreation';
import PollLists from './pollscreens/PollLists';
import PollItem from './pollscreens/PollItem';
import GroupSettings from './GroupScreens/GroupSetting';
import ProfileView from './UserChatDisplayScreens/ProfileView'

const Stack = createStackNavigator();
const stackOptions = {
    headerStyle: { backgroundColor: '#9477cb', },
    headerTintColor: '#fff',
}

export default function UserHome(props) {
    return (
        <MenuProvider backHandler={true}>
            <Stack.Navigator>
                <Stack.Screen name="Header" component={PageHeader} />
                <Stack.Screen name="Chat View" component={UserChatView} />
                <Stack.Screen name="Group Chat View" component={GroupChatView} />
                <Stack.Screen name="Images Share" component={Images} />
                <Stack.Screen name="Image Download" component={ImageDownload} />
                <Stack.Screen name="Search Tabs" options={stackOptions} component={SearchBar} />
                <Stack.Screen name="New Group Name" options={stackOptions} component={GroupNameAddScreen} />
                <Stack.Screen name="New Group" options={stackOptions} component={GroupCreation} />
                <Stack.Screen name="Add People" options={stackOptions} component={AddPeopleToGroup} />
                <Stack.Screen name="Group Participants" options={stackOptions} component={GroupParticipants} />
                <Stack.Screen name="POLL" options={stackOptions} component={Polls} />
                <Stack.Screen name="Poll Creation" options={stackOptions} component={PollCreation} />
                <Stack.Screen name="Poll List" options={stackOptions} component={PollLists} />
                <Stack.Screen name="Poll item" options={stackOptions} component={PollItem} />
                <Stack.Screen name="Group Settings" component={GroupSettings} />
                <Stack.Screen name="View Profile" options={{ ...stackOptions, headerTitle: 'Profile' }} component={ProfileView} />
            </Stack.Navigator>
        </MenuProvider>
    )
}