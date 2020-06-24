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

    // The function to build doc key
    function buildDocKey() {
        const timeStamp = new Date();
        const docKey = value + ":" + timeStamp.getTime();
        return docKey;
    }

    // The function to add the group in the DB
    function addNewGroup() {
        const dockey = buildDocKey();
        const participants = [currentUser.email];
        let participantsMap = { [`${currentUser.email}`]: { groupPrimary: 0, groupOthers: 0, activities: 0 } }
        array.forEach((user) => {
            participants.push(user.email);
            participantsMap = { ...participantsMap, [`${user.email}`]: { groupPrimary: 0, groupOthers: 0, activities: 0 } }
        })

        // the case to check empty group name
        if (value === '') {
            alert('Have some sense bro, Group name cannot be empty');
            return;
        }

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
                participantsMap: participantsMap,
                lastContacted: firebase.firestore.FieldValue.serverTimestamp(),
                groupProfilePicture: "https://631ae89fcd069a398187-ee282e5b70d98fac94cba689ef7806d7.ssl.cf1.rackcdn.com/default_group_normal.png"
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