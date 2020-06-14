import * as React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { StackActions } from '@react-navigation/native';

export default function Loading(props) {
    // The use effect to check the login state
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
          console.log("The user object in the login: ", user);
          if (user) {
            const communityString = user.email.split("@")[1];
            console.log(communityString);
            if (communityString === "msitprogram.net") {
              props.navigation.dispatch(
                StackActions.replace("UserDashboard")
              );
            } else {
              firebase.auth().signOut();
              alert("Please sign in with msit mail");
              props.navigation.navigate("Login");
            }
          }
          else {
            // props.navigation.navigate("Loading");
            // This else case is for the initial sate where the user is null
            console.log("The auth state in loading is getting called");
            props.navigation.dispatch(
                StackActions.replace("Login")
            );
          }
        })
      }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large"/>
            <Text>Loading...</Text>
        </View>
    )
}