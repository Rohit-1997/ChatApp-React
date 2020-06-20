import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Dimensions
} from "react-native";
import firebase from 'firebase';
import 'firebase/firestore';
import ChatInput from '../ChatInput';


export default function Others(props) {
    // console.log('primary props',props)
    const [messages, setMessages] = React.useState([]);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const currentUser = firebase.auth().currentUser;
    const ID = props.docKey
    // console.log('printing ID',ID)

    useEffect(() => {
        let fetchMessages = firebase
            .firestore()
            .collection("GroupChat")
            .onSnapshot((snapshot) => {
                for (let i = 0; i < snapshot.docs.length; i++) {
                    // console.log(snapshot.docs[i])
                    if (props.docKey === snapshot.docs[i].id) {
                        const groupMessages = snapshot.docs[i].data().othersMessages
                        groupMessages.reverse();
                        setMessages(groupMessages);
                        setTimeout(() => setDataLoaded(true), 2000);
                        break;
                    }
                }
            })
        return () => {
            fetchMessages()
        }
    }, [])

    function userClickedInput() {
        console.log("Clicked input")
    }

    function getTimeData() {
        const timeObj = new Date();
        const timeString = timeObj.toLocaleTimeString().split(":").splice(0, 2).join(":");
        const dateString = timeObj.toDateString().split(" ").splice(1, 4).join(" ");
        return [timeString, dateString].join(" ");
    }


    // The function to handle the on submit event
    function onSubmit(chatText) {
        // console.log("The text message users enterd: ", chatText);
        const timeStampDetails = getTimeData();

        // Updating the data base
        firebase
            .firestore()
            .collection('GroupChat')
            .doc(ID)
            .update({
                othersMessages: firebase.firestore.FieldValue.arrayUnion({
                    sender: currentUser.email,
                    message: chatText,
                    senderUserName: currentUser.displayName,
                    messageTimeStamp: timeStampDetails

                }),
                lastContacted: firebase.firestore.FieldValue.serverTimestamp()
            })
    }

    return (
        <React.Fragment>
            {(!dataLoaded) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading....</Text>
                </View>
            ) : (
                    (messages.length > 0) ? (
                        <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1, marginBottom: 60 }}>
                                <FlatList
                                    inverted={true}
                                    data={messages}
                                    renderItem={({ item, index }) => {
                                        if (item.sender != currentUser.email) {
                                            return (
                                                <View style={styles.friendMessage}>
                                                    <Text style={{ color: '#707070', fontSize: 11 }}>{item.senderUserName}</Text>
                                                    <Text style={styles.messageText}>
                                                        {item.message}
                                                    </Text>
                                                    <Text style={{ alignSelf: 'flex-end', fontSize: 10, paddingTop: Dimensions.get('window').height / 150 }}>{item.messageTimeStamp}</Text>
                                                </View>
                                            )
                                        } else {
                                            return (
                                                <View>
                                                    <View style={styles.userMessage}>
                                                        <Text style={styles.messageText}>
                                                            {item.message}
                                                        </Text>
                                                        <Text style={{ alignSelf: 'flex-end', fontSize: 10, paddingTop: Dimensions.get('window').height / 150 }}>{item.messageTimeStamp}</Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            <View style={{ position: 'absolute', bottom: 0 }}>
                                <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} />
                            </View>
                        </KeyboardAvoidingView>
                    ) : (
                            <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ position: 'absolute', bottom: 0 }}>
                                    <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} />
                                </View>
                            </KeyboardAvoidingView>
                        )
                )}
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
        backgroundColor: '#fff'
    },
    friendMessage: {
        alignSelf: "flex-start",
        padding: 10,
        backgroundColor: "#e4e8e5",
        borderRadius: 10,
        margin: 8,
        width: 'auto',
    },
    userMessage: {
        alignSelf: "flex-end",
        padding: 10,
        backgroundColor: "#CCbee6",
        borderRadius: 10,
        margin: 8,
        width: 'auto',
    },
    messageText: {
        fontSize: 15,
        alignSelf: 'flex-start'
    }
})