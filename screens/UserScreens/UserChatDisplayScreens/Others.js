import * as React from 'react';
import { Text, View } from 'react-native';


export default function Others(props) {

    return (
        <View>
            {/* {console.log("The props in the others view: ", props.senderName, props.currentUser)} */}
            <Text>
                Hello from other chat view
            </Text>
        </View>
    )
}