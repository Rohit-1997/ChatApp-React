import * as React from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';

export default function Groups() {
    const fetchedData = React.useState([]);
    const user = firebase.auth().currentUser;


    React.useEffect(() => {
        // The function to fetch the data
        let fetchData = firebase
                            .firestore()
                            .collection('GroupChat')
                            .where('participants', 'array-contains', user.email)
                            .onSnapshot(async (snapShot) => {
                                const usersGroupChats = [];
                                const docs = snapShot.docs;
                                for(let i = 0; i < snapShot.docs.length; i++) {
                                    if (snapShot.docs[i].data().messages.length > 0) {
                                        let tempObj = {}
                                        tempObj["ID"] = docs[i].id;
                                        tempObj["data"] = docs[i].data();
                                        usersGroupChats.push(tempObj);
                                    }
                                }
                                console.log("The data after docs loop: ", usersGroupChats);
                            })

        return () => {
            fetchData();
        }
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                Hello from Groups.js
            </Text>
        </View>
    )
}