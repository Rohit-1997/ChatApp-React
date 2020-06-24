import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Thumbnail } from 'native-base';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import 'firebase/firestore';

export default function ProfileView(props) {
    const parameters = props.route.params
    const [phoneNumber, setPhoneNumber] = useState('')
    useEffect(() => {
        firebase
            .firestore()
            .collection('Users')
            .doc(parameters.userEmail)
            .get()
            .then((doc) => {
                setPhoneNumber(doc.data().phoneNumber)
            })
    }, [])

    return (
        <View >
            <TouchableOpacity style={{ height: 150, alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 10 }} onPress={() => props.navigation.navigate('ShowImage', { "imageuri": parameters.userPicture })}>
                <Thumbnail style={{ height: 150, width: 150, borderRadius: 75 }} source={{ uri: parameters.userPicture }} />
            </TouchableOpacity>
            <ListItem
                title={parameters.userName}
                subtitle={parameters.userEmail}
                titleStyle={{ fontWeight: 'bold', paddingBottom: 10 }}
                subtitleStyle={{ fontWeight: '600', color: 'grey' }}
                style={{ paddingTop: 50 }}
            />
            {phoneNumber ? (
                <View>
                    <ListItem
                        title='Phone'
                        subtitle={phoneNumber}
                        titleStyle={{ fontWeight: 'bold', paddingBottom: 10 }}
                        subtitleStyle={{ fontWeight: '600', color: 'grey' }}
                    />

                </View>
            ) : (
                    <View>
                        <ListItem
                            subtitle='Phone Number not updated '
                            subtitleStyle={{ fontWeight: '600', color: 'grey', }} />
                    </View>
                )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});