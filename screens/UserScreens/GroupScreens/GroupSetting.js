import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, BackHandler, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { Thumbnail, Icon} from 'native-base';
import {Button, Input} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';

export default function Groupsetting(props) {
    const [imageUrl, setImageUrl] = React.useState(null);
    const [groupName, setGroupName] = React.useState(null);
    const [finalGroupName, setFinalGroupName] = React.useState(null);
    const parameters = props.route.params;


    // Setting up the screen headers
    props.navigation.setOptions({
        title: 'Group Settings',
        headerLeft: () => {
            return (
                <HeaderBackButton onPress={() => props.navigation.navigate("Group Chat View", { GroupName: finalGroupName, docKey: parameters.docKey })}/>
            )
        },
        headerStyle: {
            backgroundColor: '#9477cb',
        },
        headerTintColor: '#fff',

    })

    // The use efffect to fetch the data when the component mounts
    React.useEffect(() => {
        let fetchData = firebase
                            .firestore()
                            .collection('GroupChat')
                            .doc(parameters.docKey)  
                            .onSnapshot((snapshot) => {
                                console.log("Testing the doc in snap shot: ", snapshot.data());
                                setImageUrl(snapshot.data()['groupProfilePicture']);
                                setGroupName(snapshot.data()['updatedGroupName']);
                                setFinalGroupName(snapshot.data()['updatedGroupName']);
                            })

        return () => {
            fetchData();
            setGroupName(null);
            setImageUrl(null);
        }
    }, [])


    // The use foucs effect to handle the back press
    useFocusEffect(() => {
        function onBackPress() {
            props.navigation.navigate('Group Chat View', {
                GroupName: finalGroupName,
                docKey: parameters.docKey
            })
        }

        // adding a event listener for the harware back button
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
    })


    // The function to build the file for the cloud storage
    function buildFileName() {
        const date = new Date();
        return (parameters.docKey + date.getTime());
    }

    // The function to handle the uploading of the image
    async function uploadImage(uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = firebase.storage().ref();
        const fileName = buildFileName();
        console.log("The file name generated: ", fileName);
        const ref = storageRef.child("Group Profile Pictures/" + fileName);
        return ref.put(blob);
    }


    // The function insert the data to firestore
    function insertImageToFirestore(downloadUrl) {
        firebase
            .firestore()
            .collection('GroupChat')
            .doc(parameters.docKey)
            .update({
                groupProfilePicture: downloadUrl
            })
    }


    // The function to upadte the group profile pic
    async function handleProfilePicture() {
        console.log("In handle profile picture");
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        console.log('The status of the permission: ', status);
        if (status !== 'granted') return;
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })
        console.log("The result of the image picked: ", result);
        // if the user selects nothing
        if (result.cancelled) return;

        // handling the firebase
        uploadImage(result.uri)
            .then(async (snapshot) => {
                console.log("The data inserted successfully");
                const downloadLink = await snapshot.ref.getDownloadURL();
                console.log("The download link: ", downloadLink);
                insertImageToFirestore(downloadLink);
            }) 
    }


    // The function to update the group name in firestore
    function handleSubmit() {
        console.log("In handle");
        if (groupName === '') {
            alert('Group name cannot be empty');
            return;
        }
        setFinalGroupName(groupName);
        firebase
            .firestore()
            .collection('GroupChat')
            .doc(parameters.docKey)
            .update({
                updatedGroupName: groupName
            })
    }

 
    return (
        <ScrollView>
            {(imageUrl)? (
            <React.Fragment>
            <View style={styles.container}>
                <TouchableOpacity style={{height: 150,alignItems: 'center', justifyContent: 'center',paddingTop:50,paddingBottom:10}} onPress={() => props.navigation.navigate('ShowImage', {"imageuri": imageUrl})}>
                    <Thumbnail  style = {{height :150,width:150,borderRadius:75}}source={{ uri:imageUrl }} />
                </TouchableOpacity>
                <View style = {{paddingTop:50,paddingBottom:10}}>
                    <Button title = ' Change Group picture ' buttonStyle = {{width :Dimensions.get('window').width/2, backgroundColor : '#9477cb',borderRadius :8 }} onPress={handleProfilePicture}/>
                </View>
            </View>
                <KeyboardAvoidingView behavior = 'padding'>
                <Input 
                    label = 'Group name: '
                    labelStyle = {{color:'#000',fontWeight:'bold',fontSize:17,paddingTop:25}}
                    value = {groupName}
                    onChangeText={setGroupName}
                />
                <Button  title = 'Submit'  buttonStyle = {{width :Dimensions.get('window').width/2, backgroundColor : '#9477cb',borderRadius:10, alignSelf: 'center' }} onPress={handleSubmit}/>
                </KeyboardAvoidingView>
            </React.Fragment>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading.....</Text>
                </View>
            )}

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }
});