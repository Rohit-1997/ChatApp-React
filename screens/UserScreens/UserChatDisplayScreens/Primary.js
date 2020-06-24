// This component is the chat view for the primary screen
import * as React from 'react';
import { Text, View, FlatList, StyleSheet, KeyboardAvoidingView, ActivityIndicator, Image } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import ChatInput from '../ChatInput';
import UpdateMessageRead from '../../../Helpers/UpdateMessageRead';
import DisplayImage from './DisplayImage';

export default function Primary(props) {
    const user = firebase.auth().currentUser;
    const [messages, setMessages] = React.useState([]);                       // The state to store the messages
    const [seen, setSeeen] = React.useState(false);                          // The state to store whether the message has been read or not
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [kh, setkh] = React.useState(0)
    // The use effect to fetch the messages
    React.useEffect(() => {
        if (props.currentUser) {
            let fetchMessages = firebase
                .firestore()
                .collection("Chats")
                .where('users', 'array-contains', props.currentUser)
                .onSnapshot((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        // console.log("The documents fetched: ", doc.data());
                        const docUsers = doc.data().users;
                        // console.log("The doc users", docUsers);
                        if (docUsers.includes(props.senderEmail) && docUsers.includes(props.currentUser)) {
                            const textMessages = doc.data().messages;
                            const hasSeen = doc.data().receiverHasRead;
                            textMessages.reverse();
                            setMessages(textMessages);
                            // console.log("The has seen on update in the snap shot: ", hasSeen);
                            setSeeen(hasSeen);
                            setTimeout(() => setDataLoaded(true), 1000);
                        }
                    })
                })

            return () => {
                fetchMessages()
            }
        }
    }, [])


    // This function builds the doc key for the
    // users involved in the chat
    function buildDocKey() {
        return [props.senderEmail, props.currentUser].sort().join(':');
    }


    // function to get the time with proper format
    function getTimeData() {
        const timeObj = new Date();
        const timeString = timeObj.toLocaleTimeString().split(":").splice(0, 2).join(":");
        const dateString = timeObj.toDateString().split(" ").splice(1, 4).join(" ");
        return [timeString, dateString].join(" ");
    }


    // The function to handle the on submit event
    function onSubmit(chatText) {
        // console.log("The text message users enterd: ", chatText);
        const docKey = buildDocKey();
        // console.log("The doc key generated: ", docKey);
        const timeStampDetails = getTimeData();
        const reciever = props.senderName;

        firebase.firestore().collection('Chats').doc(docKey).get().then((doc) => {
            if (doc.data()[reciever]['others'] === 0 && doc.data()[reciever]['primary'] === 0) {
                firebase.firestore().collection('Users').doc(props.senderEmail).update({
                    [`individual`]: firebase.firestore.FieldValue.increment(1)
                })
            }
        })
        // Updating the data base
        firebase
            .firestore()
            .collection('Chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: props.currentUser,
                    message: chatText,
                    timestamp: timeStampDetails,
                    type: 'Text'
                }),
                [`${reciever}.primary`]: firebase.firestore.FieldValue.increment(1),
                receiverHasRead: false,
                lastContacted: firebase.firestore.FieldValue.serverTimestamp()
            })
    }

    // The function to who has sent the last message
    function receiverHasSeen() {
        if (messages.length > 0) {
            if (messages[0].sender !== props.currentUser) {
                updateBadge()
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    // The function to update the user has read once the user clicks on the input
    function userClickedInput() {
        // console.log("Clicked input");
        const docKey = buildDocKey();
        if (receiverHasSeen()) {
            UpdateMessageRead(docKey, 'primary');
        }

    }

    function updateBadge() {
        const docKey = buildDocKey();
        const reciever = user.displayName;
        // Updating the data base
        firebase.firestore().collection('Chats').doc(docKey).update({
            [`${reciever}.primary`]: 0,
        })

        firebase.firestore().collection('Chats').doc(docKey).get().then((a) => {
            if (a.data()[reciever]['primary'] === 0) {
                firebase.firestore().collection('Users').doc(user.email).get().then((b) => {
                    if (b.data()[`individual`] !== 0) {
                        firebase.firestore().collection('Users').doc(user.email).update({
                            [`individual`]: firebase.firestore.FieldValue.increment(-1)
                        })
                    }
                })
            }
        })
    }
    // The test function to display seen
    function canDisplaySeen(index) {
        if (seen && index == 0) {
            return true;
        }
        else return false;
    }


    function handlingKeyboard(keyboardHeight) {
        // console.log(keyboardHeight)
        setkh(keyboardHeight)
        // inputheight = 0
    }
    return (
        <View style={styles.container}>
            {(!dataLoaded) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            ) : (
                    (messages.length > 0) ? (
                        <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginBottom: 60 + kh }}>
                                <FlatList
                                    inverted={true}
                                    data={messages}
                                    renderItem={({ item, index }) => {
                                        // console.log('Testing the index: ', index);
                                        if (item.sender != props.currentUser) {
                                            return (
                                                <React.Fragment>
                                                    {(item.type === 'Text') ? (
                                                        <View style={styles.friendMessage}>
                                                            <Text style={styles.messageText}>
                                                                {item.message}
                                                            </Text>
                                                            <Text style={{ alignSelf: 'flex-start', fontSize: 10 }}>{item.timestamp}</Text>
                                                        </View>
                                                    ) : (
                                                            <View style={{ alignSelf: 'flex-start', margin: 5, padding: 10 }}>
                                                                <DisplayImage imageuri={item.message} />
                                                                <Text style={{ alignSelf: 'flex-start', fontSize: 10 }}>{item.timestamp}</Text>
                                                            </View>
                                                        )}
                                                </React.Fragment>
                                            )
                                        } else {
                                            return (
                                                <React.Fragment>
                                                    {(item.type === 'Text') ? (
                                                        <View style={styles.userMessage}>
                                                            <Text style={styles.messageText}>
                                                                {item.message}
                                                            </Text>
                                                            <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{item.timestamp}</Text>
                                                            {canDisplaySeen(index) ? (<Text style={{ alignSelf: 'flex-end' }}>Seen</Text>) : (<View></View>)}
                                                        </View>
                                                    ) : (
                                                            <View style={{ alignSelf: 'flex-end', margin: 5, padding: 8, marginRight: 5 }}>
                                                                <DisplayImage imageuri={item.message} />
                                                                <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{item.timestamp}</Text>
                                                                {canDisplaySeen(index) ? (<Text style={{ alignSelf: 'flex-end' }}>Seen</Text>) : (<View></View>)}
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
                                <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} keyboardToggle={handlingKeyboard} senderName={props.senderName} parent={`primary`} docKey={props.docKey} />
                            </View>
                        </KeyboardAvoidingView>
                    ) : (
                            <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ position: 'absolute', bottom: 0 }}>
                                    <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} keyboardToggle={handlingKeyboard} senderName={props.senderName} parent={`primary`} docKey={props.docKey} />
                                </View>
                            </KeyboardAvoidingView>
                        )
                )}
        </View>



        // <View>
        //     {(!dataLoaded)? (
        //         <Text>Loading...</Text>
        //     ) : (
        //         <View style={styles.container}>
        //         (messages.length > 0) ? (
        //             <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
        //                 <View style={{ marginBottom: 60 }}>
        //                     <FlatList
        //                         inverted={true}
        //                         data={messages}
        //                         renderItem = {({item, index}) => {
        //                             // console.log('Testing the index: ', index);
        //                             if (item.sender != props.currentUser) {
        //                                 return (
        //                                     <View style={styles.friendMessage}>
        //                                     <Text style={styles.messageText}>
        //                                         {item.message}
        //                                     </Text>
        //                                     <Text style={{ alignSelf: 'flex-end', fontSize: 10}}>{item.timestamp}</Text>
        //                                     </View>
        //                                 )
        //                             } else {
        //                                 return (
        //                                     <View>
        //                                     <View style={styles.userMessage}>
        //                                     <Text style={styles.messageText}>
        //                                         {item.message}
        //                                     </Text>
        //                                     <Text style={{ alignSelf: 'flex-end', fontSize: 10}}>{item.timestamp}</Text>
        //                                     </View>
        //                                         {canDisplaySeen(index)? (<Text style={{ alignSelf: 'flex-end' }}>Seen</Text>) : (<View></View>)}
        //                                     </View>
        //                                 )
        //                             }
        //                         }}
        //                         keyExtractor={(item, index) => index.toString()}
        //                     />
        //                 </View>
        //                 <View style={{ position: 'absolute', bottom: 0}}>
        //                     <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput}/>
        //                 </View>
        //             </KeyboardAvoidingView>
        //         ) : (
        //             <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
        //                 <View style={{ position: 'absolute', bottom: 0 }}>
        //                     <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput} />
        //                 </View>
        //             </KeyboardAvoidingView>
        //         )
        //         </View>
        //     )}
        // </View>
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