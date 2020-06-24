import React, { useEffect } from "react";
import { Button, ListItem } from 'react-native-elements';

import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from 'firebase';
import 'firebase/firestore';

// import { TextButton } from 'react-native-material-buttons'
// import { Cell, Section, TableView } from 'react-native-tableview-simple';

export default function Polls(props) {
  console.log('Printing props', props)
  const currentUser = firebase.auth().currentUser;
  const [participantsEmailArray, setParticipantsEmailArray] = React.useState([]);
  const [participantMap, setParticipantMap] = React.useState([]);

  useEffect(() => {
    let fetchParticipants = firebase
      .firestore()
      .collection("GroupChat")
      .doc(props.route.params.GroupDocKey)
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

  function handleBadges() {
    if (participantsEmailArray.includes(currentUser.email)) {
      participantMap[currentUser.email]['activities'] = 0
      setParticipantMap((prevState) => {
        return ({ ...prevState })
      })
    }

    if (participantMap[currentUser.email]['groupOthers'] === 0
      && participantMap[currentUser.email]['groupPrimary'] === 0) {
      firebase.firestore().collection('Users').doc(currentUser.email).get().then((b) => {
        if (b.data()[`group`] !== 0) {
          console.log("decrement badge = ", b.data()[`group`])
          firebase.firestore().collection('Users').doc(currentUser.email).update({
            [`group`]: firebase.firestore.FieldValue.increment(-1)
          })
        }
      })
    }

    firebase
      .firestore()
      .collection('GroupChat')
      .doc(props.route.params.GroupDocKey)
      .update({
        participantsMap: participantMap,
      })
    props.navigation.navigate('Poll List', { 'GroupDocKey': props.route.params.GroupDocKey })
  }

  return (
    <ScrollView style={styles.stage}>
      <TouchableOpacity onPress={() => props.navigation.navigate('Poll Creation', { 'GroupDocKey': props.route.params.GroupDocKey })}>
        <ListItem
          title='Create Poll'
          // titleStyle  = {{color : "#007AFF"}}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBadges}>
        <ListItem
          title='Take a Poll'
          // titleStyle  = {{color : "#007AFF"}}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  butt: {
    padding: 20,
  },
  stage: {
    backgroundColor: '#EFEFF4',
    paddingBottom: 20,
    paddingTop: 0,
    // flex: 1,
  }
});
