import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-elements'
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { useNavigation, useNavigationState } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Octicons'

export default function GroupMenu(props) {
    const user = firebase.auth().currentUser;
    const navigation = useNavigation()
    const [participantMap, setParticipantMap] = React.useState({});
    const [mapParticipants, setMapParticipants] = React.useState({});

    React.useEffect(() => {
        firebase
            .firestore()
            .collection('GroupChat')
            .doc(props.docKey)
            .get()
            .then((doc) => {
                setParticipantMap(doc.data()[`participantsMap`])
            })
    }, [])

    function handleLeaveGroup() {
        console.log('going in')

        if (participantMap[user.email]['groupPrimary'] !== 0
            || participantMap[user.email]['groupOthers'] !== 0
            || participantMap[user.email]['activities'] !== 0) {

            firebase.firestore().collection('Users').doc(user.email).update({
                [`group`]: firebase.firestore.FieldValue.increment(-1)
            })
        }

        firebase
            .firestore()
            .collection('GroupChat')
            .doc(props.docKey)
            .update({
                participants: firebase.firestore.FieldValue.arrayRemove(user.email),
            })
        navigation.goBack()
    }

    // console.log("mapParticipants = ", mapParticipants)
    // console.log("participantsMap = ", participantMap)
    // console.log("participant = ", participantMap[user.email])

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
                    {/* <MenuOption onSelect={() => alert(`Save`)} text='Change Group Name' /> */}
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