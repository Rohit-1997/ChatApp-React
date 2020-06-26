import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, } from "react-native";
import { Input, Icon, Button } from 'react-native-elements'
import { Platform, TouchableOpacity } from 'react-native';
import { BackdropProvider, TimePicker, DatePicker } from 'react-native-propel-kit'
import firebase from 'firebase';
import 'firebase/firestore';

export default function PollCreation(props) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [ques, setQues] = useState('')
    const [opt, setOpt] = useState([])
    const [defopt, setDef] = useState(['', ''])
    const [bool, setBool] = useState(true)
    const [PollName, setName] = useState('')
    // const [participantsEmailArray, setParticipantsEmailArray] = React.useState([]);
    // const [participantMap, setParticipantMap] = React.useState([]);
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        if (/\S/.test(ques) && /\S/.test(PollName)) {
            if (/\S/.test(defopt[0]) && /\S/.test(defopt[1])) {
                let count = 0
                for (let i = 0; i < opt.length; i++) {
                    if (/\S/.test(opt[i])) {
                        count++
                    }
                }
                if (count === opt.length) {
                    setBool(false)
                } else {
                    setBool(true)
                }
            } else {
                setBool(true)
            }
        } else {
            setBool(true)
        }
    }, [ques, opt, defopt, PollName])

    function BuildDocKey() {
        let timestamp = new Date()
        return props.route.params.GroupDocKey + '#' + PollName + ':' + timestamp.getTime()
    }

    function create() {
        const d = date.toLocaleDateString().split('/')
        const t = time.toLocaleTimeString().split(':')
        if (t[2].split(' ')[1] === 'PM') {
            const temp = parseInt(t[0])
            if (temp != 12) {
                t[0] = 12 + temp
            }
        } else if (t[2].split(' ')[1] === 'AM' && t[0] == '12') {
            t[0] = 0
        }
        const expirydate = new Date(parseInt(date.getFullYear()), parseInt(d[0] - 1), parseInt(d[1]), t[0], parseInt(t[1]))
        const options = defopt.concat(opt)
        const givenChoices = {}
        options.forEach(element => {
            givenChoices[element] = 0
        });

        firebase
            .firestore()
            .collection('Polls')
            .doc(BuildDocKey())
            .set({
                Name: PollName,
                Question: ques,
                Options: options,
                expiry_date: expirydate.toLocaleString(),
                givenChoices: givenChoices,
                submittedUsers: []
            }).then(() => {
                firebase
                    .firestore()
                    .collection('GroupBadge')
                    .doc(props.route.params.GroupDocKey)
                    .get()
                    .then((doc) => {
                        const usersBadgeDetails = Object.keys(doc.data())
                        // updateBadge(userBadgeDetails)
                        for (let index = 0; index < usersBadgeDetails.length; index++) {
                            let underScoreTemp = usersBadgeDetails[index].split("_").join(".")
                            if (doc.data()[usersBadgeDetails[index]].primary === 0
                                && doc.data()[usersBadgeDetails[index]].others === 0
                                && doc.data()[usersBadgeDetails[index]].activities === 0) {
                                firebase.firestore().collection('Users').doc(underScoreTemp).update({
                                    [`group`]: firebase.firestore.FieldValue.increment(1)
                                })
                            }
                            firebase.firestore().collection('GroupBadge').doc(props.route.params.GroupDocKey).update({
                                [`${usersBadgeDetails[index]}.activities`]: firebase.firestore.FieldValue.increment(1)
                            })
                        }
                    })
            })
        props.navigation.navigate('POLL')
    }

    function remove(e, val, ind) {
        if (val != '') {
            setOpt(opt.filter(e => e != val))

        } else {
            let temp = [...opt]
            temp.splice(ind, 1)
            setOpt(temp)
        }
    }

    function add(text, ind) {
        let temp = [...opt]
        temp[ind] = text
        setOpt(temp)

    }

    function defadd(text, ind) {
        let temp = [...defopt]
        temp[ind] = text
        setDef(temp)

    }

    const fun = opt.map((cv, n) =>
        <View key={n} style={{
            flex: 1,
            flexDirection: 'row', width: '90%'
        }}
        >
            <Input
                placeholder={'Choice ' + String(n + 3)}
                multiline={true}
                onChangeText={(t) => add(t, n)}
                value={cv}

            />
            <TouchableOpacity
                onPress={(e) => remove(e, cv, n)}>
                <Icon
                    name='close'
                    type='evilicon'
                    size={40}
                    onPress={(e) => remove(e, cv, n)}
                />
            </TouchableOpacity>
        </View>)

    function func() {
        setOpt(prevopt => [...prevopt, ''])
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Dimensions.get('window').height / 6 + 50}>
            <ScrollView>
                <Input
                    label='Poll Name'
                    placeholder='Name of the POLL'
                    onChangeText={setName}
                    labelStyle={{ color: '#000', fontWeight: 'normal', fontSize: 17 }}
                />
                <Input
                    label='Question'
                    placeholder='Write down your Poll'
                    onChangeText={setQues}
                    labelStyle={{ color: '#000', fontWeight: 'normal', fontSize: 17 }}
                />
                <BackdropProvider>
                    <Text style={{ paddingLeft: 10, fontWeight: 'normal', color: 'black', fontSize: 17, paddingBottom: 10 }}>Deadline</Text>
                    <View style={styles.picker1}>
                        <Icon
                            name='calendar'
                            type='evilicon'
                            size={40}
                            style={{ paddingRight: 20, paddingBottom: 20 }}
                        />
                        <DatePicker title="Pick a date" value={date} onChange={setDate}
                            initialValue={date} />
                    </View>
                    <View style={styles.picker}>
                        <Icon
                            name='clock'
                            type='evilicon'
                            size={40}
                            style={{ paddingRight: 20, paddingBottom: 20 }}
                        />
                        <TimePicker placeholder="Pick a time" value={time} onChange={setTime} initialValue={time} />
                    </View>
                </BackdropProvider>

                <Input
                    label='Choices'
                    placeholder='Choice 1'
                    onChangeText={(t) => defadd(t, 0)}
                    labelStyle={{ color: '#000', fontWeight: 'normal', fontSize: 17, paddingTop: 25 }}
                />
                <Input
                    placeholder='Choice 2'
                    onChangeText={(t) => defadd(t, 1)}
                />
                <>{fun}</>

                <View style={styles.picker1}>
                    <Icon
                        name='plus'
                        type='evilicon'
                        size={40}
                        onPress={func}
                    />
                    <Button
                        title='ADD Choice'
                        type='clear'
                        onPress={func}
                    />

                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                    <Button title='Create' buttonStyle={{ backgroundColor: '#9477cb', borderRadius: 10 }} style={{ width: 200, margin: 10, }} disabled={bool} onPress={(props) => create(props)} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    picker1: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#96999C',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        paddingTop: 0
    },
    picker: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#96999C',
        borderBottomWidth: 1,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        paddingTop: 20,
        paddingBottom: 5,
        alignItems: 'center'
    },
    TI: {
        width: Dimensions.get('window').width - 40,
        borderBottomWidth: 1,
        borderBottomColor: '#96999C',
        fontSize: 18,
        paddingLeft: 10,
        borderBottomStartRadius: 15,
    }
});
