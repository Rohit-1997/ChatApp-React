import React,{useState,useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,ScrollView,Dimensions, ActivityIndicator, BackHandler
} from "react-native";
import { Header, ListItem,Input,Button } from 'react-native-elements';
import {Icon} from 'native-base';
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import { Thumbnail} from 'native-base';
import firebase from 'firebase';
import 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';


export default function  ProfileSettingsUser (props)  {
    // const props = props.route.params
    const navigation = useNavigation()
    const [phoneNumber, setPhoneNumber] = useState('');
    const [changedPhoneNumber, setChangedPhoneNumber] = useState('');
    const [disabled,setDisabled] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    function handleOnPress (){
        navigation.goBack();
    }

    useEffect(() => {
        let fetchData = firebase
                            .firestore()
                            .collection('Users')
                            .doc(props.userDetails.email)
                            .onSnapshot((doc) => {
                                console.log("The phonenumber: ", doc.data()['phoneNumber']);
                                setPhoneNumber(doc.data()['phoneNumber']);
                                setImageUrl(doc.data().profilePic);
                            })
        return () => {
            fetchData()
            setChangedPhoneNumber('');
        }
    }, [])


    useEffect(()=>{
        if(changedPhoneNumber.length >= 10){
            setDisabled(false)
        } else {
            setDisabled(true);
        }
    },[changedPhoneNumber])


    // // The useFocus effect to naivgate back to the header screen
    // useFocusEffect(() => {
    //     // The call back function handle the back button press
    //     function onBackPress() {
    //         navigation.navigate("UserDashboard")
    //         return true;
    //     }
    //     // adding a event listener for the harware back button
    //     BackHandler.addEventListener('hardwareBackPress', onBackPress);
    //     return () => {
    //         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }
    // })


    // The function to build the file for the cloud storage
    function buildFileName() {
        const date = new Date();
        return (props.userDetails.email + date.getTime());
    }

    // The functio upload the images to the firebase storage
    async function uploadImage(uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = firebase.storage().ref();
        const fileName = buildFileName();
        console.log("The file name generated: ", fileName);
        const ref = storageRef.child("User Profile Pictures/" + fileName);
        return ref.put(blob);
    }

    // The function insert the data to firestore
    function insertImageToFirestore(downloadUrl) {
        firebase
            .firestore()
            .collection('Users')
            .doc(props.userDetails.email)
            .update({
                profilePic: downloadUrl
            })
    }


    // The function to upadte the user profile pic
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

        // uploading the image to firebase storage
        uploadImage(result.uri)
            .then(async (snapshot) => {
                console.log("The data inserted successfully");
                const downloadLink = await snapshot.ref.getDownloadURL();
                console.log("The download link: ", downloadLink);
                insertImageToFirestore(downloadLink);
            }) 
    }


    // The function to insert the phone number in firebase
    function handleSubmit() {
        if (phoneNumber === changedPhoneNumber) {
            alert("You already save this number");
            return;
        }
        console.log("Inside the handle submit: ", changedPhoneNumber);
        firebase
            .firestore()
            .collection('Users')
            .doc(props.userDetails.email)
            .update({
                phoneNumber: changedPhoneNumber
            })
        setChangedPhoneNumber('');
    }


    return (
    <View>
        <View style={{ paddingTop: 24, backgroundColor: '#9477cb' }}>
            <ListItem 
                leftAvatar={<Icon name="md-arrow-back" onPress={() => navigation.goBack()}/>}
                title="Profile"
                titleStyle={{ textAlign: 'center', color: '#fff'}}
                containerStyle={{ backgroundColor: '#9477cb' }}
            />
        </View>
        <ScrollView>
        <View style={styles.container}>
                {(imageUrl)? (
                    <TouchableOpacity style={{height: 150,alignItems: 'center', justifyContent: 'center',paddingTop:50,paddingBottom:10}} onPress={() => navigation.navigate('ShowImage', {"imageuri": imageUrl})}>
                        <Thumbnail  style = {{height :150,width:150,borderRadius:75}}source={{ uri: imageUrl }} />
                    </TouchableOpacity>
                ) : (<ActivityIndicator size='small'/>)}
                <View style = {{paddingTop:40,paddingBottom:10}}>
                    <Button title = ' Change Profile picture ' buttonStyle = {{width :Dimensions.get('window').width/2, backgroundColor : '#9477cb',borderRadius :8 }} onPress={handleProfilePicture}/>
                </View>                
        </View>

        <View>
            <ListItem 
                title = {props.userDetails.displayName}
                subtitle = {props.userDetails.email} 
                titleStyle = {{fontWeight:'bold',paddingBottom: 10}}
                subtitleStyle = {{fontWeight : '300',color:'grey'}}
                bottomDivider
            />
            <ListItem 
                title='Contact Number'
                subtitle = {(phoneNumber === '')? ('No contact information') : (phoneNumber)}
                titleStyle = {{fontWeight:'bold',paddingBottom: 10}}
                subtitleStyle = {{fontWeight : '300',color:'grey'}}
                bottomDivider
            />
        </View>

        <KeyboardAvoidingView behavior = 'padding' style = {{alignItems : 'center'}}>
        <Input 
        label = 'Change Contact-Number'
        placeholder='Enter your mobile number'
        labelStyle = {{color:'#000',fontWeight:'normal',fontSize:17,paddingTop:25}}
        value = {changedPhoneNumber}
        onChangeText = {setChangedPhoneNumber}
        keyboardType = 'phone-pad'
        maxLength = {13}
        />
        <Button  title = 'Submit' disabled = {disabled}  buttonStyle = {{width :Dimensions.get('window').width/2, backgroundColor : '#9477cb',borderRadius:10 }} onPress={handleSubmit}/>
        </KeyboardAvoidingView>
        </ScrollView>
        
        </View>
    )
    }

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderBottomWidth:1,
        borderColor:'#fff'
    }
});