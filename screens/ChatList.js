import * as React from 'react';
import {View} from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import ChatView from './ChatView'
import firebase, { firestore } from 'firebase';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ChatList(props) {
    const [displayChats, setDisplayChats] = React.useState([]);            // To store all the senders details
    const [dataLoaded, setDataLoaded] = React.useState(null);
    const navigation = useNavigation();
    const abortController = new AbortController();

    React.useEffect(() => {
        console.log("In the chatList effect");
        // if (props.chats.length === 0) return;
        if (props.userEmail === null) return;
        let sendersList = [];
        props.chats.forEach((chat) => {
            console.log("Inside loop");
            console.log("The passed user mail", props.userEmail);
            const senderMail = chat.users.filter((user) => user !== props.userEmail)[0];
            // querying the database for this user
            let sendersList = [];
            firebase.firestore().collection('Users')
                .where('email', '==', senderMail)
                .onSnapshot((snapshot) => {
                    snapshot.docs.map(doc => {
                        let userObj = doc.data()
                        userObj["messages"] = chat.messages;
                        setDataLoaded(true);
                        sendersList.push(userObj);
                    })
                    setDisplayChats(sendersList);
                })
        })
        return function cleanup() {
            abortController.abort();
        }
    }, [props.userEmail, props.chats])


    // The function to handle selected chat
    function handleSelectedChat(senderName, senderProfile) {
        console.log("The sender name in list", senderName);
        navigation.navigate('ChatView', {
            userEmail: props.userEmail,
            senderName: senderName,
            senderProfilePic: senderProfile 
        })
    }


    return (
        <View>
        {console.log("render called")}
        {console.log("The dataloaded", dataLoaded)}
        {console.log("The list of users", displayChats)}
        {displayChats.map((chat,index) => {
                return (
                    <ListItem 
                        key={index}
                        leftAvatar={{ source: {uri: chat.profilePic} }}
                        title={chat.name}
                        subtitle={chat.messages[chat.messages.length - 1].message.substring(0,20)}
                        onPress={() => (handleSelectedChat(chat.name, chat.profilePic))}
                        bottomDivider
                    />
                )
            })}
        </View>
    );
}