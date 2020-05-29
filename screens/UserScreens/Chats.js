import * as React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

export default function Chats(props) {    // Styling the headers
    props.navigation.setOptions({
        title: "Msit Connect",
        headerLeft: () => (
            <Icon 
                name="three-bars" 
                style={{ paddingLeft: 15 }}
                size={35}
                color='#000'
                onPress={() => props.navigation.openDrawer()}
            />
        )
    })

    console.log("The props in chats", props);
    return (
        <View>
            <Text>Hello from chats yo baocn</Text>
        </View>
    )
}