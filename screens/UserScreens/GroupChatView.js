import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Primary from './UserChatDisplayScreens/GroupPrimary';
import Others from './UserChatDisplayScreens/GroupOthers';
import { StackActions, useFocusEffect, useNavigationState } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import GroupMenu from './GroupScreens/GroupMenu'
import Activities from './UserChatDisplayScreens/Activities'
import firebase from 'firebase';
import 'firebase/firestore';

const Tab = createMaterialTopTabNavigator();

export default function GroupChatView(props) {
    const parameters = props.route.params;             // To store a reference to the parameters passed
    const navigation = useNavigationState(state => state);
    const [participants, setParticipants] = React.useState([]);
    const currentUser = firebase.auth().currentUser;

    React.useEffect(() => {
        // console.log("In UseEffect", parameters.docKey)
        let fetchMessages = firebase
            .firestore()
            .collection("GroupChat")
            .onSnapshot((snapshot) => {
                for (let i = 0; i < snapshot.docs.length; i++) {
                    let participantsList = []
                    if (parameters.docKey === snapshot.docs[i].id) {
                        snapshot.docs[i].data().participants.forEach(particpant => {
                            participantsList.push(particpant)
                        });
                        setParticipants(participantsList)
                        break;
                    }
                }
            })
        return () => {
            fetchMessages()
        }
    }, [])

    function IconWithBadge({ name, badgeCount, color, size }) {
        return (
            <View style={{ width: 70, height: 25, margin: 5 }}>
                {/* <Ionicons name={name} size={size} color="white" /> */}
                {badgeCount > 0 && (
                    <View
                        style={{
                            // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                            position: 'absolute',
                            right: 0,
                            top: 5,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            width: 20,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#9477cb', fontSize: 12, fontWeight: 'bold' }}>
                            {badgeCount}
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    function PrimaryIconWithBadge(props) {
        // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
        // let badgeCountPrimary = 0
        // for (let index = 0; index < participants.length; index++) {
        //     if (participants[index].user === currentUser.displayName) {
        //         badgeCountPrimary = participants[index].groupPrimary
        //         break;
        //     }
        // }
        // return <IconWithBadge badgeCount={badgeCountPrimary} />

        const [badgeCountPrimary, setBadgeCountPrimary] = React.useState(0);
        if (participants.includes(currentUser.email)) {
            React.useEffect(() => {
                const fetch_data = firebase.firestore().collection('GroupChat').doc(parameters.docKey).onSnapshot((sanpShot) => {
                    setBadgeCountPrimary(sanpShot.data()['participantsMap'][currentUser.email]['groupPrimary'])
                })
                return () => {
                    fetch_data()
                }
            }, [])
        }
        return <IconWithBadge badgeCount={badgeCountPrimary} />;
    }

    function OthersIconWithBadge(props) {
        // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
        // let badgeCountOthers = 0
        // for (let index = 0; index < participants.length; index++) {
        //     if (participants[index].user === currentUser.displayName) {
        //         badgeCountOthers = participants[index].groupOthers
        //         break;
        //     }
        // }
        // return <IconWithBadge badgeCount={badgeCountOthers} />

        const [badgeCountOthers, setBadgeCountOthers] = React.useState(0);
        if (participants.includes(currentUser.email)) {
            React.useEffect(() => {
                const fetch_data = firebase.firestore().collection('GroupChat').doc(parameters.docKey).onSnapshot((sanpShot) => {
                    setBadgeCountOthers(sanpShot.data()['participantsMap'][currentUser.email]['groupOthers'])
                })
                return () => {
                    fetch_data()
                }
            }, [])
        }
        return <IconWithBadge badgeCount={badgeCountOthers} />;
    }

    function ActivitiesIconWithBadge(props) {
        // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
        // let badgeCountActivities = 0
        // for (let index = 0; index < participants.length; index++) {
        //     if (participants[index].user === currentUser.displayName) {
        //         badgeCountActivities = participants[index].groupActivities
        //         break;
        //     }
        // }
        // return <IconWithBadge badgeCount={badgeCountActivities} />
        const [badgeCountActivities, setBadgeCountActivities] = React.useState(0);
        if (participants.includes(currentUser.email)) {
            React.useEffect(() => {
                const fetch_data = firebase.firestore().collection('GroupChat').doc(parameters.docKey).onSnapshot((sanpShot) => {
                    setBadgeCountActivities(sanpShot.data()['participantsMap'][currentUser.email]['activities'])
                })
                return () => {
                    fetch_data()
                }
            }, [])
        }
        return <IconWithBadge badgeCount={badgeCountActivities} />;
    }
    // console.log("printing the navigation state: ", navigation);

    // styling the header
    props.navigation.setOptions({
        title: props.route.params.GroupName,
        headerLeft: () => {
            return (
                <HeaderBackButton onPress={() => props.navigation.navigate("Header", { screen: 'Groups' })} />
            )
        },
        headerRight: () => {
            return (
                <GroupMenu docKey={parameters.docKey} />
            )
        },
        headerTitleStyle: {
            alignSelf: 'center'
        },
        headerStyle: {
            backgroundColor: '#9477cb'
        },
        headerTintColor: '#fff'
    })

    // The useFocus effect to naivgate back to the header screen
    useFocusEffect(() => {
        // The call back function handle the back button press
        function onBackPress() {
            props.navigation.navigate("Header", {
                screen: 'Groups'
            })
            return true;
        }
        // adding a event listener for the harware back button
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
    })

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size }) => {
                    if (route.name === 'Primary') {
                        return (
                            <PrimaryIconWithBadge
                                name='ios-information-circle'
                                size={size}
                                color="white"
                            />
                        );
                    } else if (route.name === 'Others') {
                        return (
                            <OthersIconWithBadge
                                name='ios-list-box'
                                size={size}
                                color="white"
                            />
                        );
                    } else if (route.name === 'Activities') {
                        return (
                            <ActivitiesIconWithBadge
                                name='ios-list-box'
                                size={size}
                                color="white"
                            />
                        );
                    }
                },
            })}

            tabBarOptions={{
                activeTintColor: "white",
                tabTextColor: "white",
                // inactiveTintColor: "blue",
                labelStyle: { fontSize: 17 },
                style: styles.tabs,
                indicatorStyle: {
                    bottom: 0,
                    backgroundColor: 'white',
                    borderRadius: 10
                },
                showIcon: true
            }}>
            <Tab.Screen name="Primary">
                {() => <Primary groupName={parameters.GroupName} docKey={parameters.docKey} />}
            </Tab.Screen>
            <Tab.Screen name="Others">
                {() => <Others groupName={parameters.GroupName} docKey={parameters.docKey} />}
            </Tab.Screen>
            <Tab.Screen name="Activities">
                {() => <Activities GroupDocKey={parameters.docKey} />}
            </Tab.Screen>

        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({
    tabs: {
        backgroundColor: '#9477cb'
    },
});