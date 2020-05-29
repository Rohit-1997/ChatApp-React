import * as React from 'react';
import {View, StyleSheet, Text, Button, Modal, ActivityIndicator} from 'react-native';
import {Icon} from 'native-base'
import firebase from 'firebase';
import 'firebase/firestore';
import ChatList from './ChatList';



export default function Dashboard(props) {
    const abortController = new AbortController();
    const [newChatForm, setNewChatForm] = React.useState(false);        // To handle the new chat from visable or not
    const [email, setEmail] = React.useState(null);                     // To store the email of currently logged in user
    const [chats, setChats] = React.useState([]);                       // To store the chats of the user
    const user = firebase.auth().currentUser;                           // The current user

    // Styling the header
    props.navigation.setOptions({
        headerLeft: null,
        title: 'MSIT Connect',
        headerRight: () => {
            return (
            <View style={{ flexDirection: 'row', padding: 10}}>
                <Icon name="md-search" style={{ marginRight: 30 }}/>
                <Icon name="md-more" style={{ marginRight: 10 }}/>
            </View>
        );
        }, 
        headerTitleStyle: {marginRight: 'auto'}
    })


    // The UseEffect for to fetch the chat data
    React.useEffect(() => {
        console.log("Inside effect");
        if (user) {
            // We make a firebase call to grab all the users chats
            firebase
            .firestore()
            .collection('Chats')
            .where('users', 'array-contains', user.email)
            .onSnapshot((result) => {
                // console.log("Inside the snapshot function", result);
                console.log("The snap shot words")
                const userChats = result.docs.map((doc) => doc.data());
                console.log("The user chats aftersnapshots",userChats);
                setChats(userChats);
                setEmail(user.email);
            })
        }
        return function cleanup() {
            abortController.abort();
        }
    }, [])


    // The new chat button handler
    function handleNewChat () {
        console.log("new chat clicked");
        setNewChatForm(true);  
    }


    return (
        <View style={styles.container}>
            {(email && chats.length === 0)? (
                <Text>Please chat first!</Text>
            ) : (
            <ChatList
                newChat={handleNewChat}  
                chats={chats} 
                userEmail={email}
            />)}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Button  title='Sign out' onPress={() => firebase.auth().signOut()} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    }
})