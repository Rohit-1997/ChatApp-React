import * as React from 'react';
import { View, Text } from 'react-native';

export default function chatPerson(props) {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                Hello from chat Person
            </Text>
        </View>
    )
}