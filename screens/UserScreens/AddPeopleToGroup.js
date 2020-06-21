import * as React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import firebase from 'firebase';
import 'firebase/firestore';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import { createPortal } from 'react-dom';
import { get } from 'lodash';

export default function AddPeopleToGroup(props) {
    const [docUsers, setDocUsers] = React.useState([]);
    const [value, onChangeText] = React.useState('');
    const [array, onChangeArray] = React.useState([]);
    const [selectedUsers, onChangeSelectedUsers] = React.useState([]);
    const CurrentUser = firebase.auth().currentUser;
    const [CurrentParticipants,setParticipants] = React.useState([]);
    React.useEffect(() => {
        firebase
        .firestore()
        .collection('GroupChat')
        .doc(props.route.params.docKey)
        .get()
        .then((doc) => {
            setParticipants(doc.data()[`participants`])
        })

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
     
    function insertToFirebase(participants){
        // console.log('printing selected user',selectedUsers)
        let selectedUsersEmail  = [] 
        selectedUsers.forEach((user) => {
            selectedUsersEmail.push(user.email)
        })
        console.log(selectedUsersEmail,'printing selected')
        firebase
        .firestore()
        .collection('GroupChat')
        .doc(props.route.params.docKey)
        .update({
            
            participants:firebase.firestore.FieldValue.arrayUnion(...selectedUsersEmail)
        })
        
    }
    function matchedUserList(text) {
        onChangeText(text)
        const userList = []
        if (value) {
            docUsers.forEach((doc) => {
                if ((doc.email.startsWith(value.toLowerCase()) ||
                    doc.name.startsWith(value.toLowerCase())) &&
                    (doc.email !== CurrentUser.email) && ! CurrentParticipants.includes(doc.email)) {
                    userList.push(doc)
                }
            })
        }
        onChangeArray(userList)
    }

    function Item({ user }) {
        console.log("Initial Selected Users = ", selectedUsers)
        function handleSelectedUser() {
            let flag = true
            if (selectedUsers !== []) {
                selectedUsers.forEach((participant) => {
                    if (participant.email === user.email) {
                        flag = false
                    }
                })
            }

            if (flag) {
                onChangeSelectedUsers((previousState) => {
                    return ([...previousState, user])
                })
            }
        }

        return (
            <TouchableOpacity onPress={() => handleSelectedUser(user)}>
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

    function deleteUser(user) {
        console.log("user = ", user)
        const newUsers = selectedUsers.filter((each) => {
            return (each.email !== user.email)
        })
        console.log("newUsers", newUsers)
        onChangeSelectedUsers(newUsers)
    }

    return (
        <View style={styles.bckclr}>
            {console.log("selected users = ", selectedUsers)}
            <View>
                <FlatList
                    horizontal={true}
                    data={selectedUsers.reverse()}
                    renderItem={({ item }) => <ListItem
                        key={item.email}
                        leftAvatar={{ source: { uri: item.profilePic } }}
                        title={item.name}
                        onPress={() => deleteUser(item)}
                        bottomDivider
                    />}
                    keyExtractor={item => item.email}
                />
            </View>
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
                renderItem={({ item }) => <Item user={item} />}
                keyExtractor={item => item.email}
            />
            <Icon
                name="check"
                style={styles.fab}
                size={35}
                color='#FFFFFF'
                onPress={() => {
                    if (selectedUsers.length > 0) {
                        insertToFirebase()
                        props.navigation.goBack()
                        // props.navigation.navigate('New Group Name', { userArray: selectedUsers })
                    }
                    else {
                        alert("Select Atleast One User")
                    }
                }}
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

    fab: {
        // position: 'absolute',
        padding: 10,
        paddingLeft: 20,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: window.width - 100,
        bottom: 20,
        backgroundColor: '#9477cb',
        borderRadius: 30,
        elevation: 8
    },

    fabIcon: {
        fontSize: 25,
        color: 'white',
    }
});
