import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';


export default function Images(props) {
    const navigation = props.navigation;
    const parameters = props.route.params;
    const imageData = parameters.image;
    const currentUser = firebase.auth().currentUser;

    console.log("The image data", imageData);


    // Setting the titile of the image share screen
    navigation.setOptions({
        title: `Share image with ${parameters.senderName}`,
        headerTitleStyle: {
            alignSelf: 'center'
        },
        headerStyle: {
            backgroundColor: '#9477cb'
        },
        headerTintColor: '#fff'
    })


    // This function builds the unique filename for the file storage
    function buildFileName() {
        const date = new Date();
        return currentUser.displayName.split(" ")[0] + ":" + parameters.senderName + ":" + date.getTime();
    }

    // function to get the time with proper format
    function getTimeData() {
        const timeObj = new Date();
        const timeString = timeObj.toLocaleTimeString().split(":").splice(0, 2).join(":");
        const dateString = timeObj.toDateString().split(" ").splice(1, 4).join(" ");
        // console.log(dateString);
        // console.log("The time value,", timeString);
        return [timeString, dateString].join(" ");
    }


    // The function to handle the uploading of the image
    async function uploadImage(uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = firebase.storage().ref();
        const fileName = buildFileName();
        console.log("The file name generated: ", fileName);
        const ref = storageRef.child("Images/" + fileName);
        return ref.put(blob);
    }


    // The function to insert the download url in the firestore
    function insertImageToFirestore(downloadUrl) {
        const docKey = parameters.docKey;
        const timeStampDetails = getTimeData();
        console.log("Testing all the things: ");
        console.log("Testing the parent name: ", parameters.parent);
        console.log("Testing the doc key: ", docKey);
        console.log("Testing the download url: ", downloadUrl);
        let feildName = "";                 // To Store what value to update in the query
        let collectionName = "";
        
        if (parameters.parent === 'primary') {
            feildName = 'messages';
            collectionName = 'Chats';
        } else if (parameters.parent === 'others') {
            feildName = 'othersMessages';
            collectionName = 'Chats';
        } else if (parameters.parent === 'groupPrimary') {
            feildName = 'messages';
            collectionName = 'GroupChat';
        } else {
            feildName = 'othersMessages';
            collectionName = 'GroupChat'
        }

        console.log("The field name: ", feildName);
        console.log("The collection name: ", collectionName);
        // The update query
        firebase
        .firestore()
        .collection(`${collectionName}`)
        .doc(docKey)
        .update({
            [`${feildName}`]: firebase.firestore.FieldValue.arrayUnion({
                sender: currentUser.email,
                message: downloadUrl,
                timestamp: timeStampDetails,
                senderUserName: currentUser.displayName,
                type: "Image"
            }),
            receiverHasRead: false,
            lastContacted: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    // The handle Share function 
    function handleShare() {
        console.log("Share function is working");
        // Uploading the image to the firebase storage
        uploadImage(imageData.uri)
            .then(async (snapshot) => {
                console.log("The data inserted successfully");
                const downloadLink = await snapshot.ref.getDownloadURL();
                console.log("The download link: ", typeof(downloadLink));
                insertImageToFirestore(downloadLink);
                navigation.goBack();
            })
            .catch((error) => {
                console.log("error occured while inserting into firebase storage: ", error);
            })
    }


    return (
        <View style={styles.container}>
            <Image source={{ uri: imageData.uri }} style={{ width: '80%', height: '50%' }}/>
            <TouchableOpacity style={styles.Button} onPress={handleShare}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Share</Text>
            </TouchableOpacity>
        </View>
    )
}


// The styles area
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    Button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        width: '50%',
        height: '10%',
        borderRadius: 15
    }
})