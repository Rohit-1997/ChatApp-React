import * as React from 'react';
import {View, Text, StyleSheet, FlatList,  TextInput, ScrollView} from 'react-native';
import { Thumbnail, Icon, Row } from 'native-base';
import ChatInput from './ChatInput';
import firebase from 'firebase';
import 'firebase/firestore';


export default function ChatView(props) {
    const params = props.route.params;
    const user = props.route.params.userEmail;
    const [messages, setMessages] = React.useState([]);

    console.log("The sender name", params.senderName);
    // Styling the header
    props.navigation.setOptions({
        headerLeft: () => {
            return (
                <View style={{ paddingLeft: 10, paddingRight: 5 }}>
                <Thumbnail small source={{ uri: params.senderProfilePic }}/>
                </View>
            );
        },
        title: params.senderName,
    })


    React.useEffect(() => {
        if (user) {
            // We make a firebase call to grab all the users chats
            firebase
            .firestore()
            .collection('Chats')
            .where('users', 'array-contains', user)
            .onSnapshot((result) => {
                // console.log("Inside the snapshot function", result);
                // console.log("The snapshot of the chat view")
                const userChats = result.docs.map((doc) => doc.data());
                console.log("The data format in use Effect chat view",userChats[0].messages);
                setMessages(userChats[0].messages);
            })
        }
    }, [])


    // The function to render chat text
    function displayItem(message) {
        console.log(message);
        if (message.sender != user) {
            return (
                <Text style={styles.friendMessage} key={index}>
                    {message.message}
                </Text>
            )
        } else {
            return (
                <Text style={styles.userMessage} key={index}>
                    {message.message}
                </Text>
            )
        }
    }


    // The function to handle send chat option
    function onSubmit(message) {
        console.log("The messages in the text box", message);
        const docKey = "kalorirohit@msitprogram.net:rohitrocky67@gmail.com";
        // updating the database
        firebase
            .firestore()
            .collection('Chats')
            .doc(docKey)
            .update({
               messages: firebase.firestore.FieldValue.arrayUnion({
                   sender: user,
                   message: message
               }),
               receiverHasRead: false
            })
    }

    return (
        <View style={styles.container}>
        {/* {console.log("The chatView called", messages)} */}
        {console.log("The messages logged from chat view", messages)}
        <ScrollView>
            {messages? (<View style={{ marginBottom: 20 }}>
            {
                messages.map((message, index) => {
                    if (message.sender != user) {
                        return (
                            <Text style={styles.friendMessage} key={index}>
                                {message.message}
                            </Text>
                        )
                    } else {
                        return (
                            <Text style={styles.userMessage} key={index}>
                                {message.message}
                            </Text>
                        )
                    }
                })
            }
            </View>) : (<Text></Text>)}     
        </ScrollView>
        <ChatInput onSubmit={onSubmit}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
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