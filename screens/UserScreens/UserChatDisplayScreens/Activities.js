import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet, TouchableOpacity
} from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from '@react-navigation/native'
import firebase from 'firebase';
import 'firebase/firestore';


export default function Activites(props) {
    const navigation = useNavigation()
    const [participantsEmailArray, setParticipantsEmailArray] = React.useState([]);
    const [participantMap, setParticipantMap] = React.useState([]);
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        let fetchParticipants = firebase
            .firestore()
            .collection("GroupChat")
            .doc(props.GroupDocKey)
            .onSnapshot((snapshot) => {
                let participantsList = []
                snapshot.data().participants.forEach(particpant => {
                    participantsList.push(particpant)
                });
                setParticipantMap((prevState) => {
                    const part = snapshot.data().participantsMap
                    return ({ ...prevState, ...part })
                })
                setParticipantsEmailArray(participantsList)
            })
        return () => {
            fetchParticipants()
        }
    }, [])

    function handleSelectedActivity() {
        // alert('coolll working')
        navigation.navigate('POLL', { 'GroupDocKey': props.GroupDocKey })

    }

    // console.log("Activities Badge count = ", participantMap[currentUser.email]['activities'])
    if (participantsEmailArray.includes(currentUser.email)) {
        if (participantMap[currentUser.email]['activities'] > 0) {
            return (
                <View>
                    <TouchableOpacity onPress={() => (handleSelectedActivity())}>
                        <ListItem
                            key='poll'
                            // leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                            title='Polls'
                            subtitle='This is to take/Create a poll'
                            rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> {participantMap[currentUser.email]['activities']} </Text>}
                            bottomDivider
                            titleStyle={{ fontSize: 17 }}
                            subtitleStyle={{ color: 'grey' }}
                        />
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View>
                    <TouchableOpacity onPress={() => (handleSelectedActivity())}>
                        <ListItem
                            key='poll'
                            // leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                            title='Polls'
                            subtitle='This is to take/Create a poll'
                            // rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> </Text>}
                            bottomDivider
                            titleStyle={{ fontSize: 17 }}
                            subtitleStyle={{ color: 'grey' }}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    } else {
        return (
            <View>
                <TouchableOpacity onPress={() => (handleSelectedActivity())}>
                    <ListItem
                        key='poll'
                        // leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                        title='Polls'
                        subtitle='This is to take/Create a poll'
                        // rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> {participantMap[currentUser.email]['activities']} </Text>}
                        bottomDivider
                        titleStyle={{ fontSize: 17 }}
                        subtitleStyle={{ color: 'grey' }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});