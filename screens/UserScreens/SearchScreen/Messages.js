// import React from 'react';
import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import firebase from 'firebase';
import 'firebase/firestore';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';

function Item({ user, navigation }) {
    async function chatExist(searchedUserEmail) {
        const docKey = buildDocKey(searchedUserEmail);
        const chat = await
            firebase
                .firestore()
                .collection('Chats')
                .doc(docKey)
                .get();
        // console.log("Chat Exists ", chat.exists);
        return chat.exists;
    }

    function buildDocKey(searchedUserEmail) {
        return ([firebase.auth().currentUser.email, searchedUserEmail].sort().join(':'));
    }

    async function handleSelectedChat(searchedUser) {
        const searchedUserChat = await chatExist(searchedUser.email)
        // console.log("nskfjvnaslfkbv", searchedUserChat)
        if (!searchedUserChat) {
            const docKey = buildDocKey(searchedUser.email);
            // console.log("Doc Key Check ", docKey)
            firebase
                .firestore()
                .collection('Chats')
                .doc(docKey)
                .set({
                    messages: [],
                    users: [firebase.auth().currentUser.email, searchedUser.email],
                    receiverHasRead: false
                })
        }

        navigation.navigate("Chat View", {
            senderName: searchedUser.name,
            senderEmail: searchedUser.email,
            senderPicture: searchedUser.profilePicture,
            currentUser: firebase.auth().currentUser.email,
        });
    }

    return (
        <TouchableOpacity onPress={() => (handleSelectedChat(user))}>
            <View style={{ flex: 1 }}>
                <ListItem
                    key={user.email}
                    leftAvatar={{ source: { uri: user.profilePic } }}
                    title={user.name}
                    subtitle={user.email}
                    bottomDivider
                />
            </View>
        </TouchableOpacity>
    );
}

export default function PeopleSearchTabScreen(props) {
    const [docUsers, setDocUsers] = React.useState([]);
    const [value, onChangeText] = React.useState('');
    const [array, onChangeArray] = React.useState([]);

    React.useEffect(() => {
        firebase.firestore()
            .collection("Users")
            .get()
            .then((snapshot) => {
                const users = []
                snapshot.docs.forEach((doc) => {
                    users.push(doc.data())
                })
                setDocUsers(users)
            })
    }, [])

    function matchedUserList(text) {
        onChangeText(text)
        const userList = []
        if (value) {
            docUsers.forEach((doc) => {
                if (doc.email.startsWith(value.toLowerCase()) || doc.name.startsWith(value.toLowerCase())) {
                    userList.push(doc)
                }
            })
        }
        onChangeArray(userList)
    }

    // console.log("Navigation check ", props.navigation)

    return (
        <View style={styles.bckclr}>
            <View style={styles.header}>
                <TextInput
                    style={{ paddingLeft: 5, height: 40, width: window.width - 70, backgroundColor: "white", borderColor: 'white', borderWidth: 1 }}
                    onChangeText={(text) => { matchedUserList(text) }}
                />
                <Icon
                    style={{ paddingLeft: 15 }}
                    name='search'
                    size={35}
                    color='#FFFFFF'
                    onPress={() => console.log("Search Pressed")}
                />
            </View>
            <FlatList
                data={array}
                renderItem={({ item }) => <Item user={item} navigation={props.navigation} />}
                keyExtractor={item => item.email}
            />
        </View>
    )
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    bckclr: {
        flex: 1,
        // backgroundColor: '#fcfbee'
    },
    tabs: {
        backgroundColor: '#9477cb',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        height: 56,
        marginBottom: 6,
        backgroundColor: '#9477cb'
    },
});
