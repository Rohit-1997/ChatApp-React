import * as React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import UpdateMessageRead from '../../../Helpers/UpdateMessageRead';
import Loading from '../../Loading';
import firebase from 'firebase';
import 'firebase/firestore';

function Chat(props) {

    // The fucntion to handle the selected chat
    function handleSelectedChat(name) {
        // const senderMail = props.chat.users.filter((user) => user !== props.currentUser)[0];

        // Updating the read message
        // if (receiverHasSeen()) {
        //     const docKey = [senderMail, props.currentUser].sort().join(':');
        //     UpdateMessageRead(docKey);
        // }

        // props.navigation.navigate("Chat View", {
        //     senderName: name,
        //     senderEmail: senderMail,
        //     senderPicture: profilePicture,
        //     currentUser: props.currentUser,
        // });
    }

    return (
        <View>
            {/* {console.log("after the set sate in chat", displayItem[0])} */}
            <ListItem
                // key={displayItem[0].email}
                // leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                title={props.chat.updatedGroupName}
                subtitle={props.chat.messages[props.chat.messages.length - 1].message.substring(0, 20)}
                // onPress={() => (handleSelectedChat(displayItem[0].name, displayItem[0].profilePic))}
                bottomDivider
            />
        </View>
        // <View>
        //     {console.log("checking = ", props.chat)}
        // </View>
    )
}

export default function GroupChatList(props) {
    return (
        <View style={{ flex: 1 }}>
            {/* {console.log(props.chats[0].data.messages[0].message)} */}
            <FlatList
                data={props.chats}
                renderItem={({ item }) => {
                    console.log("Item Information = ", item.data.messages)
                    return (<Chat chat={item.data} />)
                }}
                keyExtractor={(item) => item.id}
            />
            <TouchableOpacity onPress={() => props.navigation.navigate('Search Tabs')} style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 50,
        backgroundColor: '#9477cb',
        borderRadius: 30,
        elevation: 8
    },

    fabIcon: {
        fontSize: 25,
        color: 'white'
    }
})