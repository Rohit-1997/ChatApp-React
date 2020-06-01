import * as React from 'react';
import {Text, View, FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Thumbnail} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import 'firebase/firestore';

// The chat component
function Chat(props) {
    const [displayItem, setDisplayItem] = React.useState(null);

    // The use effect to fetcth the sender details
    React.useEffect(() => {
        if (props.currentUser) {
            const senderMail = props.chat.users.filter((user) => user !== props.currentUser)[0];
            console.log("The sender mail for the chat: ", senderMail);

            // Fetching the details of the sender
            firebase
                .firestore()
                .collection('Users')
                .where('email', '==', senderMail)
                .onSnapshot((snapShot) => {
                    const detailsObject = snapShot.docs.map((doc) => {
                        let data = doc.data();
                        data["messages"] = props.chat.messages;
                        console.log("The temporaray data in docs loop set", data);
                        return data;
                    })
                    setDisplayItem(detailsObject);
                })

        }
    }, [props.currentUser, props.chat.messages])


    // The fucntion to handle the selected chat
    function handleSelectedChat(name, profilePicture) {
        const senderMail = props.chat.users.filter((user) => user !== props.currentUser)[0];
        props.navigation.navigate("Chat View", {
            senderName: name,
            senderEmail: senderMail,
            senderPicture: profilePicture,
            currentUser: props.currentUser,
        });
    }
    
    return (
        <View>
        {displayItem? (
            <View>
                {console.log("after the set sate in chat", displayItem[0])}
            <ListItem 
                key={displayItem[0].email}
                leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                title={displayItem[0].name}
                subtitle={displayItem[0].messages[displayItem[0].messages.length - 1].message.substring(0,20)}
                onPress={() => (handleSelectedChat(displayItem[0].name, displayItem[0].profilePic))}
                bottomDivider
            />
            </View>
        ) : (
            <View>
            </View>
        )}
        </View>
    )
}


export default function IndividualChatList (props) {
    const [currentUser, setCurrentUser] = React.useState(null);

    React.useEffect(() => {
        console.log("The effect in user mail", props.userEmail);
        setCurrentUser(props.userEmail);
    }, [props.userEmail, props.chats])


    
    console.log("Testing the state of user ", currentUser);
    console.log("Testing the length of the chat list: ", props.chats.length);
    return (
        <View>
            <FlatList 
                data={props.chats}
                renderItem={({ item }) => <Chat chat={item} currentUser={currentUser} navigation={props.navigation}/>}
                keyExtractor={(item) => item.users.join()}
            />
        </View>
    )
}