// This component is the chat view for the primary screen
import * as React from 'react';
import { Text, View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import ChatInput from '../ChatInput';


// The message component
function Message(props) {
    if (props.message.sender != props.currentUser) {
        return (
            <Text style={styles.friendMessage}>
                {props.message.message}
            </Text>
        )
    } else {
        return (
            <Text style={styles.userMessage}>
                {props.message.message}
            </Text>
        )
    }
}


export default function Primary(props) {
    const [messages, setMessages] = React.useState([]);                 // The state to store the messages

    // The use effect to fetch the messages
    React.useEffect(() => {
        if (props.currentUser) {
            firebase
                .firestore()
                .collection("Chats")
                .where('users', 'array-contains', props.currentUser)
                .onSnapshot((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        console.log("The documents fetched: ", doc.data());
                        const docUsers = doc.data().users;
                        console.log("The doc users", docUsers);
                        if (docUsers.includes(props.senderEmail) && docUsers.includes(props.currentUser)) {
                            const textMessages = doc.data().messages;
                            setMessages(textMessages);
                        }
                    })
                })
        }

    }, [])


    // This function builds the doc key for the
    // users involved in the chat
    function buildDocKey() {
        return [props.senderEmail, props.currentUser].sort().join(':');
    }


    // The function to handle the on submit event
    function onSubmit(chatText) {
        console.log("The text message users enterd: ", chatText);
        const docKey = buildDocKey();
        console.log("The doc key generated: ", docKey);

        // Updating the data base
        firebase
            .firestore()
            .collection('Chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: props.currentUser,
                    message: chatText,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            })
    }

    return (
        <View style={styles.container}>
            {messages.length > 0 ? (
                <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                    <View>
                        <FlatList 
                            data={messages}
                            renderItem = {({ item }) => <Message message={item} sender={props.senderName} currentUser={props.currentUser}/>}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: 60 }}
                        />
                    </View>
                    <View style={{ position: 'absolute', bottom: 0}}>
                        <ChatInput onSubmit={onSubmit}/>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <View></View>
            ) }
        </View>
    )
}


// The stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
        backgroundColor: '#fff'
    },
    friendMessage: {
        alignSelf: "flex-start",     
        padding: 10,
        backgroundColor: "#b6d085",
        fontSize: 18,
        borderRadius: 10,
        margin: 8,
        width: 'auto'
    },
    userMessage: {
        alignSelf: "flex-end",
        padding: 10,
        backgroundColor: "#CCbee6",
        fontSize: 18,
        borderRadius: 10,
        margin: 8,
        width: 'auto'
    }
})