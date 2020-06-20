import React, { Component } from 'react';
import { TextInput, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { View } from 'native-base';
import Icon from 'react-native-vector-icons/Octicons';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import 'firebase/firestore';
import { StackActions, useNavigationState } from '@react-navigation/native';


export default function GroupNameAddScreen(props) {
    const [value, onChangeText] = React.useState('');
    const array = props.route.params.userArray;
    const currentUser = firebase.auth().currentUser;

    const state = useNavigationState(state => state);

    // console.log("The react navigation state object: ", state);

    // console.log("Array = ", array);

    // The function to build doc key
    function buildDocKey() {
        const timeStamp = new Date();
        const docKey = value + ":" + timeStamp.getTime();
        // console.log("The dock Key: ", docKey);
        return docKey;
    }

    // The function to add the group in the DB
    function addNewGroup() {
        const dockey = buildDocKey();
        const participants = [currentUser.email];
        array.forEach((user) => {
            participants.push(user.email);
        })
        // console.log("The participants check: ", participants);

        // The query to add the new group
        firebase
            .firestore()
            .collection("GroupChat")
            .doc(dockey)
            .set({
                groupName: value,
                messages: [],
                othersMessages: [],
                timeStamp: dockey.split(":")[1],
                updatedGroupName: value,
                participants: participants,
                lastContacted: firebase.firestore.FieldValue.serverTimestamp()
            })

        // navigating to the group view screen
        props.navigation.dispatch(
            StackActions.replace("Group Chat View", {
                GroupName: value,
                docKey: dockey
            })
        );
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', backgroundColor: "#9477cb", padding: 10 }}>
                <TextInput
                    style={{
                        paddingLeft: 5,
                        height: 50,
                        width: Dimensions.get("window").width - 75,
                        backgroundColor: "white",
                        borderColor: 'white',
                        borderWidth: 1
                    }}
                    onChangeText={text => onChangeText(text)}
                    value={value}
                />
                <TouchableOpacity onPress={() => addNewGroup()}>
                    <Icon
                        style={{ paddingLeft: 15 }}
                        name='check'
                        size={48}
                        color='white'
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                data={array}
                renderItem={({ item }) => (
                    <View>
                        <ListItem
                            key={item.email}
                            leftAvatar={{ source: { uri: item.profilePic } }}
                            title={item.name}
                            subtitle={item.email}
                            bottomDivider
                        />
                    </View>
                )}
                keyExtractor={item => item.email}
            />
        </View>
    );
}