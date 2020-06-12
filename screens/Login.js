import * as React from 'react';
import { View, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import * as Google from 'expo-google-app-auth';
import { Text, Icon } from 'native-base';
import { StackActions } from '@react-navigation/native';


export default function Login(props) {

  // The userequal method
  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }


  // The onSignin function
  function onSignIn(googleUser) {
    // console.log("In here on sign in");
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken, googleUser.accessToken);

        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).then(function (result) {
          // console.log("Signed in!");
          // console.log(result);
          if (result.additionalUserInfo.isNewUser) {
            let userData = {
              name: result.user.displayName,
              email: result.user.email,
              profilePic: result.user.photoURL
            }

            // adding data to the firestore
            firebase
              .firestore()
              .collection('Users')
              .doc(userData.email)
              .set(userData)
              .then(() => {
                console.log("data inserted");
              }, (dbError) => {
                console.log("Error occured while adding to db", dbError);
              })
          }
        })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log('Some error occured in siginwithcredentials');
            console.log(error);
          });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }



  // The method for adding the api
  async function signInWithGoogleAsync() {
    // props.navigation.navigate("Loading");
    try {
      const result = await Google.logInAsync({
        androidClientId: '40435299667-9g86a2kvit9a4ki556bjqelg2h62clpr.apps.googleusercontent.com',
        iosClientId: '40435299667-5lgta0bp3q8gu94fgesf08b805gfk90n.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        // console.log("success");
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log("In the exception");
      console.log(e);
      return { error: true };
    }
  }

  React.useEffect(() => {
    let userAuthStateChanged = firebase.auth().onAuthStateChanged(function (user) {
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
          props.navigation.navigate("Login");
        }
      }
      else {
        // props.navigation.navigate("Loading");
        // This else case is for the initial sate where the user is null
        props.navigation.navigate("Login");
      }
    })

    return () => {
      userAuthStateChanged();
    }
  })


  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/logo3.jpg')} style={styles.image}>
        <View style={styles.mail}>
          <TouchableOpacity style={styles.button} onPress={() => signInWithGoogleAsync()}>
            <View style={styles.google}>
              <Icon name="logo-google" style={{ marginRight: 15 }} />
              <Text style={styles.text}>
                Sign in with MSIT mail
               </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },

  image: {
    flex: 1,
    resizeMode: "cover"
  },

  mail: {
    flex: 1,
    justifyContent: 'flex-end',
    bottom: 100
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  google: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  button: {
    backgroundColor: '#fafafa',
    height: 70,
    marginHorizontal: 15,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});