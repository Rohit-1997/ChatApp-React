import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function Individual(props) {
    console.log("The props of navigaton in individual: ", props.navigation.navigate);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                Hello from Individual.js
            </Text>
            <Button title="Click me" onPress={() => props.navigation.navigate("Chat View")}/>
        </View>
    )
}