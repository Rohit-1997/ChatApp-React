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
        return chat.exists;
    }

    function buildDocKey(searchedUserEmail) {
        return ([firebase.auth().currentUser.email, searchedUserEmail].sort().join(':'));
    }

    async function handleSelectedChat(searchedUser) {
        const searchedUserChat = await chatExist(searchedUser.email)

        if (!searchedUserChat) {
            const docKey = buildDocKey(searchedUser.email);
            const user = firebase.auth().currentUser
            firebase
                .firestore()
                .collection('Chats')
                .doc(docKey)
                .set({
                    [`${searchedUser.name}`]: {
                        'primary': 0,
                        'others': 0
                    },
                    [`${user.displayName}`]: {
                        'primary': 0,
                        'others': 0
                    },
                    messages: [],
                    othersMessages: [],
                    users: [firebase.auth().currentUser.email, searchedUser.email],
                    receiverHasRead: false,
                    receiverHasReadOthers: false,
                    lastContacted: firebase.firestore.FieldValue.serverTimestamp()
                })
        }

        navigation.navigate("Chat View", {
            senderName: searchedUser.name,
            senderEmail: searchedUser.email,
            senderPicture: searchedUser.profilePic,
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
                // onPress={() => console.log("Search Pressed")}
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
