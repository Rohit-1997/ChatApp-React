import React from 'react';
import { StyleSheet, YellowBox } from 'react-native';
import firebase from 'firebase';
import { firebaseConfig } from './config';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './screens/Login';
import UserDashboard from './screens/UserDashboard';
import Loading from './screens/Loading';
import ShowImage from './screens/UserScreens/MenuScreens/ShowImage';
// import { AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import IconBadge from 'react-native-icon-badge';
import Individual from './screens/UserScreens/UserTabScreens/Individual';
import ProfileSettingsUser from './screens/UserScreens/MenuScreens/ProfileSettings';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
firebase.initializeApp(firebaseConfig);


export default function App() {

  console.log("The main app component rendering");
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Loading' component={Loading} options={{ headerShown: false }} />
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='UserDashboard' component={UserDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileSettingsUser" component={ProfileSettingsUser} options={{
            headerStyle: {
              backgroundColor: '#9477cb',
            },
            headerTintColor: '#fff',
          }} />
          <Stack.Screen name='ShowImage' component={ShowImage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

}

// 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
});
