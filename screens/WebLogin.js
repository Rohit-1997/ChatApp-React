import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';

// creatign an instance of the provider
let provider = new firebase.auth.GoogleAuthProvider();

export default function WebLogin(props) {

    function handleLogin() {
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // Adding the creds to the database
            if (result.additionalUserInfo.isNewUser) {
                try {
                    let userRef = firebase.database().ref('users');
                    let data = {
                        name: user.providerData[0].displayName,
                        email: user.providerData[0].email,
                        profilePic: user.providerData[0].photoURL
                    }
                    userRef.push(data);
                }
                catch (e) {
                    console.log(e);
                }
            }
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            console.log("in here", user)
            if (user) props.navigation.navigate("Dashboard");
            else props.navigation.navigate("WebLogin");
        })
    }, [])

    return (
        <View>
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}