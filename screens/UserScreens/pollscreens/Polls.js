import React, { useEffect } from "react";
import { ListItem } from 'react-native-elements';
import { StyleSheet, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from 'firebase';
import 'firebase/firestore';

export default function Polls(props) {
  const currentUser = firebase.auth().currentUser;
  const currentUnderPolls = currentUser.email.split(".").join("_");

  function handleBadges() {
    firebase
      .firestore()
      .collection("GroupBadge")
      .doc(props.route.params.GroupDocKey)
      .update({
        [`${currentUnderPolls}.activities`]: 0
      }
      ).then(() => {
        firebase
          .firestore()
          .collection('GroupBadge')
          .doc(props.route.params.GroupDocKey)
          .get()
          .then((doc) => {
            const userBadgeDetails = doc.data()[currentUnderPolls]
            if (userBadgeDetails.others === 0
              && userBadgeDetails.primary === 0) {
              firebase.firestore().collection('Users').doc(currentUser.email).get().then((b) => {
                if (b.data()[`group`] !== 0) {
                  firebase.firestore().collection('Users').doc(currentUser.email).update({
                    [`group`]: firebase.firestore.FieldValue.increment(-1)
                  })
                }
              })
            }
          })
      })
    props.navigation.navigate('Poll List', { 'GroupDocKey': props.route.params.GroupDocKey })
  }

  return (
    <ScrollView style={styles.stage}>
      <TouchableOpacity onPress={() => props.navigation.navigate('Poll Creation', { 'GroupDocKey': props.route.params.GroupDocKey })}>
        <ListItem
          title='Create Poll'
          bottomDivider
          chevron
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBadges}>
        <ListItem
          title='Take a Poll'
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
  }
});
