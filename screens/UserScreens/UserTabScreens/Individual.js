// This component is for the individual chat list

import * as React from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import IndividualChatList from '../UserChatListScreens/IndividualChatList';


export default function Individual(props) {
    const [email, setEmail] = React.useState(null);                     // The state to store the email of the current logged in user
    const [chats, setChats] = React.useState([]);                       // The chat list of the user
    const user = firebase.auth().currentUser;
    



    // The asunc function to fetch the data
    function fetchChatData() {
        firebase
            .firestore()
            .collection('Chats')
            .where('users', 'array-contains', user.email)
            .onSnapshot(async (snapShot) => {
                const userChats = snapShot.docs.map((doc) => doc.data());
                // console.log("The chats set", userChats);
                setChats(userChats);
                setEmail(user.email);
            })
    }


    // The use effect to fetch the chat data
    React.useEffect(() => {
        // if (user) {
        //     fetchChatData();
        // }
        const fetchData =  firebase
                            .firestore()
                            .collection('Chats')
                            .where('users', 'array-contains', user.email)
                            .onSnapshot(async (snapShot) => {
                                const userChats = snapShot.docs.map((doc) => doc.data());
                                // console.log("The chats set", userChats);
                                setChats(userChats);
                                setEmail(user.email);
                            })
        // The clean up function that will unsubscribe the
        // listener once the component unmounts
        return () => {
            fetchData()
        }
    }, [])


    // The state test:
    // console.log("The state test: ", chats);
    return (
        <View style={{ flex: 1, padding: 10}}>
            {(email && chats.length === 0)? (
                <Text>Please initialte a chat</Text>
            ) : (
                <IndividualChatList 
                    chats={chats}
                    userEmail={email}
                    navigation={props.navigation}
                />
            )}
        </View>
    )
}