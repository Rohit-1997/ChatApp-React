import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList
} from "react-native";
import firebase from 'firebase';
import 'firebase/firestore';
// import { ListItem } from 'react-native-elements'
import Listitem from '../../../Components/Listitem'

export default function PollLists(props) {
    const [PollData, setPoll] = useState([])
    console.log('Printing props in PL', props)

    useEffect(() => {
        let fetch_data = firebase.firestore()
            .collection("Polls")
            .onSnapshot((snapshot) => {
                const poll = []
                snapshot.docs.forEach((doc) => {

                    if (doc.id.includes(props.route.params.GroupDocKey)) {
                        let obj = {}
                        obj['data'] = doc.data()
                        obj['docKey'] = doc.id
                        poll.push(obj)
                    }

                })
                console.log('the array of objects', poll)
                setPoll(poll)

            })
        return () => {
            fetch_data()
        }
    }, [])


    return (

        <View>
            {
                PollData ? (<FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={PollData}
                    renderItem={({ item }) => (

                        <Listitem
                            title={item.data.Name}
                            subtitle={item.data.Question}
                            expiry={item.data.expiry_date}
                            navigation={props.navigation}
                            PollsDocKey={item.docKey}
                            Choices={item.data.Options}
                        />
                    )}
                />) : (
                        <View>
                            <Text>Need to create a poll first!!</Text>
                        </View>
                    )
            }
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
