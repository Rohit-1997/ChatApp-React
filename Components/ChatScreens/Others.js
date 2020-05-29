import React from 'react';
import { Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

export default function OthersTabScreen() {
    const insets = useSafeArea();
    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text>Others Chat Screen!!</Text>
        </View>
    );
}
