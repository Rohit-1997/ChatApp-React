import React,{useState,useEffect} from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,ScrollView,Dimensions
} from "react-native";
import { Header, ListItem,Input,Button } from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import { Thumbnail} from 'native-base';
export default function  ProfileSettingsUser (props)  {
    const parameters = props.route.params
    const navigation = useNavigation()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [disabled,setDisabled] = useState(true)
    function handleOnPress (){
        // console.log('im in', navigation)
        navigation.goBack()
    }
    useEffect(()=>{
        if(phoneNumber.length >= 10){
            setDisabled(false)
        }
    },[phoneNumber])
   
    return (
    // <View>
    //     <Text> please work</Text>
    // </View>
   <View>
        <View style={styles.container}>
                <View style={{height: 150,alignItems: 'center', justifyContent: 'center',paddingTop:50,paddingBottom:10}}>
                    <Thumbnail  style = {{height :150,width:150,borderRadius:75}}source={{ uri: parameters.userDetails.photoURL }} />
                </View>
                {parameters.current? (
                    <View style = {{paddingTop:50,paddingBottom:10}}>
                        {/* <TouchableOpacity style = {{borderWidth:1, backgroundColor:'#9477cb', borderColor: '#9477cb',borderRadius:4}}>
                            <Text style = {{padding:5,color:'#fff',fontSize:15}} >Change Profile Picture</Text>
                        </TouchableOpacity> */}
                        <Button  title = ' Change Profile picture '   buttonStyle = {{width :Dimensions.get('window').width/2, backgroundColor : '#9477cb',borderRadius :8 }} />
                    </View>
                    
                ):(<View>
                    </View>) }
                
        </View>
        <ScrollView>
        {/* <View style = {{padding:10,backgroundColor:'#fff',flexDirection:'row'}}>
                <Text style ={{fontSize:17}}>Name :</Text>
                <Text style ={{fontSize:17}}> {parameters.userDetails.displayName}</Text>
        </View> */}
        <ListItem 
            title = {parameters.userDetails.displayName}
            subtitle = {parameters.userDetails.email} 
            titleStyle = {{fontWeight:'bold',paddingBottom: 10}}
            subtitleStyle = {{fontWeight : '300',color:'grey'}}
            />
        {parameters.current ? (
        <KeyboardAvoidingView behavior = 'padding'
        style = {{alignItems : 'center'}}>
            <Input 
            label = 'Phone-Number'
            placeholder='Enter your mobile number'
            labelStyle = {{color:'#000',fontWeight:'normal',fontSize:17,paddingTop:25}}
            value = {phoneNumber}
            onChangeText = {setPhoneNumber}
            keyboardType = 'phone-pad'
            maxLength = {13}

             />
             <Button  title = 'Submit' disabled = {disabled}  buttonStyle = {{width :Dimensions.get('window').width/2, backgroundColor : '#9477cb',borderRadius:10 }} />
             {/* <Button /> */}
            </KeyboardAvoidingView>) :(
                <View>
                    <ListItem 
                        title = {phoneNumber}
                        // subtitle = {parameters.userDetails.email} 
                        // titleStyle = {{fontWeight:'bold',paddingBottom: 10}}
                        // subtitleStyle = {{fontWeight : '300',color:'grey'}}
                    />
                </View>
            )}
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


{/* <Header
        containerStyle={{
            backgroundColor: '#9477cb',
            // justifyContent: 'space-around',
          }}
        centerComponent={{ text: 'Profile ', style: { color: '#fff',fontSize:17 } }}
        leftComponent={{ icon: 'arrow-back', color: '#fff',onPress :() =>handleOnPress()}}/> */}