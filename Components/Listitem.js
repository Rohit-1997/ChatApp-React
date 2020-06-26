import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { Icon } from "react-native-elements";
import firebase from 'firebase';
import 'firebase/firestore';
export default function Listitem(props) {

    const [exp, setexp] = useState(null)
    const [disabled, setdisable] = useState(null)
    const expiry = new Date(props.expiry)

    useEffect(() => {
        const current = new Date()
        console.log('for each li', expiry.getTime(), current.getTime(), expiry - current)
        console.log('in-details', expiry.toLocaleString(), current.toLocaleString())
        console.log(expiry - current < 0)
        if (expiry - current < 0) {
            setexp(true)
        } else {
            setexp(false)
        }
    }, [])

    useEffect(() => {
        console.log("i'm coming here?")
        if (exp === true) {
            console.log("i'm coming here 2?")
            setdisable(false)
        } else if (exp === false) {
            let fetchData = firebase
                .firestore()
                .collection('Polls')
                .doc(props.PollsDocKey)
                .onSnapshot((object) => {
                    console.log('in firebase exp value is ', exp)
                    if (exp === false) {
                        handledisabled(object.data()['submittedUsers'])
                        console.log(exp, 'i should come only once', disabled)
                    }

                })
            return () => {
                fetchData()
            }
        }

    }, [exp])

    // console.log('print props in  LI',props)

    function openPollItem() {
        console.log('printing disable here', disabled, exp)
        if (disabled) {
            alert('you have submited the poll')
            return
        }

        props.navigation.navigate('Poll item', {
            Name: props.title,
            Bool_exp: exp,
            question: props.subtitle,
            Choices: props.Choices,
            PollDocKey: props.PollsDocKey
            // changeDisable : () => handledisabled
        })
    }
    function handledisabled(UsersArray) {
        const user = firebase.auth().currentUser.email
        if (UsersArray.includes(user)) {
            setdisable(true)
        }
    }

    return (
        <TouchableOpacity onPress={openPollItem} >
            <View style={styles.container}>


                <View >
                    <Text style={{ alignItems: 'flex-start', paddingBottom: 5, fontSize: 18 }}>
                        {props.title}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <Text numberOfLines={1} style={{ width: Dimensions.get('window').width / 2, color: '#96999C', fontSize: 15, marginRight: 20 }}>
                            {props.subtitle}
                        </Text>
                        {
                            exp ? (<Text style={{ textAlign: 'center', fontSize: 14, color: '#fff', borderWidth: 5, borderRadius: 14, backgroundColor: '#9477cb', overflow: 'hidden', borderColor: '#9477cb', padding: 1 }}>
                                Expired
                            </Text>) : (<Text style={{ textAlign: 'center', fontSize: 14 }}>
                            </Text>)
                        }



                    </View>

                </View>
                <Icon
                    name='chevron-right'
                    type='evilicon'
                    size={30}
                    style={{ top: 10, textAlign: 'left' }}
                    color='#96999C'

                />
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {

        padding: 14,
        backgroundColor: 'white',
        borderColor: '#bcbbc1',
        borderBottomWidth: 1 / 3,
        justifyContent: 'space-between',
        flexDirection: 'row',
        // alignItems:'center'

    }
})
    ;