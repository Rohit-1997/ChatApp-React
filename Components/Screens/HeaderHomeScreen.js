import React from 'react';
import MainScreen from './MainScreen';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Octicons';

const Stack = createStackNavigator();
export default function HeaderHomeScreen({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MSIT Connect"
                component={MainScreen}
                options={{
                    headerTintColor: '#FFFFFF',
                    headerStyle: {
                        backgroundColor: '#9477cb'
                    },
                    headerLeft: () => (
                        <Icon
                            style={{ paddingLeft: 15 }}
                            name='three-bars'
                            size={35}
                            color='#FFFFFF'
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                    headerRight: () => (
                        <Icon
                            style={{ paddingRight: 15 }}
                            name='search'
                            size={25}
                            color='#FFFFFF'
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    );
}
