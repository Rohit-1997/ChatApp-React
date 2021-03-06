import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon } from 'react-native-elements'
import * as React from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function GroupMenu(props) {
    const user = firebase.auth().currentUser;
    const navigation = useNavigation()
    const currenUserUnderScoreDelete = user.email.split(".").join("_");

    function handleLeaveGroup() {
        firebase
            .firestore()
            .collection('GroupBadge')
            .doc(props.docKey)
            .get()
            .then((doc) => {
                const userBadgeDetails = doc.data()[currenUserUnderScoreDelete]
                if (userBadgeDetails.others !== 0
                    || userBadgeDetails.activities !== 0
                    || userBadgeDetails.primary !== 0) {
                    firebase.firestore().collection('Users').doc(user.email).update({
                        [`group`]: firebase.firestore.FieldValue.increment(-1)
                    })
                }
            })

        firebase
            .firestore()
            .collection('GroupChat')
            .doc(props.docKey)
            .update({
                participants: firebase.firestore.FieldValue.arrayRemove(user.email),
            }).then(() => {
                firebase
                    .firestore()
                    .collection("GroupBadge")
                    .doc(props.docKey)
                    .update({
                        [`${currenUserUnderScoreDelete}`]: firebase.firestore.FieldValue.delete()
                    }).then(() => {
                        console.log("Successfully Left")
                    }).catch((e) => {
                        alert("Leave Group Not Sucessful")
                    })
            })
        navigation.goBack()
    }

    return (
        <View>
            <Menu>
                <MenuTrigger>
                    <Icon
                        name='kebab-vertical'
                        type='octicon'
                        color='#fff'
                        style={{ paddingRight: 20 }}
                    />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => navigation.navigate('Group Settings', { docKey: props.docKey })} text='Group Settings' />
                    <MenuOption onSelect={() => navigation.navigate('Group Participants', { 'docKey': props.docKey })} text='Participants' />
                    <MenuOption onSelect={() => navigation.navigate('Add People', { 'docKey': props.docKey })} text='Add People' />
                    <MenuOption onSelect={handleLeaveGroup}  >
                        <Text style={{ color: 'red' }}>Leave Group</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </View>)
}
