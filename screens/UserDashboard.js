import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UserHome from './UserScreens/UserHome';
import HeaderHomeScreen from '../Components/Screens/HeaderHomeScreen';

// This is a temporary component to navigate back to the dashboard screen
function TestScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
}

// Drawer object for navigation
const Drawer = createDrawerNavigator();

export default function UserDashboard() {
    return (
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home" component={UserHome} />
              <Drawer.Screen name="Notifications" component={TestScreen} />
              <Drawer.Screen name="ProfileSettings" component={TestScreen} />
              <Drawer.Screen name="Security" component={TestScreen} />
            </Drawer.Navigator>
      );
}

const styles = StyleSheet.create({
    tabs: {
      backgroundColor: '#9477cb',
    },
  });
  