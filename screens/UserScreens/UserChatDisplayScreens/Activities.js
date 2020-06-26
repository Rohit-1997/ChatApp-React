import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from '@react-navigation/native'
import firebase from 'firebase';
import 'firebase/firestore';

export default function Activites(props) {
    const navigation = useNavigation()
    const [participantsEmailArray, setParticipantsEmailArray] = React.useState([]);
    // const [participantMap, setParticipantMap] = React.useState({});
    const currentUser = firebase.auth().currentUser;
    const currentUsersUnderscoreActivities = currentUser.email.split(".").join("_");
    const [docData, setDocData] = React.useState(null)

    React.useEffect(() => {
        const fetch_data = firebase
            .firestore()
            .collection('GroupBadge')
            .doc(props.GroupDocKey)
            .onSnapshot((sanpShot) => {
                if (sanpShot.data() !== undefined) {
                    setDocData(sanpShot.data()[currentUsersUnderscoreActivities])
                }
                // console.log("In activities = ", sanpShot.data()[currentUsersUnderscoreActivities])
            }, function (error) {
                console.log("Activities Error = ", error)
            })
        return () => {
            fetch_data()
        }
    }, [])

    function handleSelectedActivity() {
        navigation.navigate('POLL', { 'GroupDocKey': props.GroupDocKey })
    }

    if (docData) {
        return (
            <View>
                <TouchableOpacity onPress={() => (handleSelectedActivity())}>
                    <ListItem
                        key='poll'
                        title='Polls'
                        subtitle='This is to take/Create a poll'
                        rightAvatar={(docData['activities'] > 0) ? (<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}>{docData['activities']}</Text>) : (<React.Fragment></React.Fragment>)}
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
                        title='Polls'
                        subtitle='This is to take/Create a poll'
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