import * as React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import 'firebase/firestore';

function Chat(props) {
    const currentUser = firebase.auth().currentUser;
    let newMessagePrimary = props.chat['participantsMap'][currentUser.email]['groupPrimary']
    let newMessageOthers = props.chat['participantsMap'][currentUser.email]['groupOthers']
    let newMessageActivities = props.chat['participantsMap'][currentUser.email]['activities']

    // The fucntion to handle the selected chat
    function handleSelectedChat(name) {
        props.navigation.navigate("Group Chat View", {
            GroupName: name,
            docKey: props.docKey
        });
    }

    if (newMessagePrimary + newMessageOthers + newMessageActivities > 0) {
        return (
            <View>
                <ListItem
                    leftAvatar={{ source: { uri: props.chat.groupProfilePicture } }}
                    title={props.chat.updatedGroupName}
                    subtitle={(props.chat.messages.length > 0) ? (props.chat.messages[props.chat.messages.length - 1].message.substring(0, 20)
                    ) : ("")}
                    rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> {newMessagePrimary + newMessageOthers + newMessageActivities} </Text>}
                    onPress={() => (handleSelectedChat(props.chat.updatedGroupName))}
                    bottomDivider
                />
            </View>
        )
    } else {
        return (
            <View>
                <ListItem
                    leftAvatar={{ source: { uri: props.chat.groupProfilePicture } }}
                    title={props.chat.updatedGroupName}
                    subtitle={(props.chat.messages.length > 0) ? (props.chat.messages[props.chat.messages.length - 1].message.substring(0, 20)
                    ) : ("")}
                    // rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> {newMessagePrimary + newMessageOthers + newMessageActivities} </Text>}
                    onPress={() => (handleSelectedChat(props.chat.updatedGroupName))}
                    bottomDivider
                />
            </View>
        )
    }
}


export default function GroupChatList(props) {
    console.log("Testing the props in chat list groups: ", props.chats)
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={props.chats}
                renderItem={({ item }) => {
                    return (<Chat chat={item.data} navigation={props.navigation} docKey={item.id} />)
                }}
                keyExtractor={(item) => item.id}
            />
            <TouchableOpacity onPress={() => props.navigation.navigate('New Group')} style={styles.fab}>
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