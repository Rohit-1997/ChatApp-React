import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import { View, StyleSheet, Text } from 'react-native';
import Primary from './UserChatDisplayScreens/GroupPrimary';
import Others from './UserChatDisplayScreens/GroupOthers';
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import GroupMenu from './GroupScreens/GroupMenu'
import Activities from './UserChatDisplayScreens/Activities'
import firebase from 'firebase';
import 'firebase/firestore';
import { snakeCase } from 'lodash';

const Tab = createMaterialTopTabNavigator();

export default function GroupChatView(props) {
    const parameters = props.route.params;             // To store a reference to the parameters passed
    const navigation = useNavigationState(state => state);
    // const [participants, setParticipants] = React.useState([]);
    const currentUser = firebase.auth().currentUser;
    const currentUnderScoreGroupChatView = currentUser.email.split(".").join("_");

    function IconWithBadge({ name, badgeCount, color, size }) {
        return (
            <View style={{ width: 70, height: 25, margin: 5 }}>
                {badgeCount > 0 && (
                    <View style={styles.badges}>
                        <Text style={styles.badgeTextColour}>
                            {badgeCount}
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    function PrimaryIconWithBadge(props) {
        const [badgeCountPrimary, setBadgeCountPrimary] = React.useState(0);
        // let badgeCountPrimary = 0
        React.useEffect(() => {
            const fetch_data = firebase
                .firestore()
                .collection('GroupBadge')
                .doc(parameters.docKey)
                .onSnapshot((sanpShot) => {
                    if (sanpShot.data() !== undefined) {
                        // console.log("sanpShot.data()[currentUnderScoreGroupChatView]['primary']", sanpShot.data()[currentUnderScoreGroupChatView]['primary'])
                        setBadgeCountPrimary(sanpShot.data()[currentUnderScoreGroupChatView]['primary'])
                    }
                    // console.log("currentUnderScoreGroupChatView primary in GroupChatView = ", sanpShot.data()[currentUnderScoreGroupChatView]['primary'])
                })
            return () => {
                fetch_data()
            }
        }, [])
        return <IconWithBadge badgeCount={badgeCountPrimary} />;
    }

    function OthersIconWithBadge(props) {
        const [badgeCountOthers, setBadgeCountOthers] = React.useState(0);
        React.useEffect(() => {
            const fetch_data = firebase
                .firestore()
                .collection('GroupBadge')
                .doc(parameters.docKey)
                .onSnapshot((sanpShot) => {
                    if (sanpShot.data() !== undefined) {
                        setBadgeCountOthers(sanpShot.data()[currentUnderScoreGroupChatView]['others'])
                    }
                })
            return () => {
                fetch_data()
            }
        }, [])
        return <IconWithBadge badgeCount={badgeCountOthers} />;
    }

    function ActivitiesIconWithBadge(props) {
        const [badgeCountActivities, setBadgeCountActivities] = React.useState(0);
        React.useEffect(() => {
            const fetch_data = firebase
                .firestore()
                .collection('GroupBadge')
                .doc(parameters.docKey)
                .onSnapshot((sanpShot) => {
                    if (sanpShot.data() != undefined) {
                        setBadgeCountActivities(sanpShot.data()[currentUnderScoreGroupChatView]['activities'])
                    }
                })
            return () => {
                fetch_data()
            }
        }, [])
        return <IconWithBadge badgeCount={badgeCountActivities} />;
    }
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

    badges: {
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
    },
    badgeTextColour: { color: '#9477cb', fontSize: 12, fontWeight: 'bold' }
});
