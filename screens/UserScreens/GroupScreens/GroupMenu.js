import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { Icon } from 'react-native-elements'
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { useNavigation, useNavigationState } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Octicons'
   
  export default function GroupMenu(props){
    const user = firebase.auth().currentUser;
    const navigation = useNavigation()

    function handleLeaveGroup (){
        console.log('going in')
        firebase
        .firestore()
        .collection('GroupChat')
        .doc(props.docKey)
        .update({
            participants: firebase.firestore.FieldValue.arrayRemove(user.email)
        })
        navigation.goBack()

    }
    
    return (
        <View>
        <Menu>
            <MenuTrigger>
                <Icon
                name = 'kebab-vertical'
                type='octicon'
                color = '#fff'
                style = {{paddingRight : 20}}
                />
            </MenuTrigger>
            <MenuOptions>
            {/* <MenuOption onSelect={() => alert(`Save`)} text='Change Group Name' /> */}
            <MenuOption onSelect={() => alert(`Not called`)} text='Group Settings' />
            <MenuOption onSelect={() =>navigation.navigate('Group Participants',{'docKey' : props.docKey})} text='Participants' />
            <MenuOption onSelect={() =>navigation.navigate('Add People',{'docKey' : props.docKey})} text='Add People' />
            <MenuOption onSelect={handleLeaveGroup}  >
                <Text style={{color: 'red'}}>Leave Group</Text>
            </MenuOption>
            </MenuOptions>
        </Menu>
        </View>)
};