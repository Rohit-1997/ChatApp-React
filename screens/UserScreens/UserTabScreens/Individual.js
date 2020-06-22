// This component is for the individual chat list
import * as React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import IndividualChatList from '../UserChatListScreens/IndividualChatList';


// The loading component
function Loading() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large"/>
            <Text>Loading...</Text>
        </View>
    )
}


export default function Individual(props) {
    const [email, setEmail] = React.useState(null);                     // The state to store the email of the current logged in user
    const [chats, setChats] = React.useState([]);                       // The chat list of the user
    const [dataLoaded, setDataLoaded] = React.useState(false);          // The state to keep track of the data is loaded or not
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
                                    if (snapShot.docs[i].data().messages.length > 0) {
                                        let chatItems = {}
                                        chatItems["ID"] = snapShot.docs[i].id;
                                        chatItems["data"] = snapShot.docs[i].data();
                                        userChats.push(chatItems);
                                    }
                                }
                                setChats(userChats);
                                setEmail(user.email);
                                setTimeout(() => setDataLoaded(true), 2000);
                            })
        // The clean up function that will unsubscribe the
        // listener once the component unmounts
        return () => {
            fetchData()
        }
    }, [])


    return (
        <View style={{ flex: 1, padding: 10}}>
            {(!dataLoaded)? (
                <Loading />
            ) : (
                (chats.length === 0)? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>Please initialte a chat</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Search Tabs')} style={styles.fab}>
                            <Text style={styles.fabIcon}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) 
                : (
                    <IndividualChatList 
                        chats={chats}
                        userEmail={email}
                        navigation={props.navigation}
                    />

                )
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