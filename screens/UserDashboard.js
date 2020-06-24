import * as React from 'react';
import { Text, View, ActivityIndicator, SafeAreaView, ScrollView, BackHandler } from 'react-native';
import { DrawerActions } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator, DrawerContent } from '@react-navigation/drawer';
import UserHome from './UserScreens/UserHome';
import { Icon, Button } from 'native-base';
import firebase from 'firebase';
import 'firebase/firestore';
import { StackActions, useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { Thumbnail } from 'native-base';
import ProfileSettings from './UserScreens/MenuScreens/ProfileSettings'


const Drawer = createDrawerNavigator();


// The test component
function ProfileHelper(props) {
    const navigation = useNavigation();
    React.useEffect(() => {
        // console.log('im in helper',state)
        console.log('im in helper',)
        // navigation.navigate('ProfileSettingsUser' ,{current : props.current,userDetails : props.userDetails})
    }, [])

    return (
        <View>
            <ProfileSettings userDetails={props.userDetails} />
        </View>
    )
}

function TestScreen1(props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Go Back Home" onPress={() => props.navigation.goBack()} />
        </View>
    )
}

// The logout component
function LogOut(props) {
    React.useEffect(() => {
        console.log("The sign out is being called");
        firebase.auth().signOut();
    })
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text>Sigining out....</Text>
        </View>
    );
}

export default function UserDashboard(props) {
    const user = firebase.auth().currentUser;
    const [imageUrl, setImageUrl] = React.useState(null);


    // The use effect to fetch the image of the user
    React.useEffect(() => {
        let fetchData = firebase
            .firestore()
            .collection('Users')
            .doc(user.email)
            .onSnapshot((snapshot) => {
                setImageUrl(snapshot.data().profilePic);
            })
    })



    return (
        <Drawer.Navigator initialRouteName="UserHome" drawerContent={(props) => (
            <SafeAreaView  >
                <View style={{ height: 100, alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 10 }}>
                    {(imageUrl) ? (
                        <Thumbnail style={{ height: 100, width: 100, borderRadius: 50, paddingBottom: 20 }} source={{ uri: imageUrl }} />
                    ) : (
                            <ActivityIndicator size='small' />
                        )}
                    {/* <Text style={{fontSize: 32}}>LOGO</Text> */}
                </View>
                <ScrollView>
                    <DrawerContent {...props} />
                </ScrollView>
            </SafeAreaView>
        )} >
            <Drawer.Screen name="UserHome" component={UserHome} />
            <Drawer.Screen name="ProfileSettings"  >
                {() => <ProfileHelper userDetails={user} />}
            </Drawer.Screen>
            <Drawer.Screen name="Notifications" component={TestScreen1} />
            <Drawer.Screen name="Sign Out">
                {() => <LogOut navigation={props.navigation} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    )
}