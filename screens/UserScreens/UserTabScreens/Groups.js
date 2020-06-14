// This component is for the individual chat list
import * as React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import GroupChatList from '../UserChatListScreens/GroupChatList';


export default function Groups(props) {
    const [chats, setChats] = React.useState([]);
    const [email, setEmail] = React.useState(null);
    const user = firebase.auth().currentUser;

    // The use effect to fetch the chat data
    React.useEffect(() => {
        const fetchData = firebase
            .firestore()
            .collection('GroupChat')
            .where('participants', 'array-contains', user.email)
            .onSnapshot(async (snapShot) => {
                console.log("The snap shot is getting called");
                const userChats = [];
                for (let i = 0; i < snapShot.docs.length; i++) {
                    let groupChatTemp = {}
                    groupChatTemp["id"] = snapShot.docs[i].id;
                    groupChatTemp["data"] = snapShot.docs[i].data()
                    userChats.push(groupChatTemp);
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
    console.log("The state test: ", chats);
    return (
        <View style={{ flex: 1, padding: 10 }}>
            {console.log("The groups is rendering")}
            {(chats.length === 0) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Please initialte a chat</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Search Tabs')} style={styles.fab}>
                        <Text style={styles.fabIcon}>+</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                    <GroupChatList
                        chats={chats}
                        userEmail={user.email}
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