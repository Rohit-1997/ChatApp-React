import React, { useState, useEffect } from "react";
import { 
    View,
    Text,
    StyleSheet,FlatList
} from "react-native";
import { ListItem} from 'react-native-elements'
import firebase from 'firebase';
import 'firebase/firestore';
import { CommonActions } from "@react-navigation/native";
export default function GroupParticipants (props) {
    const [Participants,setParticipants] = useState([])
    const [GroupUsers,setUsers] = useState([])

    useEffect(() =>{
    firebase
    .firestore()
    .collection('GroupChat')
    .doc(props.route.params.docKey)
    .get()
    .then((object)=>{
        setParticipants(object.data()[`participants`])

    })

    },[])
    function compare(a,b) {
        if(a.name  < b.name){
            return -1
        }
        if(a.name > b.name){
            return 1
        }
        return 0
    }
    useEffect(() =>{
        firebase
        .firestore()
        .collection('Users')
        .get()
        .then((obj) =>{
            let users = []
            obj.docs.forEach((doc) =>{
                if(Participants.includes(doc.id)){
                    users.push(doc.data())
                }
            })
            users.sort(compare)
            setUsers(users)
           
        })
    },[Participants])

   
    // console.log('printing Users',GroupUsers,Participants)
    return (
        <View style =  {{flex : 1}}>
        <FlatList
            data={GroupUsers}
            renderItem={({ item }) => (
            <ListItem
                leftAvatar={{ source: { uri: item.profilePic } }}
                title={item.name}
                // subtitle={displayItem[0].messages[displayItem[0].messages.length - 1].message.substring(0, 20)}
                bottomDivider />
            )}
            keyExtractor={(item) => item.email}
        />
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