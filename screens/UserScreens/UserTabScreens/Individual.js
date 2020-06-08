// This component is for the individual chat list

import * as React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import IndividualChatList from '../UserChatListScreens/IndividualChatList';


export default function Individual(props) {
    const [email, setEmail] = React.useState(null);                     // The state to store the email of the current logged in user
    const [chats, setChats] = React.useState([]);                       // The chat list of the user
    const user = firebase.auth().currentUser;



    // The use effect to fetch the chat data
    React.useEffect(() => {
        const fetchData =  firebase
                            .firestore()
                            .collection('Chats')
                            .where('users', 'array-contains', user.email)
                            .orderBy('lastContacted', 'desc')
                            .onSnapshot(async (snapShot) => {
                                const userChats = [];
                                for (let i = 0; i < snapShot.docs.length; i++) {
                                    console.log("The doc index: ", i);
                                    if (snapShot.docs[i].data().messages.length > 0) {
                                        userChats.push(snapShot.docs[i].data());
                                    }
                                }
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>Please initialte a chat</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Search Tabs')} style={styles.fab}>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
                </View>
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

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 30,
        backgroundColor: '#9477cb',
        borderRadius: 30,
        elevation: 8
    },

    fabIcon: {
        fontSize: 25,
        color: 'white'
    }
})