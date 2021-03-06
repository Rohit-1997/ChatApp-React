import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Dimensions } from "react-native";
import firebase from 'firebase';
import 'firebase/firestore';
import ChatInput from '../ChatInput';
import DisplayImage from './DisplayImage';

export default function Others(props) {
    const [messages, setMessages] = React.useState([]);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const currentUser = firebase.auth().currentUser;
    const ID = props.docKey
    const [kh, setkh] = React.useState(0)
    // const [participantsEmailArray, setParticipantsEmailArray] = React.useState([]);
    // const [participantMap, setParticipantMap] = React.useState([]);
    const currentUserUnderScoreOthers = currentUser.email.split(".").join("_");

    useEffect(() => {
        let fetchMessages = firebase
            .firestore()
            .collection("GroupChat")
            .doc(ID)
            .onSnapshot((snapshot) => {
                const groupMessages = snapshot.data().othersMessages
                groupMessages.reverse();
                setMessages(groupMessages);
                setTimeout(() => setDataLoaded(true), 2000);
            })
        return () => {
            fetchMessages()
        }
    }, [])


    // React.useEffect(() => {
    //     if (participantsEmailArray.includes(currentUser.email)) {
    //         if (Object.keys(participantMap).length !== 0) {
    //             firebase
    //                 .firestore()
    //                 .collection('GroupChat')
    //                 .doc(ID)
    //                 .update({
    //                     participantsMap: participantMap
    //                 })
    //         }
    //     }
    // }, [participantMap])

    function userClickedInput() {
        const field = currentUser.email
        firebase
            .firestore()
            .collection('GroupBadge')
            .doc(ID)
            .update({
                [`${currentUserUnderScoreOthers}.others`]: 0
            })

        firebase
            .firestore()
            .collection('GroupBadge')
            .doc(ID)
            .get()
            .then((doc) => {
                const userBadgeDetails = doc.data()[`${currentUserUnderScoreOthers}`]
                updateBadge(userBadgeDetails)
            })
    }

    function updateBadge(userBadgeDetails) {
        if (userBadgeDetails.primary === 0
            && userBadgeDetails.activities === 0) {
            firebase.firestore().collection('Users').doc(currentUser.email).get().then((b) => {
                if (b.data()[`group`] !== 0) {
                    firebase.firestore().collection('Users').doc(currentUser.email).update({
                        [`group`]: firebase.firestore.FieldValue.increment(-1)
                    })
                }
            })
        }
    }

    function getTimeData() {
        const timeObj = new Date();
        const timeString = timeObj.toLocaleTimeString().split(":").splice(0, 2).join(":");
        const dateString = timeObj.toDateString().split(" ").splice(1, 4).join(" ");
        return [timeString, dateString].join(" ");
    }


    // The function to handle the on submit event
    function onSubmit(chatText) {
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
                    messageTimeStamp: timeStampDetails,
                    type: "Text"
                }),
                // participantsMap: participantMap,
                lastContacted: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                firebase
                    .firestore()
                    .collection('GroupBadge')
                    .doc(ID)
                    .get()
                    .then((doc) => {
                        const usersBadgeDetails = Object.keys(doc.data())
                        // updateBadge(userBadgeDetails)
                        for (let index = 0; index < usersBadgeDetails.length; index++) {
                            let underScoreTemp = usersBadgeDetails[index].split("_").join(".")
                            if (underScoreTemp !== currentUser.email) {
                                if (doc.data()[usersBadgeDetails[index]].primary === 0
                                    && doc.data()[usersBadgeDetails[index]].others === 0
                                    && doc.data()[usersBadgeDetails[index]].activities === 0) {
                                    firebase.firestore().collection('Users').doc(underScoreTemp).update({
                                        [`group`]: firebase.firestore.FieldValue.increment(1)
                                    })
                                }
                                firebase.firestore().collection('GroupBadge').doc(ID).update({
                                    [`${usersBadgeDetails[index]}.others`]: firebase.firestore.FieldValue.increment(1)
                                })

                            }

                        }
                    })
            })
    }

    function handlingKeyboard(keyboardHeight) {
        setkh(keyboardHeight)
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
                            <View style={{ flex: 1, marginBottom: 60 + kh }}>
                                <FlatList
                                    inverted={true}
                                    data={messages}
                                    renderItem={({ item, index }) => {
                                        if (item.sender != currentUser.email) {
                                            return (
                                                <React.Fragment>
                                                    {(item.type === 'Text') ? (
                                                        <View style={styles.friendMessage}>
                                                            <Text style={{ color: '#707070', fontSize: 11 }}>{item.senderUserName}</Text>
                                                            <Text style={styles.messageText}>
                                                                {item.message}
                                                            </Text>
                                                            <Text style={{ alignSelf: 'flex-start', fontSize: 10, paddingTop: Dimensions.get('window').height / 150 }}>{item.messageTimeStamp}</Text>
                                                        </View>
                                                    ) : (
                                                            <View style={{ alignSelf: 'flex-start', margin: 5, padding: 10 }}>
                                                                <Text style={{ color: '#707070', fontSize: 11 }}>{item.senderUserName}</Text>
                                                                <DisplayImage imageuri={item.message} />
                                                                <Text style={{ alignSelf: 'flex-start', fontSize: 10 }}>{item.senderUserName, item.timestamp}</Text>
                                                            </View>
                                                        )}
                                                </React.Fragment>
                                            )
                                        } else {
                                            return (
                                                <React.Fragment>
                                                    {(item.type === 'Text') ? (
                                                        <View>
                                                            <View style={styles.userMessage}>
                                                                <Text style={styles.messageText}>
                                                                    {item.message}
                                                                </Text>
                                                                <Text style={{ alignSelf: 'flex-end', fontSize: 10, paddingTop: Dimensions.get('window').height / 150 }}>{item.messageTimeStamp}</Text>
                                                            </View>
                                                        </View>
                                                    ) : (
                                                            <View style={{ alignSelf: 'flex-end', margin: 5, padding: 8, marginRight: 5 }}>
                                                                <DisplayImage imageuri={item.message} />
                                                                <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{item.timestamp}</Text>
                                                            </View>
                                                        )}
                                                </React.Fragment>
                                            )
                                        }
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            <View style={{ position: 'absolute', bottom: 0 }}>
                                <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} keyboardToggle={handlingKeyboard} docKey={props.docKey} senderName={props.groupName} parent={`groupOthers`} />
                            </View>
                        </KeyboardAvoidingView>
                    ) : (
                            <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ position: 'absolute', bottom: 0 }}>
                                    <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} keyboardToggle={handlingKeyboard} docKey={props.docKey} senderName={props.groupName} parent={`groupOthers`} />
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
