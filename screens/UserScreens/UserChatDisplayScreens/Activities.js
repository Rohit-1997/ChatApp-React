import React from "react";
import { 
    View,
    Text,
    StyleSheet,TouchableOpacity
} from "react-native";
import { ListItem } from "react-native-elements";
import {useNavigation} from '@react-navigation/native'
// import Polls from "../pollscreens/Polls";


export default function Activites (props) { 
    const navigation  = useNavigation()
    function handleSelectedActivity(){
        // alert('coolll working')
        navigation.navigate('POLL',{'GroupDocKey' : props.GroupDocKey})

    }
    return (
    <View>
        <TouchableOpacity onPress={() => (handleSelectedActivity())}>
            <ListItem
                key='poll'
                // leftAvatar={{ source: { uri: displayItem[0].profilePic } }}
                title='Polls'
                subtitle= 'This is to take/Create a poll'
                // rightAvatar={<Text style={{ backgroundColor: '#9477cb', borderRadius: 100, color: 'white' }}> {newMessagePrimary + newMessageOthers} </Text>}
                bottomDivider
                titleStyle = {{fontSize:17}}
                subtitleStyle = {{color :'grey'}}
            />
        </TouchableOpacity>
    </View>
    )
}
 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});