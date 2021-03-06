import * as React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import UpdateMessageRead from '../../../Helpers/UpdateMessageRead';
import firebase from 'firebase';
import 'firebase/firestore';

// The chat component
function Chat(props) {
    const [displayItem, setDisplayItem] = React.useState(null);
    const [dataLoaded, setDataLoaded] = React.useState(null);
    const user = firebase.auth().currentUser;
    let newMessagePrimary = props.chat[user.displayName]['primary']
    let newMessageOthers = props.chat[user.displayName]['others']

    // The use effect to fetcth the sender details
    React.useEffect(() => {
        if (props.currentUser) {
            const senderMail = props.chat.users.filter((user) => user !== props.currentUser)[0];

            // Fetching the details of the sender
            let fetchSenderDetails = firebase
                .firestore()
                .collection('Users')
                .where('email', '==', senderMail)
                .onSnapshot((snapShot) => {
                    const detailsObject = snapShot.docs.map((doc) => {
                        let data = doc.data();
                        data["messages"] = props.chat.messages;
                        return data;
                    })
                    setDisplayItem(detailsObject);
                    setDataLoaded(true);
                })
            return () => {
                fetchSenderDetails();
            }
        }

    }, [props.currentUser, props.chat.messages])


    // This function tells us whether the receiver has clicked the last message or not
    function receiverHasSeen() {
        if (props.chat.messages[props.chat.messages.length - 1].sender !== props.currentUser)
            return true;
        else return false;
    }


    // The fucntion to handle the selected chat
    function handleSelectedChat(name, profilePicture) {
        const senderMail = props.chat.users.filter((user) => user !== props.currentUser)[0];

        // Updating the read message
        if (receiverHasSeen()) {
            const docKey = props.docKey;
            UpdateMessageRead(docKey, 'primary');
            // const reciever = user.displayName;
        }

        props.navigation.navigate("Chat View", {
            senderName: name,
            senderEmail: senderMail,
            senderPicture: profilePicture,
            currentUser: props.currentUser,
            docKey: props.docKey
        });
    }

    if (newMessageOthers + newMessagePrimary > 0) {
        return (
            <View>
                {displayItem ? (
                    <View>
                        <TouchableOpacity onPress={() => (handleSelectedChat(displayItem[0].name, displayItem[0].profilePic))}>
                            <ListItem
                                key={displayItem[0].email}
                                leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                                title={displayItem[0].name}
                                subtitle={displayItem[0].messages[displayItem[0].messages.length - 1].message.substring(0, 20)}
                                rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> {newMessagePrimary + newMessageOthers} </Text>}
                                bottomDivider
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View>
                        </View>
                    )}
            </View>
        )
    }
    else {
        return (
            <View>
                {displayItem ? (
                    <View>
                        <TouchableOpacity onPress={() => (handleSelectedChat(displayItem[0].name, displayItem[0].profilePic))}>
                            <ListItem
                                key={displayItem[0].email}
                                leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                                title={displayItem[0].name}
                                subtitle={displayItem[0].messages[displayItem[0].messages.length - 1].message.substring(0, 20)}
                                bottomDivider
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View>
                        </View>
                    )}
            </View>
        )
    }
}


export default function IndividualChatList(props) {
    const [currentUser, setCurrentUser] = React.useState(null);

    React.useEffect(() => {
        setCurrentUser(props.userEmail);
    }, [props.userEmail, props.chats])

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={props.chats}
                renderItem={({ item }) => <Chat chat={item.data} currentUser={currentUser} navigation={props.navigation} docKey={item.ID} />}
                keyExtractor={(item) => item.data.users.join()}
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