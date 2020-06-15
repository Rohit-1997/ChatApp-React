// This component is the chat view for the primary screen
import * as React from 'react';
import { Text, View, FlatList, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import ChatInput from '../ChatInput';
import UpdateMessageRead from '../../../Helpers/UpdateMessageRead';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

// The loading component
function Loading() {
    return (
        <View>
            {console.log("The loading componenet is rendering")}
            <ActivityIndicator size="large"/>
            <Text>Loading...</Text>
        </View>
    )
}


export default function Primary(props) {
    const [messages, setMessages] = React.useState([]);                       // The state to store the messages
    const [seen, setSeeen] = React.useState(false);                          // The state to store whether the message has been read or not
    const [dataLoaded, setDataLoaded] = React.useState(false);

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
                                        console.log("The has seen on update in the snap shot: ", hasSeen);
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
        const timeString = timeObj.toLocaleTimeString().split(":").splice(0,2).join(":");
        const dateString = timeObj.toDateString().split(" ").splice(1,4).join(" ");
        // console.log(dateString);
        // console.log("The time value,", timeString);
        return [timeString, dateString].join(" ");
    }


    // The function to handle the on submit event
    function onSubmit(chatText) {
        // console.log("The text message users enterd: ", chatText);
        const docKey = buildDocKey();
        // console.log("The doc key generated: ", docKey);
        const timeStampDetails = getTimeData();

        // Updating the data base
        firebase
            .firestore()
            .collection('Chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: props.currentUser,
                    message: chatText,
                    timestamp: timeStampDetails
                }),
                receiverHasRead: false,
                lastContacted: firebase.firestore.FieldValue.serverTimestamp()
            })
    }


    // The function to who has sent the last message
    function receiverHasSeen() {
        if (messages.length > 0) {
            if (messages[0].sender !== props.currentUser) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    // The function to update the user has read once the user clicks on the input
    function userClickedInput() {
        console.log("Clicked input");
        const docKey = buildDocKey();
        if (receiverHasSeen()) UpdateMessageRead(docKey, 'primary');
    }


    // The test function to display seen
    function canDisplaySeen(index) {
        if (seen && index == 0) {
            return true;
        }
        else return false;
    }

    return (
        <View style={styles.container}>
        {(!dataLoaded)? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
            </View>
        ) : (
            (messages.length > 0) ? (
                <KeyboardAvoidingView behaviour='padding' style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ marginBottom: 60 }}>
                            <FlatList
                                inverted={true}
                                data={messages}
                                renderItem = {({item, index}) => {
                                    // console.log('Testing the index: ', index);
                                    if (item.sender != props.currentUser) {
                                        return (
                                            <View style={styles.friendMessage}>
                                            <Text style={styles.messageText}>
                                                {item.message}
                                            </Text>
                                            <Text style={{ alignSelf: 'flex-end', fontSize: 10}}>{item.timestamp}</Text>
                                            </View>
                                        )
                                    } else {
                                        return (
                                            <View>
                                            <View style={styles.userMessage}>
                                            <Text style={styles.messageText}>
                                                {item.message}
                                            </Text>
                                            <Text style={{ alignSelf: 'flex-end', fontSize: 10}}>{item.timestamp}</Text>
                                            </View>
                                                {canDisplaySeen(index)? (<Text style={{ alignSelf: 'flex-end' }}>Seen</Text>) : (<View></View>)}
                                            </View>
                                        )
                                    }
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={{ position: 'absolute', bottom: 0}}>
                            <ChatInput onSubmit={onSubmit} userClickedInput={userClickedInput}/>
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