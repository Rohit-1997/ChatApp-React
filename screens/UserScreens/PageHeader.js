import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Individual from './UserTabScreens/Individual';
import Groups from './UserTabScreens/Groups';
import firebase from 'firebase';
import 'firebase/firestore';

const Tab = createMaterialTopTabNavigator();

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

function IndividualIconWithBadge(props) {
    // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
    const user = firebase.auth().currentUser;
    const [badgeCountIndividual, setBadgeCountIndividual] = React.useState(0);
    React.useEffect(() => {
        firebase.firestore().collection('Users').doc(user.email).onSnapshot((sanpShot) => {
            setBadgeCountIndividual(sanpShot.data().individual)
        })
    }, [])
    return <IconWithBadge badgeCount={badgeCountIndividual} />;
}

function GroupsIconWithBadge(props) {
    // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
    const user = firebase.auth().currentUser;
    const [badgeCountGroups, setBadgeCountGroups] = React.useState(0);
    React.useEffect(() => {
        firebase.firestore().collection('Users').doc(user.email).onSnapshot((sanpShot) => {
            setBadgeCountGroups(sanpShot.data().group)
        })
    }, [])
    return <IconWithBadge badgeCount={badgeCountGroups} />;
}

export default function PageHeader(props) {
    // Styling the headers
    props.navigation.setOptions({
        title: "MSIT CONNECT",
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#9477cb'
        },
        headerLeft: () => (
            <Icon
                name="three-bars"
                style={{ paddingLeft: 15 }}
                size={35}
                color='#FFFFFF'
                onPress={() => props.navigation.openDrawer()}
            />
        ),

        headerRight: () => (
            <Icon
                style={{ paddingRight: 15 }}
                name='search'
                size={25}
                color='#FFFFFF'
                onPress={() => props.navigation.navigate("Search Tabs")}
            />
        ),
    })

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size }) => {
                    if (route.name === 'Individual') {
                        return (
                            <IndividualIconWithBadge
                                name='ios-information-circle'
                                size={size}
                                color="white"
                            />
                        );
                    } else if (route.name === 'Groups') {
                        return (
                            <GroupsIconWithBadge
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
            <Tab.Screen name="Individual" component={Individual} />
            <Tab.Screen name="Groups" component={Groups} />
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
        right: -15,
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