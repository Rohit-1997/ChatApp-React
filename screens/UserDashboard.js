import * as React from 'react';
import {Text, View, ActivityIndicator,SafeAreaView,ScrollView} from 'react-native';
import {DrawerActions} from '@react-navigation/material-top-tabs';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer';
import UserHome from './UserScreens/UserHome';
import { Icon, Button } from 'native-base';
import firebase from 'firebase';
import { StackActions } from '@react-navigation/native';
import { Thumbnail } from 'native-base';


const Drawer = createDrawerNavigator();


// The test component
function TestScreen(props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Go Back Home" onPress={() => props.navigation.goBack()} />
        </View>
    )
}

//Profile settings component
// function ProfileSettings(props){
//     return (

//     )
// }


// The logout component
function LogOut(props) {
    React.useEffect(() => {
        console.log("The sign out is being called");
        firebase.auth().signOut();
    })
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large"/>
            <Text>Sigining out....</Text>
        </View>
    );
}

export default function UserDashboard(props) {
        const user = firebase.auth().currentUser;
        // console.log('printing props in UD', user)
    return (
        <Drawer.Navigator initialRouteName="UserHome" drawerContent = {(props) => (
            <SafeAreaView  >
                <View style={{height: 100,alignItems: 'center', justifyContent: 'center',paddingTop:50,paddingBottom:10}}>
                <Thumbnail  style = {{height :100,width:100,borderRadius:50}}source={{ uri: user.photoURL }} />
                  {/* <Text style={{fontSize: 32}}>LOGO</Text> */}
                </View>
              <ScrollView>
                <DrawerContent {...props} />
              </ScrollView>
            </SafeAreaView>
           )} >
            <Drawer.Screen name="UserHome" component={UserHome} />
            <Drawer.Screen name="Profile Settings" component={TestScreen} />
            <Drawer.Screen name="Notifications" component={TestScreen} />
            <Drawer.Screen name="Sign Out">
                {() => <LogOut navigation={props.navigation}/>}
            </Drawer.Screen>
        </Drawer.Navigator>
    )
}